
export enum EnotificationType  {
    SUCCESS = 'success',
    ERROR = "error",
    INFO = "info"
}

export const handleNotification = (win: any, message: string, type: EnotificationType, clb: any =()=>{}, goto ={})=>{
    let classes = "";
    if(type == EnotificationType.SUCCESS) classes = "bg-green fg-white";
    if(type == EnotificationType.ERROR) classes = "bg-alert fg-white";
    if(type == EnotificationType.INFO) classes = "bg-info fg-white";
    const opts ={
        callback: clb,
        timeout: 3000,
        showTop: true,
        clsToast: classes
    };
    win.Metro.toast.create(message,null, null, null, opts);
}