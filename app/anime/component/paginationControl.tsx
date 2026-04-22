'use client';

import Link from "next/link";

type Props = {
    page: number;
    limit: number;
    totalPages: number;
};

function buildPageItems(page: number, totalPages: number): (number | '...')[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page, last page, current page and 2 neighbours
    const delta = 2;
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    const items: (number | '...')[] = [1];

    if (left > 2) items.push('...');

    for (let i = left; i <= right; i++) items.push(i);

    if (right < totalPages - 1) items.push('...');

    items.push(totalPages);

    return items;
}

export default function PaginationControl({ page, limit, totalPages }: Props) {
    if (totalPages <= 1) return null;

    const buildHref = (p: number) => `?page=${p}&limit=${limit}`;
    const items = buildPageItems(page, totalPages);

    return (
        <div className="flex items-center justify-center gap-2 py-6">
            <Link
                href={buildHref(page - 1)}
                className={`px-3 py-1 rounded border text-sm ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-100"}`}
                aria-disabled={page <= 1}
            >
                &laquo; Prev
            </Link>

            {items.map((item, i) =>
                item === '...' ? (
                    <span key={`dots-${i}`} className="px-2 py-1 text-sm text-gray-400 select-none">
                        &hellip;
                    </span>
                ) : (
                    <Link
                        key={item}
                        href={buildHref(item)}
                        className={`px-3 py-1 rounded border text-sm ${item === page ? "bg-pink-500 text-white border-pink-500" : "hover:bg-gray-100"}`}
                    >
                        {item}
                    </Link>
                )
            )}

            <Link
                href={buildHref(page + 1)}
                className={`px-3 py-1 rounded border text-sm ${page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-gray-100"}`}
                aria-disabled={page >= totalPages}
            >
                Next &raquo;
            </Link>
        </div>
    );
}
