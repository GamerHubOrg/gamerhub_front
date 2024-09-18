import { IWerewolvesTranslations } from "@/translations/types/games.translations.types";


const frWerewolvesTranslations: IWerewolvesTranslations = {
  record: {
    deadCount: "Nombre de morts",
    composition: "Composition"
  },
  roles: {
    cupidon: {
      name: "Cupidon",
      powerName: "Flêche de l'amour",
      powerDescription: "Vous choisissez deux personnes qui vont tomber amoureux l'une de l'autre",
    },
    hunter: {
      name: "Chasseur",
      powerName: "Après la mort",
      powerDescription: "Vous pouvez entrainer un autre joueur avec vous",
    },
    psychic: {
      name: "Voyante",
      powerName: "Omnisience",
      powerDescription: "Vous pouvez connaitre le rôle d'un joueur chaque tour",
    },
    thief: {
      name: "Voleur",
      powerName: "Dérober",
      powerDescription: "Vous choisissez votre rôle parmis deux possibilitées",
    },
    villager: {
      name: "Villageois",
      powerName: "Rien",
      powerDescription: "Vous êtes la pour applaudir ceux qui ont des pouvoirs...",
    },
    witch: {
      name: "Sorcière",
      powerName: "Potions",
      powerDescription: "Vous disposez d'une potion pouvant tuer un joueur et d'une potion pouvant ressuciter un joueur",
    },
    wolf: {
      name: "Loup",
      powerName: "Repas nocturne",
      powerDescription: "Décider d'une cible à dévorer avec les autres loups",
    },
  },
  camps: {
    wolves: "loups",
    village: "village",
    solo: "solo",
    couple: "couple"
  },
  configs: {},
  game: {
    cupidonPower: {
      title: 'Cupidon',
      subtitle: 'Choisissez le couple de la partie',
      choosePlayer: 'Choisir un joueur',
    },
    hunterPower: {
      title: 'Chasseur',
      subtitle: "Vous avez été tué. Emportez quelqu'un avec vous",
      shoot: 'Tirer'
    },
    psychicPower: {
      title: 'Voyante',
      subtitle: 'Selectionnez un joueur pour voir son role',
      watch: 'Voir le role',
      waiting: 'En attente des autres voyantes...'
    },
    thiefPower: {
      title: 'Voleur',
      subtitle: 'Choisissez un role pour jouer la partie',
      waiting: 'En attente des autres voleurs...'
    },
    villagePower: {
      title: 'Village',
      subtitle: 'Désignez la personne à éliminer',
      wantVoteFor: 'veut voter pour',
      votedFor: 'a voté pour',
      waiting: 'En attente du vote des autres joueurs',
      confirm: 'Confirmer le vote',
    },
    witchPower: {
      title: 'Sorcière',
      subtitle: 'Voulez vous utiliser une de vos potions cette nuit ?',
      save: 'Sauver',
      kill: 'Empoisonner',
      doNothing: 'Ne rien faire',
      waiting: 'En attente des autres sorcières...'
    },
    wolfPower: {
      title: 'Loups',
      subtitle: 'Selectionnez votre victime pour cette nuit',
    },
    timeline: {
      turn: 'tour',
      deaths: 'morts',
      night: 'Nuit',
      day: 'Jour',
      stealRole: 'a volé le role de',
      whoBecome: 'qui devient donc',
      united: 'a uni',
      and: 'et',
      untilDeath: "jusqu'à ce que la mort les sépare",
      watchedRole: 'a regardé le role de',
      wolfKilled: 'Les loups ont décidés de tuer',
      killPotionUsed: 'utilisé une potion pour tuer',
      savePotionUsed: 'utilisé une potion pour sauver',
      coupleDeadWolf: 'est mort cette nuit. Dans un élan de chagrin,',
      coupleDeadVillage: 'est mort par le village. Dans un élan de chagrin,',
      suicide: 'se donne la mort',
      hunterDeadNight: 'Le chasseur est mort durant la nuit.',
      shootOn: 'a tiré sur',
      villagersKilled: 'Les villageois ont décidés de tuer'
    },
    campWin: {
      wolvesWin: 'Tous les villageois sont morts, les loups remporte la partie !',
      villageWin: 'Tous les loups sont morts, les villageois remporte la partie !',
      soloWin: 'Après avoir trahis son camp et tuer tous les autres joueurs, il remporte la partie !',
      draw: 'Tous les joueurs sont morts, la partie se solde par une égalité !',
      wolvesWinTitle: 'Victoire des loups',
      villageWinTitle: 'Victoire du village',
      coupleWinTitle: 'Victoire du couple',
      soloWinTitle: "Victoire d'un role solitaire",
      drawTitle: 'Égalité',
    },
    roleModal: {
      title: 'Voici votre role'
    },
    state: {
      day: 'Jour ☀️',
      night: 'Nuit 🌙',
      playMyTurn: 'Jouer mon tour',
      psychic: 'La voyante se réveille et regarde dans sa boule de cristal...',
      witch: 'La sorcière se réveille et prépare ses potions...',
      thief: 'Le voleur se réveille, faites attention à vos affaires...',
      cupidon: 'Cupidon ouvre les yeux et décoche une fléche de son arc...',
      wolf: 'Les loups se réveillent et choisissent leur proie...',
      village: 'Les villageois se réveillent et se réunissent autour du feu pour élucider cette histoire de Loup-Garou infiltré au sein du village...',
      hunter: "Le chasseur est mort... Il va tirer sur quelqu'un pour l'entrainer dans chute",
    }
  }
};

export default frWerewolvesTranslations;
