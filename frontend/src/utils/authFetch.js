import { API_BASE } from "../config/api";

export async function authFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
    },
  });

  // 🔐 CENTRALIZED AUTH HANDLING
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Force redirect (guarantees Navbar update)
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
}
