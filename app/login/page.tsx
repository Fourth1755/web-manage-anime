"use client"
import Link from "next/link";
import { Card, Typography, Input, Checkbox, Button } from "../component/mtailwind";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FormUserData ={
    email: string
    password: string
}

type UserLoginData = {
    email: string
    password: string
}

export default function LoginPage() {
    const router = useRouter()
    const [formData,setFormData] =useState<FormUserData>({
        email:"",
        password:""
    })

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const user: UserLoginData = {
            email:formData.email,
            password:formData.password
        }
        console.log(formData.email)
        router.push('/')
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    return (<div className="flex justify-center h-screen items-center">
        <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray">
                Sign In
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
                Nice to meet you! Enter your details to register.
            </Typography>
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                <div className="mb-1 flex flex-col gap-6">
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Your Email
                    </Typography>
                    <Input
                        size="lg"
                        crossOrigin={undefined}
                        placeholder="name@mail.com"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
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
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                        value={formData.password}
                        name="password"
                        onChange={handleInputChange}
                    />
                </div>
                <Button className="mt-6" fullWidth type="submit">
                    sign in
                </Button>
                <Typography color="gray" className="mt-4 text-center font-normal">
                   You don't have an account yet.{" "}
                    <Link href="/register" className="font-medium text-gray-900">
                        Sign Up
                    </Link>
                </Typography>
            </form>
        </Card>
    </div>)
}