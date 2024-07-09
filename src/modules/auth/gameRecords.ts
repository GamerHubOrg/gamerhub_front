import {
  ICharacter,
  IColumn,
  ISpeedrundleAnswer,
  ISpeedrundleConfig,
} from "@/components/games/speedrundle/speedrundle.types";
import { IMinifiedUser } from "./user";
import {
  IUndercoverConfig,
  IUndercoverVote,
  IUndercoverWords,
} from "@/components/games/undercover/undercover.types";
import { IWerewolvesTarget, ILinkedWerewolfRoles, IWerewolvesCamp, IWerewolvesConfig } from "@/components/games/werewolves/werewolves.types";

export interface IGameRecord {
  _id: string;
  gameName: "speedrundle" | "werewolves" | "undercover";
  users: string[];
  usersData: IMinifiedUser[];
  createdAt: Date;
  updatedAt: Date;
  config: Record<string, any>;
}

export interface ISpeedrundleRecord extends IGameRecord {
  columns: IColumn[];
  charactersToGuess: string[];
  usersAnswers: ISpeedrundleAnswer[];
  charactersData: Partial<ICharacter>[];
  config: ISpeedrundleConfig;
}

export interface IUndercoverRecord extends IGameRecord {
  words: IUndercoverWords[];
  votes: IUndercoverVote[];
  civilianWord: string;
  spyWord: string;
  undercoverPlayerIds: string[];
  campWin: string;
  config: IUndercoverConfig;
}

export interface IWerewolvesRecord extends IGameRecord {
  wolfVotes?: IWerewolvesTarget[];
  villageVotes?: IWerewolvesTarget[];
  witchSaves?: IWerewolvesTarget[];
  witchKills?: IWerewolvesTarget[];
  hunterKills?: IWerewolvesTarget[];
  psychicWatch?: IWerewolvesTarget[];
  roles: ILinkedWerewolfRoles;
  swapedRoles?: ILinkedWerewolfRoles;
  thiefUsers?: string[];
  couple?: string[];
  campWin?: IWerewolvesCamp;
  usersThatPlayed?: string[];
  config: IWerewolvesConfig;
}

export type GameRecord = IGameRecord | ISpeedrundleRecord | IUndercoverRecord;
