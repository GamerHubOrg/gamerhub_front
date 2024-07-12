import ILobbyTranslations from "@/translations/types/lobby.translations.types";

const enLobbyTranslations: ILobbyTranslations = {
  title: "Game room",
  needToAuth: "You need to be authenticated to play",
  waitingRoom : "Waiting room",
  soonStart : "The game will start soon...",
  notInRoom: {
    gameSelect: "@.capitalize:shared.games select",
    newRoom: "@:lobby.notInRoom.create room",
    create: "@.capitalize:shared.create",
    or: "or",
    joinRoom: "Join room",
    join: "Join",
  },
  roomSettings: {
    kick: "Kick",
    promote: "Promote",
    settings: "Settings",
    changeGame: "Change @.capitalize:shared.games",
    minimumPlayers: "Minimum players number",
    leave: "Leave room",
    start: "Start",
    restart: "Restart",
    backToLobby: "Back to lobby",
    share: "Share config",
    joinGame : "@:lobby.notInRoom.join @:shared.games"
  },
};

export default enLobbyTranslations;
