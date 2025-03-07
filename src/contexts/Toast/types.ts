export enum ToastType {
  SUCCESS,
  WARN,
  FAILURE,
  INFO
}

export interface ToastData {
  id: string;
  body: string;
  type: ToastType;
  autoDismiss?: boolean;
}


export interface ToastParams  {
  show: () => void;
  data: Array<ToastData>;
}
