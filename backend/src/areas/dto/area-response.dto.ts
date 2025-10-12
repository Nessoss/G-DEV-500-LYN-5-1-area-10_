export interface AreaServiceSummary {
  id: number;
  slug: string;
  name: string;
}

export interface AreaActionSummary {
  id: number;
  key: string;
  description: string | null;
  configSchema: unknown;
  service: AreaServiceSummary;
}

export interface AreaReactionSummary {
  id: number;
  key: string;
  description: string | null;
  configSchema: unknown;
  service: AreaServiceSummary;
}

export interface AreaResponseDto {
  id: number;
  name: string;
  enabled: boolean;
  actionConfig: Record<string, unknown> | null;
  reactionConfig: Record<string, unknown> | null;
  dedupKeyStrategy: string | null;
  createdAt: string;
  action: AreaActionSummary;
  reaction: AreaReactionSummary;
}
