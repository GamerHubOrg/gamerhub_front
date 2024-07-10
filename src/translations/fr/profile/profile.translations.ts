import IProfileTranslations from "@/translations/types/profile.translations.types";

const frProfileTranslations: IProfileTranslations = {
  tabs: {
    profile: "Profile",
    history: "Historique",
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
      oldPass: "",
      newPass: "",
      confirmPass: "",
    },
    deleteModal: {
      confirm: "",
      pass: "",
      button: "",
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
          error: "Erreur lors de l'enregistrement"
      }
  },
};

export default frProfileTranslations;
