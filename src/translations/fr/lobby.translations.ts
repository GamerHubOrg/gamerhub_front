import ILobbyTranslations from "@/translations/types/lobby.translations.types";

const frLobbyTranslations: ILobbyTranslations = {
  title: "Salon de jeu",
  needToAuth: "Vous devez être authentifié pour jouer",
  waitingRoom : "Salon d'attente",
  soonStart : "La partie va bientôt commencer...",
  notInRoom: {
    gameSelect: "Choix du @:shared.games",
    newRoom: "@:lobby.notInRoom.create un salon",
    create: "@.capitalize:shared.create",
    or: "ou",
    joinRoom: "Rejoindre un salon",
    join: "Rejoindre",
  },
  roomSettings: {
    kick: "Exclure",
    promote: "Promouvoir",
    settings: "Paramètres",
    changeGame: "Changer de @.capitalize:shared.games",
    minimumPlayers: "Nombre de joueurs minimum",
    leave: "Quitter le salon",
    start: "Démarrer",
    restart: "Redémarrer",
    backToLobby: "Retourner au lobby",
    share: "Partager la config",
    joinGame : "@:lobby.notInRoom.join le @:shared.games"
  },
};

export default frLobbyTranslations;
