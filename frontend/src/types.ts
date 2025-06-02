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

export type Event = {
  id: number;
  title: string;
};

export type FamilyMember = {
  id: number;
  name: string;
};
