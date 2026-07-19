"use client";

import { useState } from "react";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from "../../component/mtailwind";
import { createCategoryUniverse } from "./action";

type Props = {
    open: boolean;
    handler: () => void;
};

export default function CreateCategoryUniverseModal({ open, handler }: Props) {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await createCategoryUniverse({ name, image });
        setName("");
        setImage("");
        handler();
    };

    return (
        <Dialog open={open} handler={handler} size="xs">
            <DialogHeader>Create Category Universe</DialogHeader>
            <form onSubmit={handleSubmit}>
                <DialogBody className="space-y-4 pb-6">
                    <Input
                        label="Name"
                        crossOrigin={undefined}
                        name="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                    <Input
                        label="Image"
                        crossOrigin={undefined}
                        name="image"
                        value={image}
                        onChange={(event) => setImage(event.target.value)}
                    />
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" type="button" onClick={handler} className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" type="submit">
                        <span>Create</span>
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
