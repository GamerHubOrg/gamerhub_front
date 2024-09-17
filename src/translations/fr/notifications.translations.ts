import INotificationsTranslations from "../types/notifications.translations.types";

const frNotificationsTranslations: INotificationsTranslations = {
  room: {
    gameStarted: "Cette partie est déjà lancée, veuillez attendre la fin.",
    alreadyFull: "Cette partie a déjà atteint le nombre maximal de joueurs.",
    notEnoughPlayers: "Il n y a plus assez de joueurs pour continuer la partie.",
    userNotInRoom: "Cet utilisateur n'est pas dans le salon.",
    ownerNotFound: "Impossible de trouver le propriétaire du salon.",
    promoted: "Tu as été promu propriétaire du salon.",
  },
  speedrundle: {
    selectTheme: "Veuillez sélectionner un thème pour la partie.",
    selectClues: "Veuillez sélectionner au moins 1 indices.",
    youGuessed: "Vous avez trouvé {name} !",
    giveUp: "Vous avez abandonné ce tour, la réponse était {name} !",
  },
  undercover: {
    playerEliminated: "{name} a été éliminé !",
    youEliminated: "Vous avez été éliminé !",
    voteEqual: "Le vote s'est soldé par une égalité.",
  },
};

export default frNotificationsTranslations;
