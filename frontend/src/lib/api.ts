/**
 * Service API pour les appels au backend via le proxy Next.js
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    username?: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  username?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

/**
 * Authentification - Login
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || "Erreur lors de la connexion");
  }

  return response.json();
}

/**
 * Authentification - Register
 */
export async function register(data: RegisterData): Promise<{ message: string; user: { id: string; email: string; username?: string } }> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || "Erreur lors de l'inscription");
  }

  return response.json();
}

/**
 * Récupération du token d'accès depuis localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

/**
 * Sauvegarde du token d'accès dans localStorage
 */
export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", token);
}

/**
 * Suppression du token d'accès (logout)
 */
export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
}

/**
 * Vérification si l'utilisateur est authentifié
 */
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}
