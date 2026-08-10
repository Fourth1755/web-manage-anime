'use server';

import { revalidatePath } from 'next/cache';
import { UserService } from '../api/user';
import { DeleteUserRequest } from '../api/dtos/user';

export async function deleteUser(formData: FormData) {
    const id = formData.get('id');

    if (typeof id !== 'string' || !id.trim()) {
        throw new Error('A user ID is required to delete a user.');
    }

    const request: DeleteUserRequest = { id: id.trim() };
    await new UserService().deleteUser(request);
    revalidatePath('/user');
}
