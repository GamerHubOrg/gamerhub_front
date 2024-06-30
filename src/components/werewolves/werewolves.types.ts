import { IGameData, IRoomData, SocketUser } from "@/types/interfaces";

export type IWerewolvesGameState = 'night' | 'day';

export type IWerewolvesCamp = 'wolve' | 'villager' | 'solo';

export interface IWerewolvesPlayer extends SocketUser {
  role: WerewolfRole,
}

export interface IWerewolvesRoomData extends IRoomData {
  users: IWerewolvesPlayer[];
  config?: IWerewolvesConfig;
  gameData?: IWerewolvesGameData;
}

export type IWerewolvesComposition = Record<string, number>;

export interface IWerewolvesConfig {
  maxPlayers: number;
  composition: IWerewolvesComposition;
}

export interface WerewolfRole {
  name: string;
  camp: string;
  description: string;
  isAlive: boolean;
  isBeingKilled: boolean;
  deathTurn?: number;
  picture: string;
  power: {
    name: string;
    description: string;
  };
}

export type TRoleName = 'Loup' | 'Sorcière' | 'Chasseur' | 'Voyante' | 'Villageois' | 'Voleur' | 'Cupidon';

export interface IWerewolvesGameData extends IGameData {
  wolfVotes: IWerewolvesVote[],
  villageVotes: IWerewolvesVote[],
  tmpVotes: Partial<IWerewolvesVote>[],
  roleTurn?: TRoleName;
  state: IWerewolvesGameState;
  campWin?: IWerewolvesCamp;
  turn: number;
}

export interface IWerewolvesVote {
  playerId: string;
  vote: string;
  turn: number;
}
