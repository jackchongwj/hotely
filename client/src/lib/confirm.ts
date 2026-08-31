type Listener = () => void;

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger: boolean;
}

// Shared mutable state — one active dialog at a time
let _state: ConfirmState = { isOpen: false, title: 'Confirm', message: '', confirmLabel: 'Confirm', danger: false };
let _resolve: ((v: boolean) => void) | null = null;
const _listeners = new Set<Listener>();

const notify = () => _listeners.forEach(l => l());

export const getConfirmState = () => ({ ..._state });

export const subscribeConfirm = (fn: Listener): (() => void) => {
  _listeners.add(fn);
  return () => { _listeners.delete(fn); };
};

export const resolveConfirm = (value: boolean) => {
  _state = { ..._state, isOpen: false };
  notify();
  _resolve?.(value);
  _resolve = null;
};

interface ConfirmOptions {
  title?: string;
  confirmLabel?: string;
  danger?: boolean;
}

export const confirm = (message: string, opts: ConfirmOptions = {}): Promise<boolean> =>
  new Promise(resolve => {
    _resolve = resolve;
    _state = {
      isOpen:       true,
      message,
      title:        opts.title        ?? 'Confirm',
      confirmLabel: opts.confirmLabel ?? 'Confirm',
      danger:       opts.danger       ?? true,
    };
    notify();
  });
