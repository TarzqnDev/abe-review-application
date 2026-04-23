import { Squares2X2Icon, UserCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function AdminDashboardPage() {
    return (
        <div className="p-2 bg-stone-100 h-screen flex gap-8">
            
            <section className="h-full bg-white w-75 rounded-lg border border-gray-300 shadow-sm p-4">
                
                <div className="flex justify-center pb-4">
                    <h1 className="font-medium text-xl">ABE Review App</h1>
                </div>

                <div>
                    <ul className="flex flex-col gap-2">
                        <li className="py-3 px-6  bg-teal-800 rounded-md text-white flex items-center cursor-pointer"><Squares2X2Icon className="h-6 w-6 mr-2" />Dashboard</li>
                        <li className="py-3 px-6 hover:bg-stone-100 rounded-md cursor-pointer">Questions</li>
                    </ul>
                </div>

            </section>

            <section className="w-full flex flex-col gap-10">

                <div className="mt-4 flex justify-between items-center">

                    <div>
                        <p><span className="text-stone-600">Pages</span> / Dashboard</p>
                    </div>

                    <div className="flex gap-6 mx-6">
                        <Cog6ToothIcon className="h-6 w-6 text-stone-600" />
                        <UserCircleIcon className="h-6 w-6 text-stone-600" />
                    </div>

                </div>

                <div>
                    <h1 className="font-semibold text-2xl">Admin Dashboard</h1>
                    <p className="text-lg text-stone-600">Manage users for the learning platform.</p>
                </div>

                <div>
                    
                </div>

            </section>

        </div>
    );
}