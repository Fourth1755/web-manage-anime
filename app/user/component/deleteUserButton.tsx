'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { deleteUser } from '../action';

function ConfirmButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {pending ? 'Deleting...' : 'Confirm delete'}
        </button>
    );
}

export default function DeleteUserButton({ email, id }: { email: string; id: string }) {
    const [isOpen, setIsOpen] = useState(false);

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
                            <form action={deleteUser}>
                                <input type="hidden" name="id" value={id} />
                                <ConfirmButton />
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
