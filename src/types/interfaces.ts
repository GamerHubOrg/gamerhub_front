import { User } from "@/modules/auth/user";

export interface SocketUser extends User {
    socket_id: string;
    isOwner?: boolean;
}

export interface IRoomData {
    users: SocketUser[];
    config: IRoomConfig;
}

export interface IRoomConfig {
    maxPlayers: number;
}