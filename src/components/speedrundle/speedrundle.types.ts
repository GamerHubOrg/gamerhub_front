import { IRoomConfig } from "@/types/interfaces";

export type SpeedrundleMode = 'classic' | 'less_trials';

export type SpeedrundleTheme = 'lol' | 'pokemon' | 'marvel';

export interface ISpeedrundleConfig extends IRoomConfig {
    mode: SpeedrundleMode;
    theme: SpeedrundleTheme;
    roundsNumber: number;
}