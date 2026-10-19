import { apiRequest } from "./client";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export const userQueryKey = ["user", "me"] as const;

export const getCurrentUser = (accessToken: string) =>
  apiRequest<UserProfile>("/user/me", accessToken);

export const updateCurrentUser = (accessToken: string, name: string) =>
  apiRequest<UserProfile>("/user/me", accessToken, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });

export const changePassword = (
  accessToken: string,
  payload: { oldPassword: string; newPassword: string },
) =>
  apiRequest<null>("/auth/change-password", accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const deleteCurrentUser = (accessToken: string) =>
  apiRequest<null>("/user/me", accessToken, { method: "DELETE" });
