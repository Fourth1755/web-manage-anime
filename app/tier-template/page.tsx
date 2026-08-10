export const dynamic = 'force-dynamic';

import { TierTemplateService } from '../api/tierTemplate';
import { GetTierTemplateResponse } from '../api/dtos/tierTemplate';
import Link from 'next/link';

function formatDate(value: string): string {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
}

function formatValue(value: string | number | boolean | undefined): string {
    if (value === undefined || value === '') return '-';
    return String(value);
}

export default async function TierTemplatePage() {
    const tierTemplateService = new TierTemplateService();
    const response = await tierTemplateService.getTierTemplates();
    const tierTemplates = response?.data ?? [];

    return (
        <div className="container mx-auto px-5 pt-20 md:px-8">
            <div className="flex items-center justify-between py-10">
                <div>
                    <h1>Tier Templates</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage tier list templates</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                        {tierTemplates.length} templates
                    </span>
                    <Link href="/tier-template/create" className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
                        Create Tier Template
                    </Link>
                </div>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-left text-sm text-black">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th scope="col" className="whitespace-nowrap px-4 py-3">No.</th>
                            <th scope="col" className="px-4 py-3">Template</th>
                            <th scope="col" className="px-4 py-3">Type</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3">Visibility</th>
                            <th scope="col" className="px-4 py-3">Version</th>
                            <th scope="col" className="whitespace-nowrap px-4 py-3">Items</th>
                            <th scope="col" className="whitespace-nowrap px-4 py-3">Ranks</th>
                            <th scope="col" className="whitespace-nowrap px-4 py-3">Played</th>
                            <th scope="col" className="px-4 py-3">Created By</th>
                            <th scope="col" className="whitespace-nowrap px-4 py-3">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tierTemplates.map((template: GetTierTemplateResponse, index: number) => (
                            <tr key={template.id} className="border-b hover:bg-gray-50">
                                <td className="whitespace-nowrap px-4 py-4 font-medium">{index + 1}</td>
                                <td className="min-w-[220px] px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        {template.image ? (
                                            <img className="h-12 w-12 rounded object-cover" src={template.image} alt={template.name} />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">No image</div>
                                        )}
                                        <div>
                                            <p className="font-medium">{formatValue(template.name)}</p>
                                            <p className="text-xs text-gray-500">{template.id}</p>
                                            {template.is_from_anime_category && <p className="text-xs text-pink-500">Anime category</p>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">{formatValue(template.type)}</td>
                                <td className="whitespace-nowrap px-4 py-4">{formatValue(template.status)}</td>
                                <td className="whitespace-nowrap px-4 py-4">{formatValue(template.visibility)}</td>
                                <td className="px-4 py-4">{template.version}</td>
                                <td className="px-4 py-4">{template.total_item ?? template.item_ids?.length ?? 0}</td>
                                <td className="px-4 py-4">{template.ranks?.length ?? 0}</td>
                                <td className="px-4 py-4">{template.played_count}</td>
                                <td className="px-4 py-4">{formatValue(template.created_by)}</td>
                                <td className="whitespace-nowrap px-4 py-4">{formatDate(template.created_at)}</td>
                            </tr>
                        ))}
                        {tierTemplates.length === 0 && (
                            <tr>
                                <td colSpan={11} className="px-4 py-10 text-center text-gray-500">No tier templates found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
