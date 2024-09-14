import { IWerewolvesTranslations } from "@/translations/types/games.translations.types";


const enWerewolvesTranslations: IWerewolvesTranslations = {
  record: {
    deadCount: "Number of deaths",
    composition: "Composition"
  },
  roles: {
    cupidon: {
      name: "Cupid",
      powerName: "Arrow of love",
      powerDescription: "You choose two people who will fall in love with each other"
    },
    hunter: {
      name: "Hunter",
      powerName: "After death",
      powerDescription: "You can drag another player with you"
    },
    psychic: {
      name: "Clairvoyant",
      powerName: "Omniscient",
      powerDescription: "You can know the role of a player each turn"
    },
    thief: {
      name: "Thief",
      powerName: "Steal",
      powerDescription: "You choose your role from two possibilities"
    },
    villager: {
      name: "Villagers",
      powerName: "Nothing",
      powerDescription: "You are here to applaud those who have powers..."
    },
    witch: {
      name: "Witch",
      powerName: "Potions",
      powerDescription: "You have a potion that can kill a player and a potion that can revive a player"
    },
    wolf: {
      name: "Wolf",
      powerName: "Night meal",
      powerDescription: "Decide on a target to devour with the other wolves"
    }
  },
  camps: {
    wolves: "wolves",
    village: "village",
    solo: "solo",
    couple: "couple"
  },
  configs: {},
  game: {
    cupidonPower: {
      title: "Cupid",
      subtitle: "Choose the couple of the party",
      choosePlay: "Choose a player"
    },
    hunterPower: {
      title: "Hunter",
      subtitle: "You have been killed. ",
      shoot: "To pull"
    },
    psychicPower: {
      title: "Psychic",
      subtitle: "Select a player to see their role",
      watch: "See the role",
      waiting: "Waiting for the other psychics..."
    },
    thiefPower: {
      title: "Thief",
      subtitle: "Choose a role to play the game",
      waiting: "Waiting for the other thieves..."
    },
    villagePower: {
      title: "Village",
      subtitle: "Designate the person to be eliminated",
      wantVoteFor: "wants to vote for",
      votedFor: "voted for",
      waiting: "Waiting for other players to vote",
      confirm: "Confirm vote"
    },
    witchPower: {
      title: "Witch",
      subtitle: "Do you want to use one of your potions tonight?",
      save: "Save",
      kill: "Poison",
      doNothing: "Do nothing",
      waiting: "Waiting for the other witches..."
    },
    wolfPower: {
      title: "Wolves",
      subtitle: "Select your victim for this night"
    },
    timeline: {
      turn: "round",
      deaths: "dead",
      night: "Night",
      day: "Day",
      stealRole: "stole the role of",
      whoBecome: "which therefore becomes",
      united: "united",
      and: "And",
      untilDeath: "until death do them part",
      watchedRole: "looked at the role of",
      wolfKilled: "The wolves have decided to kill",
      killPotionUsed: "used a potion to kill",
      savePotionUsed: "used a potion to save",
      coupleDeadWolf: "died last night. ",
      coupleDeadVillage: "died by the village. ",
      suicide: "kills oneself",
      hunterDeadNight: "The hunter died during the night.",
      shootOn: "shot",
      villagersKilled: "The villagers decided to kill"
    },
    campWin: {
      wolvesWin: "All the villagers are dead, the wolves win the game!",
      villageWin: "All the wolves are dead, the villagers win the game!",
      soloWin: "After betraying his side and killing all the other players, he wins the game!",
      draw: "All players are dead, the game ends in a tie!",
      wolvesWinTitle: "Wolves victory",
      villageWinTitle: "Village victory",
      coupleWinTitle: "Victory for the couple",
      soloWinTitle: "Victory of a solitary role",
      drawTitle: "Equality"
    },
    roleModal: {
      title: "This is your role"
    },
    state: {
      day: "Day ☀️",
      night: "Night 🌙",
      playMyTurn: "Take my turn",
      psychic: "The psychic wakes up and looks into her crystal ball...",
      witch: "The witch wakes up and prepares her potions...",
      thief: "The thief wakes up, mind your things...",
      cupidon: "Cupid opens his eyes and shoots an arrow from his bow...",
      wolf: "The wolves wake up and choose their prey...",
      village: "The villagers wake up and gather around the fire to elucidate this story of a Werewolf infiltrated within the village...",
      hunter: "The hunter is dead... He is going to shoot someone to cause them to fall"
    }
  }
};

export default enWerewolvesTranslations;
