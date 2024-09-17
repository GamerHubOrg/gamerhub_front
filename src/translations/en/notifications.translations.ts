import INotificationsTranslations from "../types/notifications.translations.types";

const enNotificationsTranslations: INotificationsTranslations = {
  room: {
    gameStarted: "This game has already started, please wait until it finishes.",
    alreadyFull: "This game has already reached the maximum number of players.",
    notEnoughPlayers: "There are no longer enough players to continue the game.",
    userNotInRoom: "This user is not in the room.",
    ownerNotFound: "Unable to find the room owner.",
    promoted: "You have been promoted to room owner.",
  },
  speedrundle: {
    selectTheme: "Please select a theme for the game.",
    selectClues: "Please select at least 1 clue.",
    youGuessed: "You guessed {name} !",
    giveUp: "You gave up this round, the answer was {name} !",
  },
  undercover: {
    playerEliminated: "{name} have been eliminated !",
    youEliminated: "You have been eliminated !",
    voteEqual: "Vote ended up with a tie",
  },
};

export default enNotificationsTranslations;
