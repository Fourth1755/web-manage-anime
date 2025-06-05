"use client";
import { Dialog,DialogHeader,DialogFooter,Button,DialogBody,Typography } from "../mtailwind";
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
                size='xs'
            >
                <DialogHeader className="grid place-items-center gap-4">
                    <Typography className="text-center" variant="h3">แจ้งเตือน</Typography>
                </DialogHeader>
                <DialogBody className="grid place-items-center gap-4">
                    <Typography className="text-center font-normal">{message}</Typography>
                </DialogBody>
                <DialogFooter className="space-x-2">
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={handleOpen}
                        className="m-auto"
                    >
                        <span>OK</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
        )
}