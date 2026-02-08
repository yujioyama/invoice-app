export type Task = {
  name: string;
  rate: number;
  hours: number;
};

export type Invoice = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
  clientId?: string | null;
};

export type CreateInvoiceInput = {
  name: string;
  userId: string;
  tasks: Task[];
  clientId?: string | null;
};
