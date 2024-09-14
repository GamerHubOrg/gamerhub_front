interface IProfileTranslations {
  tabs: {
    profile: string;
    history: string;
  };
  profileTab: {
    username: string;
    email: string;
    imageUrl: string;
    button: {
      save: string;
      changePass: string;
      deleteAccount: string;
    };
    changeModal: {
      oldPass: string;
      newPass: string;
      confirmPass: string;
    };
    deleteModal: {
      confirm: string;
      pass: string;
      button: string;
    };
  };
  historyTab: {
    refresh: string;
    loadMore: string;
    viewConfig: string;
    ago: string;
  };
  toasts: {
    changeUser: {
      success: string;
      error: string;
    };
    changePass: {
      success: string;
      error: string;
    };
    deleteAccount: {
      success: string;
      error: string;
    };
  };
}

export default IProfileTranslations;
