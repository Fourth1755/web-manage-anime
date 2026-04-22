'use client';

import Link from "next/link";

type Props = {
    page: number;
    limit: number;
    totalPages: number;
};

export default function PaginationControl({ page, limit, totalPages }: Props) {
    if (totalPages <= 1) return null;

    const buildHref = (p: number) => `?page=${p}&limit=${limit}`;

    return (
        <div className="flex items-center justify-center gap-2 py-6">
            <Link
                href={buildHref(page - 1)}
                className={`px-3 py-1 rounded border text-sm ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-100"}`}
                aria-disabled={page <= 1}
            >
                &laquo; Prev
            </Link>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                    key={p}
                    href={buildHref(p)}
                    className={`px-3 py-1 rounded border text-sm ${p === page ? "bg-pink-500 text-white border-pink-500" : "hover:bg-gray-100"}`}
                >
                    {p}
                </Link>
            ))}

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
