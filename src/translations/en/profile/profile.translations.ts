import IProfileTranslations from "@/translations/types/profile.translations.types";

const enProfileTranslations: IProfileTranslations = {
  tabs: {
    profile: "Profile",
    history: "Game history",
  },
  profileTab: {
    username: "Username",
    email: "Email address",
    imageUrl: "Image URL",
    button: {
      save: "Save",
      changePass: "Change password",
      deleteAccount: "Delete account",
    },
    changeModal: {
      oldPass: "Old password",
      newPass: "New password",
      confirmPass: "Confirm password",
    },
    deleteModal: {
      confirm: "Are you sure you want to delete your account ?",
      pass: "Type your password to confirm",
      button: "Delete my account",
    },
  },
  toasts: {
    changePass: {
      success: "The password has been changed",
      error: "An error has occured while updating",
    },
    deleteAccount: {
      success: "Your account has been deleted",
      error: "An error has occured while deleting",
    },
    changeUser: {
      success: "Your changes have been saved",
      error: "An error has occured while saving",
    },
  },
  historyTab: {
    refresh: "Refresh",
    loadMore: "Load more",
    viewConfig : "View config",
    ago: `{time} ago`,
  }
};

export default enProfileTranslations;
