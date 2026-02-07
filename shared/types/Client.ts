export type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address: string;
  country: string;
};

export type CreateClientInput = {
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address: string;
  country: string;
};
