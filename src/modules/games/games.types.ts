import { IGameConfigProperties } from "@/types/interfaces";

export interface Config {
    _id: string,
    game: string,
    upvotes: number,
    options: Partial<IGameConfigProperties>,
    userId: string,
    createdAt: string,
    name: string,
  }