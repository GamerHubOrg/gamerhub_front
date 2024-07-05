import { IGameData, IRoomData, SocketUser } from "@/types/interfaces";

export type IWerewolvesGameState = 'night' | 'day';

export type IWerewolvesCamp = 'wolve' | 'villager' | 'solo';

export interface IWerewolvesPlayer extends SocketUser {}

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
    killPotionUsed?: boolean;
    savePotionUsed?: boolean;
  };
}

export enum EWerewolvesRoleName {
  thief = 'Voleur',
  wolf = 'Loup',
  witch = 'Sorcière',
  hunter = 'Chasseur',
  psychic = 'Voyante',
  villager = 'Villageois',
  cupidon = 'Cupidon',
}

export type ILinkedWerewolfRoles = Record<string, WerewolfRole>;

export interface IWerewolvesGameData extends IGameData {
  wolfVotes: IWerewolvesVote[];
  villageVotes: IWerewolvesVote[];
  tmpVotes: Partial<IWerewolvesVote>[];
  witchSaves?: IWerewolvesSave[];
  witchKills?: IWerewolvesKill[];
  hunterKills?: IWerewolvesKill[];
  thiefUsers?: string[];
  couple?: IWerewolvesCouple;
  psychicWatch?: IWerewolvesWatchRole[];
  roles: ILinkedWerewolfRoles;
  swapedRoles?: ILinkedWerewolfRoles;
  roleTurn?: EWerewolvesRoleName | 'Village';
  state: IWerewolvesGameState;
  campWin?: IWerewolvesCamp;
  turn: number;
  usersThatPlayed: IWerewolvesPlayer[];
}

export type IWerewolvesCouple = string[];

export interface IWerewolvesVote {
  playerId: string;
  vote: string;
  turn: number;
}

export interface IWerewolvesWatchRole {
  playerId: string;
  turn: number;
  watch: string;
}

export interface IWerewolvesSave {
  playerId: string;
  save: string;
  turn: number;
}

export interface IWerewolvesKill {
  playerId: string;
  kill: string;
  turn: number;
}
