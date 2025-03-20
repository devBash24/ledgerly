"use server"

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export const handlePrismaError = (error: unknown) => {
    if(error instanceof PrismaClientKnownRequestError){
        switch(error.code){
            case "P2002":
                return {message: "A record with this value already exists", status: 400}
            case "P2014":
                return {message: "The change you are trying to make would violate database constraints", status: 400}
            case "P2003":
                return {message: "Invalid input data", status: 400}
            case "P2025":
                return {message: "Record not found", status: 404}
            case "P2018":
                return {message: "Required related record was not found", status: 400}
            default:
                return {message: "An error occurred", status: 500}
        }
    }
    return {message: "An error occurred", status: 500}
}
