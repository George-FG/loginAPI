const API_BASE = "https://api.george.richmond.gg";

export type AuthResponse = {
  username?: string;
  token?: string;
  message?: string;
  status?: string;
};

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function parseErrorBody(res: Response): Promise<{ message: string; body?: unknown }> {
  const contentType = res.headers.get("content-type") || "";
  try {
    if (contentType.includes("application/json")) {
      const body = await res.json();
      const msg =
        (typeof body === "object" && body && "message" in body && typeof (body as any).message === "string")
          ? (body as any).message
          : `Request failed (${res.status})`;
      return { message: msg, body };
    }
    const text = await res.text();
    return { message: text || `Request failed (${res.status})` };
  } catch {
    return { message: `Request failed (${res.status})` };
  }
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "credentials": "include" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const { message, body } = await parseErrorBody(res);
    throw new ApiError(res.status, message, body);
  }

  // Some endpoints might return empty body; handle that safely
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return {} as T;
  }

  return (await res.json()) as T;
}

export function signup(req: { username: string; password: string }): Promise<AuthResponse> {
  return postJson<AuthResponse>("/api/signup", req);
}

export function login(req: { username: string; password: string }): Promise<AuthResponse> {
  return postJson<AuthResponse>("/api/login", req);
}
