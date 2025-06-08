export interface User {
  id: number;
  name: string;
  password: string;
  email: string;
  token?: string | null;
}

export interface FamilyMember {
  id: number;
  user_id: number;
  name: string;
  role: string;
  profile_image?: string | null;
}

export interface Category {
  id: number;
  name: string;
  color?: string | null;
  icon?: string | null;
}

export interface Event {
  id: number;
  title: string;
  description?: string | null;
  event_date: string; // ISO string, t.ex. '2025-06-08'
  start_time?: string | null; // t.ex. '13:00:00'
  end_time?: string | null;
  user_id: number;
  family_member_id?: number | null;
  category_id?: number | null;
}

export type Task = {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  recurring_weekdays?: string[];
  family_member_ids: number[];
  event_id?: number;
};


export interface TaskWeekday {
  task_id: number;
  weekday: number; // 1–7
}

export interface EventFamilyMember {
  event_id: number;
  family_member_id: number;
}

export interface TaskFamilyMember {
  task_id: number;
  family_member_id: number;
}

