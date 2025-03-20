import { generateCode } from "@/lib/generateCode";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { AccountType, JoinStatus, Permission, Role, User } from "@prisma/client";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    try {
        const user =  await currentUser()
        if(!user){
            throw new Error("Please sign in to continue")
        }
        const body = await req.json();
        const {fullName,businessEmail,organizationCode,accountType,organizationName} = body;
        if(accountType === 'personal'){
            await createPersonalAccount(user.id,fullName,businessEmail,organizationCode)
            return NextResponse.json({message:'Personal account created successfully'},{status:200})
        }
        else if(accountType === 'create'){
            await createOrganizationAccount(user.id,fullName,businessEmail,organizationName)
            return NextResponse.json({message:'Organization account created successfully'},{status:200})
        }
        else if(accountType === 'join'){
            await joinOrganization(organizationCode,user.id,fullName,businessEmail)
            return NextResponse.json({message:'Organization joined successfully'},{status:200})
        }
        else{
            throw new Error("Invalid account type")
        }
    } catch (error) {
        console.log("Error",error)
        return NextResponse.json({error:'Failed to create organization'},{status:500})
    }
}


const createPersonalAccount = async (id:string, fullName:string,businessEmail:string,organizationCode:string)=>{

    try{
        const newPersonalAccount = await prisma.$transaction(async (tx)=>{
             return await Promise.all([
                tx.user.create({
                    data:{
                        id,
                        name:fullName,
                        email:businessEmail,
                        accountType:AccountType.PERSONAL,
                        personalAccount:{
                        create:{
                            businessName: '',
                            settings:{
                                create:{
                                    businessEmail:businessEmail,
                                    businessName: '',
                                }
                            },
                            

                        }
                    },
                    
                },
                include:{
                    personalAccount:true
                }
            }),
            tx.user.update({
                where:{id},
                data:{
                    isOnboarded:true
                    
                }
            })
        ])

        })
        const accountId = newPersonalAccount[0].personalAccount?.id
        if(!accountId){
            throw new Error("Personal account not found")
        }
        await setUserSession(accountId,AccountType.PERSONAL)

    }catch(error){
        console.log(error)
        throw error
    }

}


const createOrganizationAccount = async (id:string, fullName:string,businessEmail:string,organizationName:string)=>{
    try{
        const newOrganizationAccount = await prisma.$transaction(async (tx)=>{
            const [use] = await Promise.all([
                tx.user.create({
                    data:{
                        id,
                        name:fullName,
                        email:businessEmail,
                        accountType:AccountType.ORGANIZATION,
                        
                    }
                })
            ])
            const organization = await tx.organization.create({
                data:{
                    name: organizationName,
                    code:generateCode(),
                    members:{
                        create:{
                            userId:id,
                            role:Role.ADMIN,
                            permissions:Object.values(Permission)
                        }
                    },
                    settings:{
                        create:{
                            businessEmail:businessEmail,
                            businessName:organizationName
                        }
                    },
                }
            })
            return {organization}
        })
        const organizationId = newOrganizationAccount.organization.id
        if(!organizationId){
            throw new Error("Organization not found")
        }
        await prisma.user.update({
            where:{id},
            data:{
                isOnboarded:true
            }
        })
        await setUserSession(organizationId,AccountType.ORGANIZATION,Role.ADMIN)
    }
    catch(error){
        console.log(error)
        throw error
    }

}

const joinOrganization = async (code:string,id:string,fullName:string,businessEmail:string)=>{
    try{
        const organizationExist = await prisma.organization.findUnique({
            where:{
                code:code
            }
        })
        if(!organizationExist){
            throw new Error("Organization not found")
        }
        const userExistInOrganization = await prisma.organizationMember.findFirst({
            where:{
                organizationId:organizationExist.id,
                userId:id
            }
        })
        if(userExistInOrganization){
            throw new Error("User already in organization")
        }

        const isRequestAlreadyAccepted = await prisma.organizationJoinRequest.findFirst({
            where:{
                organizationId:organizationExist.id,
                userId:id,
            }
        })
        if(isRequestAlreadyAccepted && isRequestAlreadyAccepted.status === JoinStatus.APPROVED){
            throw new Error("User already in this organization")
        }
        if(isRequestAlreadyAccepted && isRequestAlreadyAccepted.status === JoinStatus.PENDING){
            throw new Error("Request already sent")
        }
        const user = await prisma.user.create({
            data:{
                id:id,
                name:fullName,
                email:businessEmail,
                accountType:AccountType.ORGANIZATION,
            }
        })
        if(!user){
            throw new Error("Failed to create user")
        }
        const newMemberApplication = await prisma.organizationJoinRequest.create({
            data:{
                organizationId:organizationExist.id,
                userId:id,
                status:JoinStatus.PENDING,
                email:businessEmail
            }
        })
        if(!newMemberApplication){
            await prisma.user.delete({
                where:{id:id}
            })
            throw new Error("Failed to create organization join request")
        }
        return {message:'Organization join request sent successfully'}
    }
    catch(error){
        console.log(error)
        throw error
    }
}



export async function GET(){
    try {
        const user =  await currentUser()
        if(!user){
            throw new Error("Please sign in to continue")
        }
        const onboardingCompleted = await prisma.user.findFirst({
            where:{
                id:user.id,
                isOnboarded:true
            }
        })
        if(!onboardingCompleted){
            return NextResponse.json({message:'Onboarding is not completed'},{status:201})
        }
        return NextResponse.json({message:'Onboarding completed successfully'},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'Failed to complete onboarding'},{status:500})
    }
}



const setUserSession = async (accountId:string,accountType:AccountType,role?:Role)=>{
    const { userId } = await auth()

    if (!userId) {
      return { message: 'No Logged In User' }
    }
  
    const client = await clerkClient()
    try {
        if(accountType === AccountType.PERSONAL){
            const res = await client.users.updateUser(userId, {
                publicMetadata: {
                    role: null,
                    accountType: accountType,
                    isSuperAdmin: false,
                    organizationId: null,
                    personalAccountId: accountId,
                    onboardingCompleted: true
                },
              })
              return { message: res.publicMetadata }
        }
        else if(accountType === AccountType.ORGANIZATION){
            const res = await client.users.updateUser(userId, {
                publicMetadata: {
                    role: role,
                    accountType: accountType,
                    isSuperAdmin: false,
                    organizationId: accountId,
                    onboardingCompleted: true
                },
              })
              return { message: res.publicMetadata }
        }

    } catch (err) {
      return { error: 'There was an error updating the user metadata.' }
    }
   
}