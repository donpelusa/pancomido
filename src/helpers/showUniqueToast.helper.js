// frontend/src/helpers/showUniqueToast.helper.js
import { toast } from "react-toastify";

export const showUniqueToast = {
    info: (message, options = {}) => {
        if (toast.isActive(message)) return;
        toast.info(message, { toastId: message, ...options });
    },
    success: (message, options = {}) => {
        if (toast.isActive(message)) return;
        toast.success(message, { toastId: message, ...options });
    },
    warning: (message, options = {}) => {
        if (toast.isActive(message)) return;
        toast.warning(message, { toastId: message, ...options });
    },
    error: (message, options = {}) => {
        if (toast.isActive(message)) return;
        toast.error(message, { toastId: message, ...options });
    },
};
