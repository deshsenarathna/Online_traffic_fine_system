import apiClient from "./apiClient";

/**
 * POST /api/auth/register
 * @param {string} username
 * @param {string} password
 * @returns {{ message: string }}
 */
export async function registerRequest(username, password) {
  const response = await apiClient.post("/auth/register", { username, password });
  return response.data;
}
