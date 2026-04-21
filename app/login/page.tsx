"use client"
import { Card, Typography, Input, Button } from "../component/mtailwind";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "./action";

type FormUserData = {
    email: string
    password: string
}

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormUserData>({ email: "", password: "" });
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        const result = await login(formData.email, formData.password);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            window.location.href = '/';
        }
    };

    return (
        <div className="flex justify-center h-screen items-center">
            <Card color="transparent" shadow={false}>
                <Typography variant="h4" color="blue-gray">
                    Sign In
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    Enter your credentials to access Animap.
                </Typography>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                    <div className="mb-1 flex flex-col gap-6">
                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                            Email
                        </Typography>
                        <Input
                            size="lg"
                            crossOrigin={undefined}
                            placeholder="name@mail.com"
                            type="email"
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{ className: "before:content-none after:content-none" }}
                            value={formData.email}
                            name="email"
                            onChange={handleInputChange}
                        />
                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                            Password
                        </Typography>
                        <Input
                            type="password"
                            size="lg"
                            crossOrigin={undefined}
                            placeholder="********"
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{ className: "before:content-none after:content-none" }}
                            value={formData.password}
                            name="password"
                            onChange={handleInputChange}
                        />
                    </div>
                    {error && (
                        <Typography color="red" className="mt-3 text-sm text-center">
                            {error}
                        </Typography>
                    )}
                    <Button className="mt-6" fullWidth type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
