export interface IStripeConfig {
  subscriptionId?: string;
  customerId?: string;
}

export interface User {
  _id: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  picture?: string;
  roles: string[];
  stripe: IStripeConfig;
};