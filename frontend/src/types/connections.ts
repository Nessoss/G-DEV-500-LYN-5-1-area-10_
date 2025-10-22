export interface ConnectionStatus {
  provider: string
  connected: boolean
  connectedAt?: string | null
}

export interface ConnectionsResponse {
  connections: ConnectionStatus[]
}
