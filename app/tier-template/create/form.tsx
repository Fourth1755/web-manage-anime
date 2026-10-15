'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createTierTemplate, presignTierTemplateImage } from './action';
import type { CreateTierTemplateRank, CreateTierTemplateRequest, UploadedTierTemplateImage } from '@/app/api/dtos/tierTemplate';
import { TierTemplateImageUploadService, TIER_TEMPLATE_IMAGE_ACCEPT, validateTierTemplateCover } from '@/app/api/tierTemplateImageUpload';

type CategoryUniverse = {
    id: string;
    name: string;
};

type Props = {
    categoryUniverses: CategoryUniverse[];
};

const initialRank: CreateTierTemplateRank = { name: '', color: '#ef4444' };

export default function CreateTierTemplateForm({ categoryUniverses }: Props) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [type, setType] = useState('anime');
    const [image, setImage] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState('');
    const [uploadedCover, setUploadedCover] = useState<UploadedTierTemplateImage | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [created, setCreated] = useState(false);
    const [error, setError] = useState('');
    const submitInFlight = useRef(false);
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

    useEffect((): (() => void) => {
        return (): void => {
            if (coverPreview) URL.revokeObjectURL(coverPreview);
        };
    }, [coverPreview]);

    const selectCover = (event: ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        try {
            validateTierTemplateCover(file);
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
            setUploadedCover(null);
            setImage('');
            setError('');
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Please choose a supported image.');
        }
    };

    const removeCover = (): void => {
        setCoverFile(null);
        setCoverPreview('');
        setUploadedCover(null);
    };

    const updateRank = (index: number, field: keyof CreateTierTemplateRank, value: string): void => {
        setRanks((current) => current.map((rank, rankIndex) => rankIndex === index ? { ...rank, [field]: value } : rank));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if (submitInFlight.current || created) return;
        submitInFlight.current = true;
        setSubmitting(true);
        setError('');
        const request: CreateTierTemplateRequest = {
            name: name.trim(),
            type,
            image: image.trim(),
            status,
            visibility,
            ranks: ranks.filter((rank) => rank.name.trim()),
            item_ids: itemIDs.split(/[\s,]+/).map((itemID) => itemID.trim()).filter(Boolean),
            is_from_anime_category: isFromAnimeCategory,
            category_universe_id: isFromAnimeCategory ? categoryUniverseId : undefined,
        };
        try {
            if (coverFile) {
                let cover = uploadedCover;
                if (!cover) {
                    setUploadingCover(true);
                    cover = await new TierTemplateImageUploadService().uploadCover(coverFile, presignTierTemplateImage);
                    setUploadedCover(cover);
                    setUploadingCover(false);
                }
                delete request.image;
                request.image_key = cover.key;
            }
            const result = await createTierTemplate(request);
            if (!result.ok) throw new Error(result.error);
            setCreated(true);
            router.push('/tier-template');
            router.refresh();
        } catch (error: unknown) {
            submitInFlight.current = false;
            setError(error instanceof Error ? error.message : 'Unable to create the tier template. Please try again.');
        } finally {
            setUploadingCover(false);
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border bg-white p-6 shadow-sm">
            {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <fieldset disabled={submitting || created} className="space-y-8">
            <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-medium">Name<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded border p-2" /></label>
                <label className="text-sm font-medium">Type<input required value={type} onChange={(event) => setType(event.target.value)} className="mt-2 w-full rounded border p-2" /></label>
                {!coverFile && <label className="text-sm font-medium">Image URL (optional)<input value={image} onChange={(event) => setImage(event.target.value)} className="mt-2 w-full rounded border p-2" /></label>}
                <label className="text-sm font-medium">Status<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 w-full rounded border p-2"><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
                <label className="text-sm font-medium">Visibility<select value={visibility} onChange={(event) => setVisibility(event.target.value)} className="mt-2 w-full rounded border p-2"><option value="public">Public</option><option value="private">Private</option></select></label>
                <label className="text-sm font-medium md:col-span-2">Category Universe<select required={isFromAnimeCategory} value={categoryUniverseId} onChange={(event) => setCategoryUniverseId(event.target.value)} className="mt-2 w-full rounded border p-2"><option value="">Select a category universe</option>{categoryUniverses.map((categoryUniverse) => <option key={categoryUniverse.id} value={categoryUniverse.id}>{categoryUniverse.name}</option>)}</select></label>
            </div>

            <section className="space-y-3 rounded-lg border p-4" aria-label="Template cover image">
                <label className="block text-sm font-medium">
                    Cover image (optional)
                    <input type="file" accept={TIER_TEMPLATE_IMAGE_ACCEPT} onChange={selectCover} className="mt-2 block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-pink-100 file:px-4 file:py-2 file:text-pink-700" />
                </label>
                <p className="text-xs text-gray-500">JPEG, PNG, WebP, GIF or AVIF, up to 10 MB. The image uploads when you create the template.</p>
                {coverFile && coverPreview && (
                    <div className="flex items-center gap-4">
                        <Image src={coverPreview} alt="Selected template cover" width={160} height={90} className="rounded object-contain" unoptimized />
                        <div className="min-w-0">
                            <p className="truncate text-sm text-gray-600">{coverFile.name}</p>
                            <button type="button" onClick={removeCover} className="mt-2 text-sm text-pink-600 hover:underline">Remove cover image</button>
                        </div>
                    </div>
                )}
            </section>

            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isFromAnimeCategory} onChange={(event) => setIsFromAnimeCategory(event.target.checked)} /> Create from anime category</label>

            <div>
                <div className="mb-3 flex items-center justify-between"><h2 className="font-medium">Ranks</h2><button type="button" onClick={() => setRanks([...ranks, { ...initialRank }])} className="text-sm text-pink-500 hover:underline">Add rank</button></div>
                <div className="space-y-3">{ranks.map((rank, index) => <div key={index} className="flex gap-3"><input required value={rank.name} onChange={(event) => updateRank(index, 'name', event.target.value)} placeholder="Rank name" className="w-full rounded border p-2" /><input type="color" value={rank.color} onChange={(event) => updateRank(index, 'color', event.target.value)} className="h-10 w-14 rounded border p-1" />{ranks.length > 1 && <button type="button" onClick={() => setRanks(ranks.filter((_, rankIndex) => rankIndex !== index))} className="px-2 text-red-500">Remove</button>}</div>)}</div>
            </div>

            <label className="block text-sm font-medium">Item IDs<p className="mt-1 font-normal text-gray-500">Separate item IDs with commas, spaces, or new lines.</p><textarea value={itemIDs} onChange={(event) => setItemIDs(event.target.value)} rows={4} className="mt-2 w-full rounded border p-2" /></label>
            <div className="flex justify-end gap-3"><a href="/tier-template" className="rounded border px-4 py-2 text-sm">Cancel</a><button type="submit" disabled={submitting || created} className="rounded bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50">{uploadingCover ? 'Uploading cover...' : submitting ? 'Creating...' : created ? 'Created' : 'Create Tier Template'}</button></div>
            </fieldset>
        </form>
    );
}
