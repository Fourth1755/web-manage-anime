'use client';
import { Button } from '../mtailwind';
import { logout } from '@/app/login/action';

export default function LogoutButton() {
    return (
        <form action={logout}>
            <Button variant="gradient" color="red" type="submit" className="text-sm">
                Sign Out
            </Button>
        </form>
    );
}
