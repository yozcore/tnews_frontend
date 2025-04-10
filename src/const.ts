const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.example.com' // 本番環境
    : 'http://192.168.11.9:8000/v0.1'; // 開発環境

export const API_URLS = {
  LOGIN: `${API_BASE_URL}/login/`,
  USERS: `${API_BASE_URL}/users/`,
  THREADS: `${API_BASE_URL}/threads/`,
  COMMENTS: `${API_BASE_URL}/comments/`,
  ME: `${API_BASE_URL}/me/`,
};
