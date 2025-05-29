export interface FamilyMember {
  id: number;
  name: string;
  role: string;
  profile_image: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  event_date: string;
  family_member_ids: number[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  event_id: number | null;
  family_member_ids: number[];
}