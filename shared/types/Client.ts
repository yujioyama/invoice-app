export type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address: string;
};

export type CreateClientInput = {
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address: string;
};
