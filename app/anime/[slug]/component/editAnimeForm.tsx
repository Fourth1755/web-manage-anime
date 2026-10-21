"use client";

import { useState, type FormEvent } from "react";
import { Button, Input, Option, Select, Textarea, Typography } from "@material-tailwind/react";
import type { GetAnimeByIdResponse } from "@/app/api/dtos/anime";
import { updateAnime } from "../../component/action";

export default function EditAnimeForm({ anime }: { anime: GetAnimeByIdResponse }) {
    const [nameThai, setNameThai] = useState(anime.name_thai ?? "");
    const [description, setDescription] = useState(anime.description ?? "");
    const [isSubAnime, setIsSubAnime] = useState(anime.is_sub_anime);
    const [isShow, setIsShow] = useState(anime.is_show);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (pending) return;
        setPending(true);
        setError("");
        setSaved(false);
        try {
            const result = await updateAnime({
                id: anime.id,
                name_thai: nameThai,
                description,
                ...(typeof isSubAnime === "boolean" ? { is_sub_anime: isSubAnime } : {}),
                ...(typeof isShow === "boolean" ? { is_show: isShow } : {}),
            });
            if (result.success) setSaved(true);
            else setError(result.error ?? "Unable to save anime. Please try again.");
        } catch {
            setError("Unable to save anime. Please try again.");
        } finally {
            setPending(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} onChange={() => setSaved(false)} className="min-w-0 rounded-xl border border-blue-gray-100 bg-gray-50 p-5">
            <Typography variant="h5" color="blue-gray" className="mb-5">Edit Anime</Typography>
            <fieldset disabled={pending} className="min-w-0 space-y-5">
                <Input label="Anime Thai name" name="name_thai" crossOrigin={undefined}
                    value={nameThai} onChange={(event) => setNameThai(event.target.value)} />
                <Textarea label="Description" name="description" rows={6}
                    value={description} onChange={(event) => setDescription(event.target.value)} />
                <Select label="Is Sub Anime" color="green" value={isSubAnime?.toString() ?? ""}
                    onChange={(value) => { setIsSubAnime(value === "true"); setSaved(false); }} disabled={pending}>
                    <Option value="false">No</Option>
                    <Option value="true">Yes</Option>
                </Select>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span id="anime-is-show-label" className="text-sm font-medium text-blue-gray-900">Is Show</span>
                    <button type="button" role="switch" aria-checked={isShow === true} aria-labelledby="anime-is-show-label"
                        disabled={pending || typeof isShow !== "boolean"}
                        onClick={() => { setIsShow(!isShow); setSaved(false); }}
                        className="inline-flex items-center gap-2 rounded-lg px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600 disabled:opacity-50">
                        <span aria-hidden="true" className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${isShow ? "bg-green-600" : "bg-gray-300"}`}>
                            <span className={`h-5 w-5 rounded-full bg-white transition-transform ${isShow ? "translate-x-5" : "translate-x-0"}`} />
                        </span>
                        <span className="text-sm">{typeof isShow !== "boolean" ? "Unavailable" : isShow ? "On" : "Off"}</span>
                    </button>
                </div>
                {typeof isShow !== "boolean" && <p className="text-xs text-gray-600">Visibility could not be loaded.</p>}
                <Button type="submit" color="green" variant="gradient" disabled={pending}>
                    {pending ? "Saving…" : "Save"}
                </Button>
            </fieldset>
            {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
            {saved && <p role="status" className="mt-3 text-sm text-green-700">Anime saved.</p>}
        </form>
    );
}
