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

/*
export type Event = {
  id: number;
  title: string;
};
*/

export type Event = {
  id: number;
  title: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  description: string | null;
  user_id: number;
  family_member_ids?: number[];
  family_members?: {
    id: number;
    name: string;
    role: string;
    profile_image?: string;
  }[];
};

export type FamilyMember = {
  id: number;
  name: string;
  role: string;
  profile_image?: string;
};
