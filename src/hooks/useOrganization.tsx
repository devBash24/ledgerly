"use client"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Permission } from '@prisma/client';

export const useOrganization = () => {
  const queryClient = useQueryClient();

  // Fetch organization data
  const { data, isLoading } = useQuery({
    queryKey: ['organization'],
    queryFn: async () => {
      const response = await api.get('/organization');
      return response.data;
    },
  });

  // Handle all mutations through a single endpoint
  const organizationMutation = useMutation({
    mutationFn: async (params: { action: string; [key: string]: any }) => {
      const response = await api.post('/organization', params);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      toast.success('Organization updated successfully');
    },
    onError: () => {
      toast.error('Failed to update organization');
    },
  });

  // Helper functions for different actions
  const updatePermission = (memberId: string, permission: Permission, value: boolean) => {
    organizationMutation.mutate({ 
      action: 'UPDATE_PERMISSION', 
      memberId, 
      permission,
      value 
    });
  };

  const removeMember = (memberId: string) => {
    organizationMutation.mutate({ action: 'REMOVE_MEMBER', memberId });
  };

  const handleJoinRequest = (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    organizationMutation.mutate({ action: 'HANDLE_REQUEST', requestId, status });
  };

  return {
    members: data?.members ?? [],
    joinRequests: data?.requests ?? [],
    organizationCode: data?.organizationCode ?? '',
    currentUserId: data?.currentUserId ?? '',
    isLoading,
    updatePermission,
    removeMember,
    handleJoinRequest,
  };
};
