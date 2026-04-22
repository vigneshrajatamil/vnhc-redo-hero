// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL ?? "";

// Make sure to include credentials so cookies (session and CSRF) are sent!
const defaultOptions: RequestInit = {
  credentials: "omit", // We will change this to include
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
};

// Helper to reliably get a cookie by name
function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Always attach credentials for sessions and set headers
  const reqOptions: RequestInit = {
    ...options,
    credentials: "include", // Required for Django sessions
    headers: {
      ...options.headers,
    },
  };

  // If this is a mutating request, we need the CSRF cookie
  if (
    options.method &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(options.method.toUpperCase())
  ) {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      // @ts-ignore - Headers object supports setting strings
      reqOptions.headers["X-CSRFToken"] = csrfToken;
    }
  }

  // Ensure JSON content type if body is present and not FormData
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    // @ts-ignore
    !reqOptions.headers["Content-Type"]
  ) {
     // @ts-ignore
     reqOptions.headers["Content-Type"] = "application/json";
     // @ts-ignore
     reqOptions.headers["Accept"] = "application/json";
  } else if (options.body instanceof FormData) {
      // Browsers will automatically set boundary for multipart form data if content-type is omitted.
      // So if it's form data, we must remove the manual content-type header.
      if (reqOptions.headers) {
          // @ts-ignore
          delete reqOptions.headers["Content-Type"];
      }
  }

  const response = await fetch(`${API_URL}${endpoint}`, reqOptions);

  // Attempt to parse JSON response. Could be 401, 200, 400 etc.
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const errorMsg = data?.error || `API Error: ${response.status} ${response.statusText}`;
    if (response.status === 401 && !endpoint.includes("/auth/")) {
      // Unauthenticated, trigger a global redirect if not an auth call
      window.location.href = "/admin/login";
    }
    throw new Error(errorMsg);
  }

  return { response, data };
}

// Global initialization: Get the CSRF cookie on initial load
export function initCsrfToken() {
  fetchApi("/api/auth/csrf/", { method: "GET" }).catch(err => {
      console.log("CSRF token init failed:", err);
  });
}
