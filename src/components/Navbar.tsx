"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { User } from 'next-auth'
import React, { useState } from 'react'
import { Button } from "./ui/button"
import { Loader2, LogIn, LogOut } from "lucide-react"

const Navbar = () => {
    const { data: session } = useSession();
    const user = session?.user as User;
    const [isLogingOut, setIsLogingOut] = useState(false);
    const handleLogout = async () => {
        setIsLogingOut(true);
        await signOut();
        setIsLogingOut(false);
    }
    return (
        <nav className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 border-b border-yellow-600/30 px-6 py-4 shadow-lg">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200">
                    Truth Link
                </Link>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="text-gray-900 font-medium">
                                Welcome, {user.username || user.email}
                            </span>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-yellow-400 transition-all duration-200"
                            >
                                {isLogingOut ? (
                                    <>
                                        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                        Logging Out ....
                                    </>
                                ) : (
                                    <>
                                        <LogOut className='mr-2 h-5 w-5' />
                                        LogOut
                                    </>
                                )}
                            </Button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link href='/sign-in'>
                                <Button className="bg-gray-900 text-yellow-400 hover:bg-gray-800 transition-all duration-200">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href='/sign-up'>
                                <Button
                                    variant="outline"
                                    className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-yellow-400 transition-all duration-200"
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
