const API_URL = import.meta.env.VITE_API_URL || "";
const STORAGE_KEY = "zorvyn-auth";

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

export function getStoredSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeSession(session) {
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      payload?.details?.[0]?.message ||
      "Something went wrong.";
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const authService = {
  login: (data) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  register: (data) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  me: () => request("/api/auth/me"),
};

export const dashboardService = {
  summary: (params) => {
    const query = new URLSearchParams(
      Object.entries(params || {}).filter(([, value]) => value)
    );
    return request(`/api/dashboard/summary${query.size ? `?${query}` : ""}`);
  },
  search: (query) => request(`/api/dashboard/search?query=${encodeURIComponent(query)}`),
};

export const recordService = {
  list: (params) => {
    const query = new URLSearchParams(
      Object.entries(params || {}).filter(([, value]) => value !== "" && value != null)
    );
    return request(`/api/records${query.size ? `?${query}` : ""}`);
  },
  create: (data) =>
    request("/api/records", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/api/records/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id) =>
    request(`/api/records/${id}`, {
      method: "DELETE",
    }),
  exportCSV: async (params) => {
    const query = new URLSearchParams(
      Object.entries(params || {}).filter(([, value]) => value !== "" && value != null)
    );
    const headers = {};
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    const response = await fetch(`${API_URL}/api/records/export/csv${query.size ? `?${query}` : ""}`, {
      headers,
    });
    if (!response.ok) throw new Error("Export failed");
    return response.blob();
  },
};

export const userService = {
  list: () => request("/api/users"),
  update: (id, data) =>
    request(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export { STORAGE_KEY };
