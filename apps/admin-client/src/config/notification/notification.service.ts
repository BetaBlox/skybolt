import { toast } from "react-toastify";

interface NotificationService {
  success: (message?: string) => void;
  info: (message: string) => void;
  error: (message?: string) => void;
}
export const Notify: NotificationService = {
  success: (message: string = "Saved!") => {
    toast.success(message);
  },
  info: (message: string) => {
    toast.info(message);
  },
  error: (message: string = "Sorry, something isn't working.") => {
    toast.error(message);
  },
};
