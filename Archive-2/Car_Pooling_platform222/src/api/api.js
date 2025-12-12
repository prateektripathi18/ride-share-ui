// src/api/api.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function getToken() {
    return localStorage.getItem("token");
}

export async function apiFetch(path, opts = {}) {
    const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
    const token = getToken();

    const headers = new Headers(opts.headers || {});
    if (opts.body && !(opts.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const finalOpts = {
        method: opts.method || "GET",
        headers,
        body:
            opts.body && !(opts.body instanceof FormData) && typeof opts.body === "object"
                ? JSON.stringify(opts.body)
                : opts.body,
    };

    const res = await fetch(url, finalOpts);
    
    // Handle empty responses or non-JSON
    const text = await res.text();
    const data = text ? (() => {
        try { return JSON.parse(text); }
        catch(e) { return text; }
    })() : null;

    if (!res.ok) {
        const err = new Error((data && data.message) || (typeof data === "string" ? data : res.statusText));
        err.status = res.status;
        err.body = data;
        throw err;
    }

    return data;
}

export const apiGet = (path, opts = {}) => apiFetch(path, { ...opts, method: "GET" });
export const apiPost = (path, body, opts = {}) => apiFetch(path, { ...opts, method: "POST", body });
export const apiPut = (path, body, opts = {}) => apiFetch(path, { ...opts, method: "PUT", body });
export const apiDelete = (path, opts = {}) => apiFetch(path, { ...opts, method: "DELETE" });

export default apiFetch;