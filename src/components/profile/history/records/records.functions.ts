import { useI18n } from "vue-i18n";

export const getTimeAgo = (createdAt: string) => {
  const { t } = useI18n();
  const now = new Date();

  const diffMs = now.getTime() - new Date(createdAt).getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ${t("shared.time." + "days", days)}`;
  } else if (hours > 0) {
    return `${hours} ${t("shared.time." + "hours", hours)}`;
  } else if (minutes > 0) {
    return `${minutes} ${t("shared.time." + "minutes", minutes)}`;
  } else {
    return `${seconds} ${t("shared.time." + "seconds", seconds)}`;
  }
};
