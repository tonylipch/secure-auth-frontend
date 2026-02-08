const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const jsonHeaders = {
  "Content-Type": "application/json"
};

const authHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseJson = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await parseJson(response);
  if (!response.ok) {
    const error = data?.message || `HTTP ${response.status}`;
    throw new Error(error);
  }
  return data;
};

export const api = {
  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    request("/api/auth/login", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload)
    }),
  login2fa: (payload) =>
    request("/api/auth/login/2fa", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload)
    }),
  me: () =>
    request("/api/users/me", {
      headers: {
        ...authHeaders()
      }
    }),
  changePassword: (payload) =>
    request("/api/users/change-password", {
      method: "POST",
      headers: { ...jsonHeaders, ...authHeaders() },
      body: JSON.stringify(payload)
    }),
  setup2fa: () =>
    request("/api/users/2fa/setup", {
      method: "POST",
      headers: { ...authHeaders() }
    }),
  verify2fa: (payload) =>
    request("/api/users/2fa/verify", {
      method: "POST",
      headers: { ...jsonHeaders, ...authHeaders() },
      body: JSON.stringify(payload)
    }),
  disable2fa: (payload) =>
    request("/api/users/2fa/disable", {
      method: "POST",
      headers: { ...jsonHeaders, ...authHeaders() },
      body: JSON.stringify(payload)
    })
};

export const oauthGoogleUrl = `${API_BASE_URL}/oauth2/authorization/google`;
