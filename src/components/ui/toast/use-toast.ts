import { ref } from "vue";

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

type Toast = ToastProps & {
  id: string;
};

const toasts = ref<Toast[]>([]);

export function useToast() {
  function toast(props: ToastProps) {
    const id = Date.now().toString();
    const duration = props.duration ?? 3000;

    const newToast: Toast = {
      ...props,
      id,
    };

    toasts.value.push(newToast);

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }

  function dismiss(id: string) {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  }

  return {
    toast,
    dismiss,
    toasts,
  };
}