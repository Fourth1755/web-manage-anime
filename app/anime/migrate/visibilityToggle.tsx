"use client";

import { useState } from "react";
import type { GetAnimeList } from "@/app/api/dtos/anime";
import { setAnimeVisibility } from "./action";

export default function VisibilityToggle({ anime }: { anime: GetAnimeList }) {
    const [visible, setVisible] = useState(anime.is_show);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    async function toggle() {
        if (pending || typeof visible !== "boolean") return;
        setPending(true);
        setError("");
        try {
            const response = await setAnimeVisibility(anime.id, anime.my_anime_list_id, !visible);
            if (response.success) setVisible(!visible);
            else setError(response.error ?? "Unable to update visibility.");
        } catch {
            setError("Unable to update visibility. Please try again.");
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="space-y-1">
            <button type="button" role="switch" aria-checked={visible === true} aria-label={`Show ${anime.name}`}
                disabled={pending || typeof visible !== "boolean"} onClick={toggle}
                className="inline-flex items-center gap-2 rounded-lg px-2 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink-600 disabled:opacity-50">
                <span aria-hidden="true" className={`flex h-6 w-11 items-center rounded-full p-0.5 ${visible ? "bg-pink-600" : "bg-gray-300"}`}>
                    <span className={`h-5 w-5 rounded-full bg-white transition-transform ${visible ? "translate-x-5" : "translate-x-0"}`} />
                </span>
                <span>{pending ? "Saving…" : typeof visible !== "boolean" ? "Unavailable" : visible ? "On" : "Off"}</span>
            </button>
            {typeof visible !== "boolean" && <p className="text-xs text-gray-600">Visibility could not be loaded.</p>}
            {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
        </div>
    );
}
