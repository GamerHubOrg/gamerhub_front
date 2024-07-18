interface IRoomTranslations {
  logs : string;
  notifications: {
    roomDeleted : string;
    roomKicked : string;
    roomNotExist : string;
    userNotAuth : string;
  };
}

export default IRoomTranslations;
