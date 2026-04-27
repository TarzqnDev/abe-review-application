"use client";

import { Squares2X2Icon, UserCircleIcon, Cog6ToothIcon, MagnifyingGlassIcon, PlusIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function AdminDashboardPage() {
    const [openAccountMenu, setOpenAccountMenu] = useState(false);    

    return (
        <div className="py-2 pl-2 pr-8 bg-stone-100 h-screen flex gap-8">
            
            <section className="h-full bg-white w-75 rounded-lg border border-gray-300 shadow-sm px-4">
                
                <div className="flex justify-center">
                    <h1 className="font-medium text-xl my-6">ABE Review App</h1>
                </div>

                <div className="mb-4 w-full h-px bg-[radial-gradient(circle_at_center,rgba(209,213,220,1),transparent)]"></div>

                <div>
                    <ul className="flex flex-col gap-2">
                        <li className="py-3 px-4  bg-teal-800 rounded-md text-white flex items-center cursor-pointer"><Squares2X2Icon className="h-6 w-6 mr-2" />Dashboard</li>
                        <li className="py-3 px-4 hover:bg-stone-100 rounded-md flex items-center  cursor-pointer"><BookOpenIcon className="h-6 w-6 mr-2" />Questions Content</li>
                    </ul>
                </div>

            </section>

            <section className="w-full">

                <div className="mt-4 flex justify-between items-center mb-10">

                    <div>
                        <p><span className="text-stone-600">Pages</span> / Dashboard</p>
                    </div>

                    <div className="flex gap-6 relative">
                        <Cog6ToothIcon className="h-6 w-6 text-stone-600" />
                        <button className="cursor-pointer" onClick={() => setOpenAccountMenu(!openAccountMenu)}>
                            <UserCircleIcon className="h-6 w-6 text-stone-600" />
                        </button>

                        {openAccountMenu && (
                            <div className="absolute right-0 mt-8 w-48 bg-white border border-gray-300 rounded-md shadow-sm">
                                <ul className="py-2">
                                    <li className="px-4 py-2 hover:bg-stone-100 cursor-pointer">Profile</li>
                                    <li className="px-4 py-2 hover:bg-stone-100 cursor-pointer"><button>Logout</button></li>
                                </ul>
                            </div>
                        )}
                    </div>

                </div>

                <div className="mb-6">
                    <h1 className="font-semibold text-2xl">Admin Dashboard</h1>
                    <p className="text-lg text-stone-600">Manage users for the learning platform.</p>
                </div>

                <div className="flex justify-between mb-6">

                    <div className="relative w-100">
                        <input
                            type="text"
                            placeholder="Search User"
                            className="border border-gray-300 w-full py-3 pl-10 pr-4 rounded-md"
                        />

                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <div>
                        <button className="bg-teal-800 text-white font-semibold py-3 px-4 rounded-md cursor-pointer flex items-center"><PlusIcon className="h-5 w-5 mr-2" /> Register User</button>
                    </div>

                </div>

                <div className="rounded-lg border border-gray-300 overflow-hidden shadow-sm">

                <table className="w-full bg-white">
                    <thead>
                        <tr className="border-b border-gray-300 text-stone-400">
                            <th className="text-left py-3 pl-8 font-medium">NAME</th>
                            <th className="text-left py-3 pl-8 font-medium">EMAIL</th>
                            <th className="text-left py-3 pl-8 font-medium">STATUS</th>
                            <th className="text-left py-3 pl-8 font-medium">JOINED</th>
                            <th className="text-left py-3 pl-8 font-medium">END</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr >
                            <td className="py-3 pl-8">Mark Joseph M. Ante</td>
                            <td className="py-3 pl-8">mark@example.com</td>
                            <td className="py-3 pl-8"><span className="bg-teal-800 text-white text-sm font-medium px-4 py-1 rounded-full">Active</span></td>
                            <td className="py-3 pl-8">23/04/2026</td>
                            <td className="py-3 pl-8">14/06/2026</td>
                            <td className="py-3 pl-8">Edit</td>
                        </tr>

                    </tbody>
                </table>

                </div>

            </section>

        </div>
    );
}