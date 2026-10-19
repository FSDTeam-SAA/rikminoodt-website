"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  deleteCurrentUser,
  getCurrentUser,
  updateCurrentUser,
  userQueryKey,
} from "./user";

export const useCurrentUser = (accessToken?: string) =>
  useQuery({
    queryKey: userQueryKey,
    queryFn: () => getCurrentUser(accessToken!),
    enabled: Boolean(accessToken),
  });

export const useUpdateCurrentUser = (accessToken?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => updateCurrentUser(accessToken!, name),
    onSuccess: ({ data }) => {
      queryClient.setQueryData(userQueryKey, { data, message: "User profile updated successfully" });
    },
  });
};

export const useChangePassword = (accessToken?: string) =>
  useMutation({
    mutationFn: (payload: { oldPassword: string; newPassword: string }) =>
      changePassword(accessToken!, payload),
  });

export const useDeleteCurrentUser = (accessToken?: string) =>
  useMutation({
    mutationFn: () => deleteCurrentUser(accessToken!),
  });
