import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { getUserId } from '../services/api';

export const useUser = (isEnabled) => {
    const queryClient = useQueryClient();
    const userId = getUserId();

    const profileQuery = useQuery({
        queryKey: ['userProfile', userId],
        queryFn: () => userService.getUserById(userId),
        enabled: isEnabled && !!userId,
        retry: false, // Don't retry on 404, implies user needs creation
    });

    const createProfileMutation = useMutation({
        mutationFn: userService.createUser, // Was createProfile, now createUser
        onSuccess: (data) => {
            queryClient.setQueryData(['userProfile', userId], data);
        },
    });

    return {
        profile: profileQuery.data,
        isLoading: profileQuery.isLoading,
        error: profileQuery.error,
        createProfile: createProfileMutation.mutateAsync,
        isCreating: createProfileMutation.isPending,
    };
};
