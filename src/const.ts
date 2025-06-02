const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.example.com' // 本番環境
    : 'http://127.0.0.1:8000'; // 開発環境

const version = 'v0.1';
export const API_URLS = {
  LOGIN: `${API_BASE_URL}/${version}/login/`,
  LOGOUT: `${API_BASE_URL}/auth/logout/`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/token/refresh/`,
  USERS: `${API_BASE_URL}/${version}/users/`,
  THREADS: `${API_BASE_URL}/${version}/threads/`,
  COMMENTS: `${API_BASE_URL}/${version}/comments/`,
  ME: `${API_BASE_URL}/${version}/me/`,
};
