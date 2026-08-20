export const AUTH_STORAGE_KEY = "hackers-campus-auth";

export type AuthSession = {
  accessToken: string;
  username: string;
  userId: string;
  role: string;
};

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return value ? JSON.parse(value) as AuthSession : null;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("hackers-campus-auth-change"));
}

export function clearSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event("hackers-campus-auth-change"));
}
