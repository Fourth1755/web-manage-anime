"use client";
import { Dialog,DialogHeader,DialogFooter,Button,DialogBody } from "../mtailwind";
type PropsAlertModal = {
    open: boolean;
    handler: () => void;
    message: string
};

export default function AlertModal(props:PropsAlertModal){
    const { open ,message } = props
    const handleOpen = props.handler;
    return (
        <>
            <Dialog
                open={open}
                handler={handleOpen}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                size="sm"
            >
                <DialogHeader>แจ้งเตือน</DialogHeader>
                <DialogBody className="space-y-4 pb-6">
                    <h2>{message}</h2>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="green"
                        onClick={handleOpen}
                    >
                        <span>OK</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
        )
}