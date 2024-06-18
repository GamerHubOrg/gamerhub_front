export type User = {
  _id: string,
  email: string,
  username: string,
  firstname: string,
  lastname: string,
  picture?: string,
  roles: string[]
};