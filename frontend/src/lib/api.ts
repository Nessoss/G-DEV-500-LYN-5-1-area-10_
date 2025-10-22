import type {
  ServicesResponse,
  AreasResponse,
  Area,
  CreateAreaPayload,
  UpdateAreaStatusPayload,
} from "@/types/area"

// Error handling
type ErrorPayload = {
  message?: string | string[]
  [key: string]: unknown
}

export class ApiError extends Error {
  status: number
  payload?: ErrorPayload

  constructor(message: string, status: number, payload?: ErrorPayload) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.payload = payload
  }
}

async function parseError(response: Response): Promise<never> {
  let message = `Unexpected error (${response.status})`
  let payload: ErrorPayload | undefined

  try {
    payload = (await response.json()) as ErrorPayload
    if (payload?.message) {
      message = Array.isArray(payload.message)
        ? payload.message.join(" ")
        : String(payload.message)
    }
  } catch {
    try {
      const text = await response.text()
      if (text) {
        message = text
      }
    } catch {
      // Ignore parsing errors and keep default message
    }
  }

  throw new ApiError(message, response.status, payload)
}

// Get authentication token from localStorage or sessionStorage
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null

  // Try localStorage first (remember me = true)
  const localToken = localStorage.getItem("auth_access_token")
  if (localToken) return localToken

  // Fallback to sessionStorage (remember me = false)
  return sessionStorage.getItem("auth_access_token")
}

// Generic fetch function with auth
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()

  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  })

  if (!response.ok) {
    await parseError(response)
  }

  return (await response.json()) as T
}

// API functions

/**
 * Get all available services with their actions and reactions
 */
export async function getServices(): Promise<ServicesResponse> {
  return fetchWithAuth<ServicesResponse>("/api/services")
}

/**
 * Get all areas for the authenticated user
 */
export async function getAreas(): Promise<AreasResponse> {
  return fetchWithAuth<AreasResponse>("/api/areas")
}

/**
 * Create a new area
 */
export async function createArea(payload: CreateAreaPayload): Promise<Area> {
  return fetchWithAuth<Area>("/api/areas", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

/**
 * Update area status (enable/disable)
 */
export async function updateAreaStatus(
  areaId: number,
  payload: UpdateAreaStatusPayload
): Promise<Area> {
  return fetchWithAuth<Area>(`/api/areas/${areaId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

/**
 * Delete an area
 */
export async function deleteArea(areaId: number): Promise<void> {
  await fetchWithAuth<void>(`/api/areas/${areaId}`, {
    method: "DELETE",
  })
}

/**
 * Store authentication token in localStorage
 */
export function setAuthToken(token: string, rememberMe = true): void {
  if (typeof window !== "undefined") {
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem("auth_access_token", token)
  }
}

/**
 * Remove authentication token from both localStorage and sessionStorage
 */
export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_access_token")
    sessionStorage.removeItem("auth_access_token")
  }
}
