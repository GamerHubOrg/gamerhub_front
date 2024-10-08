import { IGameData, IRoomData, SocketUser } from "@/types/interfaces";

export type IWerewolvesGameState = 'night' | 'day';

export type IWerewolvesCamp = 'wolves' | 'village' | 'solo';

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
  thief = 'games.werewolves.roles.thief.name',
  wolf = 'games.werewolves.roles.wolf.name',
  witch = 'games.werewolves.roles.witch.name',
  hunter = 'games.werewolves.roles.hunter.name',
  psychic = 'games.werewolves.roles.psychic.name',
  villager = 'games.werewolves.roles.villager.name',
  cupidon = 'games.werewolves.roles.cupidon.name',
}

export type ILinkedWerewolfRoles = Record<string, WerewolfRole>;

export interface IWerewolvesSwapedRoles {
  playerId: string;
  target: string;
  turn: number;
  roles: ILinkedWerewolfRoles;
}

export interface IWerewolvesGameData extends IGameData {
  wolfVotes: IWerewolvesTarget[];
  villageVotes: IWerewolvesTarget[];
  tmpVotes: Partial<IWerewolvesTarget>[];
  witchSaves?: IWerewolvesTarget[];
  witchKills?: IWerewolvesTarget[];
  witchSkips?: IWerewolvesTarget[];
  hunterKills?: IWerewolvesTarget[];
  thiefUsers?: string[];
  couple?: IWerewolvesCouple;
  psychicWatch?: IWerewolvesTarget[];
  roles: ILinkedWerewolfRoles;
  swapedRoles?: IWerewolvesSwapedRoles[];
  roleTurn?: EWerewolvesRoleName | 'Village';
  state: IWerewolvesGameState;
  campWin?: IWerewolvesCamp;
  turn: number;
  usersThatPlayed: IWerewolvesPlayer[];
}

export type IWerewolvesCouple = string[];

export interface IWerewolvesTarget {
  playerId: string;
  target: string;
  turn: number;
}
