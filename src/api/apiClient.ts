const BASE_URL = "http://100.105.194.90:8000/api";

async function request<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const token = localStorage.getItem("access_token");
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    let response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Если токен истек (401)
    if (response.status === 401) {
        const refresh = localStorage.getItem("refresh_token");
        if (refresh) {
            try {
                // Пытаемся обновить токен
                const refreshResponse = await fetch(
                    `${BASE_URL}/token/refresh/`,
                    {
                        method: "POST",
                        body: JSON.stringify({ refresh }),
                        headers: { "Content-Type": "application/json" },
                    },
                );

                if (refreshResponse.ok) {
                    const { access } = await refreshResponse.json();
                    localStorage.setItem("access_token", access);

                    // Повторяем исходный запрос с новым токеном
                    const newHeaders = {
                        ...headers,
                        Authorization: `Bearer ${access}`,
                    };
                    response = await fetch(`${BASE_URL}${endpoint}`, {
                        ...options,
                        headers: newHeaders,
                    });
                } else {
                    throw new Error("Refresh token expired");
                }
            } catch (e) {
                // Если рефреш не удался — окончательно выходим
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                throw new Error("Session expired");
            }
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    return response.json();
}

export const apiClient = {
    get: <T>(url: string) => request<T>(url, { method: "GET" }),
    post: <T>(url: string, body: any) =>
        request<T>(url, {
            method: "POST",
            body: JSON.stringify(body),
        }),
    delete: (url: string) => request(url, { method: "DELETE" }),
};
