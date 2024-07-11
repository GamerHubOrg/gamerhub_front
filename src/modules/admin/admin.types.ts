export interface IBanishment {
  _id: string;
  email: string;
  ip?: string;
  type: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}