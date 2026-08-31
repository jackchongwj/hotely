import toast from 'react-hot-toast';

export const toastSuccess = (msg: string) => toast.success(msg, { duration: 3000 });
export const toastError   = (msg: string) => toast.error(msg,   { duration: 4000 });
export const toastLoading = (msg: string) => toast.loading(msg);
export const toastDismiss = (id: string)  => toast.dismiss(id);

export default toast;
