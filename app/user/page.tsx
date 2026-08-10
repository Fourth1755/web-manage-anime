export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { UserService } from '../api/user';
import PaginationControl from '../component/paginationControl';
import UserSearchInput from './component/userSearchInput';
import DeleteUserButton from './component/deleteUserButton';
import { User } from '../api/dtos/user';

type SearchParams = {
    page?: string;
    limit?: string;
    search?: string;
};

function displayName(user: User): string {
    return user.name || user.username || '-';
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams;
    const page = Math.max(1, parseInt(params.page ?? '1', 10));
    const limit = Math.max(1, parseInt(params.limit ?? '20', 10));
    const search = params.search?.trim() ?? '';

    const service = new UserService();
    let response;
    try {
        response = await service.getUsers(page, limit, search);
    } catch (error: any) {
        if (error?.response?.status === 401) redirect('/login');
        throw error;
    }

    const users = response.users ?? [];

    return (
        <main className="container mx-auto px-5 pt-20 md:px-40">
            <div className="flex flex-wrap items-center justify-between gap-4 py-10">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage registered users</p>
                </div>
                <UserSearchInput defaultValue={search} />
            </div>

            <div className="relative overflow-x-auto rounded-lg shadow-md">
                <table className="w-full text-left text-sm text-black">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th scope="col" className="whitespace-nowrap px-6 py-3">No.</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? users.map((user, index) => (
                            <tr key={user.id ?? user.uuid ?? user.email} className="border-b hover:bg-gray-50">
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{(page - 1) * limit + index + 1}</td>
                                <td className="px-6 py-4">{displayName(user)}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.role || '-'}</td>
                                <td className="max-w-xs truncate px-6 py-4 text-gray-500">{user.uuid || user.id || '-'}</td>
                                <td className="px-6 py-4">
                                    {(user.uuid || user.id) ? (
                                        <DeleteUserButton email={user.email} id={user.uuid || user.id || ''} />
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <PaginationControl page={page} limit={limit} totalPages={response.total_pages ?? 0} />
        </main>
    );
}
