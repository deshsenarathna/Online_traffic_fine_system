import apiClient from "./apiClient";

/**
 * POST /api/auth/login
 * @param {string} username
 * @param {string} password
 * @returns {{ token: string, username: string, role: string }}
 */
export async function loginRequest(username, password) {
  const response = await apiClient.post("/auth/login", { username, password });
  return response.data;
}
