'use client';

import { useState } from 'react';
import { useTransition } from 'react';
import { deleteUser } from '../action';

export default function DeleteUserButton({ email, id }: { email: string; id: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    function confirmDelete() {
        const formData = new FormData();
        formData.set('id', id);

        startTransition(async () => {
            await deleteUser(formData);
            setIsOpen(false);
            setIsSuccessOpen(true);
        });
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="rounded-lg border border-red-500 px-3 py-1.5 text-sm text-red-500 transition-colors hover:bg-red-50"
            >
                Delete
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    role="presentation"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-user-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2 id="delete-user-title" className="text-lg font-semibold text-gray-900">
                            Delete user?
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to delete <span className="font-medium text-gray-900">{email}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={isPending}
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isPending ? 'Deleting...' : 'Confirm delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isSuccessOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" role="presentation">
                    <div
                        className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-user-success-title"
                    >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
                            ✓
                        </div>
                        <h2 id="delete-user-success-title" className="mt-4 text-lg font-semibold text-gray-900">
                            Delete successful
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">The user has been deleted successfully.</p>
                        <button
                            type="button"
                            onClick={() => setIsSuccessOpen(false)}
                            className="mt-6 rounded-lg bg-green-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
