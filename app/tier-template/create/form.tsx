'use client';

import { useState } from 'react';
import { createTierTemplate } from './action';
import { CreateTierTemplateRank } from '../../api/dtos/tierTemplate';

type CategoryUniverse = {
    id: string;
    name: string;
};

type Props = {
    categoryUniverses: CategoryUniverse[];
};

const initialRank: CreateTierTemplateRank = { name: '', color: '#ef4444' };

export default function CreateTierTemplateForm({ categoryUniverses }: Props) {
    const [name, setName] = useState('');
    const [type, setType] = useState('anime');
    const [createdBy, setCreatedBy] = useState('');
    const [image, setImage] = useState('');
    const [status, setStatus] = useState('active');
    const [visibility, setVisibility] = useState('public');
    const [categoryUniverseId, setCategoryUniverseId] = useState('');
    const [isFromAnimeCategory, setIsFromAnimeCategory] = useState(false);
    const [itemIDs, setItemIDs] = useState('');
    const [ranks, setRanks] = useState<CreateTierTemplateRank[]>([
        { name: 'S', color: '#ef4444' },
        { name: 'A', color: '#f97316' },
        { name: 'B', color: '#eab308' },
        { name: 'C', color: '#22c55e' },
        { name: 'D', color: '#3b82f6' },
    ]);

    const updateRank = (index: number, field: keyof CreateTierTemplateRank, value: string) => {
        setRanks((current) => current.map((rank, rankIndex) => rankIndex === index ? { ...rank, [field]: value } : rank));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await createTierTemplate({
            name,
            type,
            created_by: createdBy,
            image,
            status,
            visibility,
            ranks: ranks.filter((rank) => rank.name.trim()),
            item_ids: itemIDs.split(/[\s,]+/).map((itemID) => itemID.trim()).filter(Boolean),
            is_from_anime_category: isFromAnimeCategory,
            category_universe_id: categoryUniverseId,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-medium">Name<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded border p-2" /></label>
                <label className="text-sm font-medium">Created By<input required value={createdBy} onChange={(event) => setCreatedBy(event.target.value)} className="mt-2 w-full rounded border p-2" /></label>
                <label className="text-sm font-medium">Type<input required value={type} onChange={(event) => setType(event.target.value)} className="mt-2 w-full rounded border p-2" /></label>
                <label className="text-sm font-medium">Image URL<input value={image} onChange={(event) => setImage(event.target.value)} className="mt-2 w-full rounded border p-2" /></label>
                <label className="text-sm font-medium">Status<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 w-full rounded border p-2"><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
                <label className="text-sm font-medium">Visibility<select value={visibility} onChange={(event) => setVisibility(event.target.value)} className="mt-2 w-full rounded border p-2"><option value="public">Public</option><option value="private">Private</option></select></label>
                <label className="text-sm font-medium md:col-span-2">Category Universe<select required value={categoryUniverseId} onChange={(event) => setCategoryUniverseId(event.target.value)} className="mt-2 w-full rounded border p-2"><option value="">Select a category universe</option>{categoryUniverses.map((categoryUniverse) => <option key={categoryUniverse.id} value={categoryUniverse.id}>{categoryUniverse.name}</option>)}</select></label>
            </div>

            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isFromAnimeCategory} onChange={(event) => setIsFromAnimeCategory(event.target.checked)} /> Create from anime category</label>

            <div>
                <div className="mb-3 flex items-center justify-between"><h2 className="font-medium">Ranks</h2><button type="button" onClick={() => setRanks([...ranks, { ...initialRank }])} className="text-sm text-pink-500 hover:underline">Add rank</button></div>
                <div className="space-y-3">{ranks.map((rank, index) => <div key={index} className="flex gap-3"><input required value={rank.name} onChange={(event) => updateRank(index, 'name', event.target.value)} placeholder="Rank name" className="w-full rounded border p-2" /><input type="color" value={rank.color} onChange={(event) => updateRank(index, 'color', event.target.value)} className="h-10 w-14 rounded border p-1" />{ranks.length > 1 && <button type="button" onClick={() => setRanks(ranks.filter((_, rankIndex) => rankIndex !== index))} className="px-2 text-red-500">Remove</button>}</div>)}</div>
            </div>

            <label className="block text-sm font-medium">Item IDs<p className="mt-1 font-normal text-gray-500">Separate item IDs with commas, spaces, or new lines.</p><textarea value={itemIDs} onChange={(event) => setItemIDs(event.target.value)} rows={4} className="mt-2 w-full rounded border p-2" /></label>
            <div className="flex justify-end gap-3"><a href="/tier-template" className="rounded border px-4 py-2 text-sm">Cancel</a><button type="submit" className="rounded bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">Create Tier Template</button></div>
        </form>
    );
}
