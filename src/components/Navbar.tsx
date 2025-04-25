"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function Navbar() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigateToPlayer = () => {
        router.push("/player");
    };
    const navigateToYoutube = () => {
        router.push("/iyoutube");
    };

    return (
        <div>
            <nav className="w-full px-4 py-4 text-white bg-slate-900 shadow-md">
                <div className="flex flex-wrap items-center justify-between w-full text-gray-100">
                    <span
                        onClick={() => router.push("/")}
                        className="mr-4 block cursor-pointer py-1.5 text-base text-gray-200 font-semibold"
                    >
                        SuperSports POC
                    </span>
                    {/* Mobile Menu Toggle Button */}
                    <button
                        className="block lg:hidden text-gray-200 focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </button>
                    {/* Navigation Links */}
                    <div
                        className={`${
                            isMenuOpen ? "block" : "hidden"
                        } w-full lg:flex lg:w-auto`}
                    >
                        <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                            <li className="flex items-center p-1 text-sm gap-x-2 text-gray-200 cursor-pointer">
                                <span
                                    className="flex items-center"
                                    onClick={navigateToPlayer}
                                >
                                    VideoJS player
                                </span>
                            </li>
                            <li className="flex items-center p-1 text-sm gap-x-2 text-gray-200 cursor-pointer">
                                <span
                                    className="flex items-center"
                                    onClick={navigateToYoutube}
                                >
                                    YouTube I-frame
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;