export const LOCAL_STORAGE_KEY = "openai-key";

export interface Conversation {
  id: string;
  title: string;
  create_time: string;
  update_time: string;
  mapping: unknown | null;
  current_node: unknown | null;
  conversation_template_id: unknown | null;
  gizmo_id: unknown | null;
  is_archived: boolean;
  workspace_id: unknown | null;
}

export interface contributionDays {
  contributionCount: number;
  date: string;
  weekday: number;
}
export interface Week {
  contributionDays: contributionDays[];
}

export type DailyResponse = { day: string; Conversations: number };
export type WeeklyResponse = { week: string; Conversations: number };
export type MonthlyResponse = { month: string; Conversations: number };
