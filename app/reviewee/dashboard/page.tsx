import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function RevieweeDashboardPage() {
    return (
        <div>

            <section className="border-b border-gray-300 shadow-sm">

              <div className="flex items-center justify-between mx-84 h-20">
                    <div>
                        <h1 className="font-medium text-xl">ABE Review App</h1>
                    </div>

                    <div>
                        <ul className="flex gap-4">
                            <li>Home</li>
                            <li>History</li>
                        </ul>
                    </div>

                    <div className="flex gap-2">
                        <UserCircleIcon className="h-6 w-6 text-stone-600" />
                        <p>mark@gmail.com</p>
                    </div>
              </div>
              
            </section>

            <section>

                <div className="mx-84 mt-8">

                    <div>
                        <h1 className="font-semibold text-2xl">Welcome back, Mark!</h1>
                        <span className="text-lg text-stone-600">Continue your ABE review journey and sharpen your skills.</span>
                    </div>

                    <div className="my-6">
                        <h1 className="font-medium text-xl">Choose Your Learning Mode</h1>
                    </div>

                    <div>
                        <div className="w-90">
                            <div className="bg-red-500 h-24 p-4 flex flex-col justify-center rounded-t-2xl">
                                <h1>Solo Mode</h1>

                            </div>
                            <div className="p-4 border border-gray-300 rounded-b-2xl h-40 flex flex-col justify-between">
                                <p>Text</p>
                                <button className="w-full bg-amber-500">Start Solo Mode</button>
                            </div>
                        </div>
                    </div>

                </div>

            </section>

        </div> 
    );
}