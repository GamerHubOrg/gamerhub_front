import IProfileTranslations from "@/translations/types/profile.translations.types";

const frProfileTranslations: IProfileTranslations = {
  tabs: {
    profile: "Profile",
    history: "Historique des parties",
  },
  profileTab: {
    username: "Nom d'utilisateur",
    email: "Adresse email",
    imageUrl: "URL de l'image",
    button: {
      save: "Sauvegarder",
      changePass: "Changer le mot de passe",
      deleteAccount: "Supprimer le compte",
    },
    changeModal: {
      oldPass: "Ancien mot de passe",
      newPass: "Nouveau mot de passe",
      confirmPass: "Confirmer le mot de passe",
    },
    deleteModal: {
      confirm: "Êtes vous sûrs de vouloir supprimer votre compte ?",
      pass: "Entrez votre mot de passe pour confirmer",
      button: "Supprimer mon compte",
    },
  },
  toasts: {
    changePass: {
      success: "Le mot de passe a bien été changé",
      error: "Erreur lors de la modification",
    },
    deleteAccount: {
      success: "L'utilisateur à bien été supprimé",
      error: "Erreur lors de la suppression",
    },
    changeUser: {
      success: "Modifications enregistrées",
      error: "Erreur lors de l'enregistrement",
    },
  },
  historyTab: {
    refresh: "Actualiser",
    loadMore: "Charger plus",
    viewConfig: "Voir la config",
    ago: `Il y a {time}`,
  },
};

export default frProfileTranslations;
