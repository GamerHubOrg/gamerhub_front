import { User } from "@/modules/auth/user";

export interface SocketUser extends User {
    socket_id: string;
    isOwner?: boolean;
}

export type GameState = "started" | "lobby";

export interface IRoomLog {
    date: Date;
    message: string;
}

export interface IRoomData {
    users: SocketUser[];
    config: IRoomConfig;
    gameState: GameState;
    logs: IRoomLog[]
}

export interface IRoomConfig {
    maxPlayers?: number;
}