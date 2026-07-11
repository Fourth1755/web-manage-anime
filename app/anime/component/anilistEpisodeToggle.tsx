"use client";

import { useState, useTransition } from "react";
import { Switch, Typography } from "@/app/component/mtailwind";
import { updateAnilistEpisodeSetting } from "./action";

type Props = { animeId: string; initialValue?: boolean };

export default function AnilistEpisodeToggle({ animeId, initialValue = false }: Props) {
  const [isActive, setIsActive] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const nextValue = !isActive;
    setErrorMessage("");
    startTransition(async () => {
      const response = await updateAnilistEpisodeSetting(animeId, { is_active: nextValue });
      if (!response.success || !response.data) {
        setErrorMessage(response.error ?? "Failed to update setting");
        return;
      }
      setIsActive(response.data.is_active);
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <Switch
        crossOrigin={undefined}
        ripple={false}
        checked={isActive}
        disabled={isPending}
        onChange={handleToggle}
        className="h-full w-full checked:bg-pink-500"
        containerProps={{ className: "w-11 h-6" }}
        circleProps={{ className: "before:hidden left-0.5 border-none" }}
        label={<span className="text-xs text-gray-600">{isPending ? "Updating..." : isActive ? "Active" : "Inactive"}</span>}
      />
      {errorMessage ? <Typography variant="small" className="text-xs text-red-500">{errorMessage}</Typography> : null}
    </div>
  );
}
