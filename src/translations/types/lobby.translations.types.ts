interface ILobbyTranslations {
  title: string;
  needToAuth: string;
  waitingRoom : string;
  soonStart : string;
  notInRoom: {
    newRoom: string;
    create : string;
    gameSelect: string;
    or : string;
    joinRoom: string;
    join: string;
  };
  roomSettings: {
    kick: string;
    promote: string;
    settings: string;
    changeGame: string;
    minimumPlayers: string;
    leave: string;
    start: string;
    restart: string;
    backToLobby: string;
    share: string;
    joinGame : string;
  };
}

export default ILobbyTranslations;
