import { Notify } from "quasar";

export function useNotification() {
  const showSuccess = (message, delay = 5000, options = {}) => {
    Notify.create({
      type: "positive",
      message: message,
      timeout: delay,
      ...options,
    });
  };

  const showError = (message, delay = 5000, options = {}) => {
    Notify.create({
      type: "negative",
      message: message,
      timeout: delay,
      ...options,
    });
  };

  return { showSuccess, showError };
}
