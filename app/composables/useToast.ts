import { toast as sonnerToast } from "vue-sonner";

export interface ToastOptions {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "destructive";
  duration?: number;
}

export const useToast = () => {
  const toast = (options: ToastOptions) => {
    const {
      title,
      description,
      action,
      cancel,
      variant = "default",
      duration = 5000,
    } = options;

    if (variant === "destructive") {
      sonnerToast.error(title || "Error", {
        description,
        action: action
          ? {
              label: action.label,
              onClick: action.onClick,
            }
          : undefined,
        cancel: cancel
          ? {
              label: cancel.label,
              onClick: cancel.onClick,
            }
          : undefined,
        duration,
      });
      return;
    }

    sonnerToast(title || "Notification", {
      description,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
      cancel: cancel
        ? {
            label: cancel.label,
            onClick: cancel.onClick,
          }
        : undefined,
      duration,
    });
  };

  return {
    toast,
  };
};
