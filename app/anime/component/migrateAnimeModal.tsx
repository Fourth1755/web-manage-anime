"use client";

import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Spinner,
} from "@material-tailwind/react";
import { useState } from "react";
import { migrateSingleAnime, migrateMultipleAnime, MigrateResult } from "./action";

type Props = {
    open: boolean;
    handler: () => void;
};

type TabValue = "single" | "multiple";

export default function MigrateAnimeModal({ open, handler }: Props) {
    const [activeTab, setActiveTab] = useState<TabValue>("single");
    const [malId, setMalId] = useState("");
    const [startId, setStartId] = useState("");
    const [endId, setEndId] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MigrateResult | null>(null);

    const resetState = () => {
        setMalId("");
        setStartId("");
        setEndId("");
        setResult(null);
        setLoading(false);
    };

    const handleClose = () => {
        resetState();
        handler();
    };

    const handleMigrate = async () => {
        setLoading(true);
        setResult(null);
        let res: MigrateResult;
        if (activeTab === "single") {
            res = await migrateSingleAnime(Number(malId));
        } else {
            res = await migrateMultipleAnime(Number(startId), Number(endId));
        }
        setLoading(false);
        setResult(res);
    };

    return (
        <Dialog
            open={open}
            handler={handleClose}
            animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0.9, y: -100 } }}
            size="sm"
        >
            <DialogHeader>Migrate Anime</DialogHeader>
            <DialogBody>
                <Tabs value={activeTab}>
                    <TabsHeader>
                        <Tab value="single" onClick={() => { setActiveTab("single"); setResult(null); }}>
                            Single
                        </Tab>
                        <Tab value="multiple" onClick={() => { setActiveTab("multiple"); setResult(null); }}>
                            Multiple
                        </Tab>
                    </TabsHeader>
                    <TabsBody>
                        <TabPanel value="single" className="space-y-4 pt-4">
                            <Input
                                label="MyAnimeList ID"
                                type="number"
                                crossOrigin={undefined}
                                value={malId}
                                onChange={e => setMalId(e.target.value)}
                                disabled={loading}
                            />
                        </TabPanel>
                        <TabPanel value="multiple" className="space-y-4 pt-4">
                            <Input
                                label="Start Anime ID"
                                type="number"
                                crossOrigin={undefined}
                                value={startId}
                                onChange={e => setStartId(e.target.value)}
                                disabled={loading}
                            />
                            <Input
                                label="End Anime ID"
                                type="number"
                                crossOrigin={undefined}
                                value={endId}
                                onChange={e => setEndId(e.target.value)}
                                disabled={loading}
                            />
                        </TabPanel>
                    </TabsBody>
                </Tabs>

                {result && (
                    <p className={`mt-3 text-sm font-medium ${
                        result.alreadyExists
                            ? "text-amber-600"
                            : result.success
                            ? "text-green-600"
                            : "text-red-600"
                    }`}>
                        {result.alreadyExists
                            ? "This anime already exists in the database."
                            : result.success
                            ? "Migration completed successfully."
                            : result.error}
                    </p>
                )}
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={handleClose} className="mr-1" disabled={loading}>
                    <span>Cancel</span>
                </Button>
                <Button
                    variant="gradient"
                    color="blue"
                    onClick={handleMigrate}
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Spinner className="h-4 w-4" />
                            <span>Migrating...</span>
                        </>
                    ) : (
                        <span>Start Migrate</span>
                    )}
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
