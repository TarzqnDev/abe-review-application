export default function AdminMCQContentPage() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="font-semibold text-2xl">MCQ Content Management</h1>
        <p className="text-lg text-stone-600">
          Manage MCQ content for the learning platform.
        </p>
      </div>

      <div className="flex gap-4">
        <div className="w-full">
          <div className="bg-teal-500 h-40 flex items-center p-6 rounded-t-2xl">
            <h1 className="font-semibold text-xl text-white">Guess the Word</h1>
          </div>
          <div className="flex flex-col justify-between h-50 border border-gray-300 p-6 rounded-b-2xl">
            <p>Majo</p>
            <button className="bg-teal-800 text-white py-2 px-4 rounded cursor-pointer">
              Try
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="bg-teal-500 h-40 flex items-center p-6 rounded-t-2xl">
            <h1 className="font-semibold text-xl text-white">AB-Solution</h1>
          </div>
          <div className="flex flex-col justify-between h-50 border border-gray-300 p-6 rounded-b-2xl">
            <p>Majo</p>
            <button className="bg-teal-800 text-white py-2 px-4 rounded cursor-pointer">
              Try
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="bg-teal-500 h-40 flex items-center p-6 rounded-t-2xl">
            <h1 className="font-semibold text-xl text-white">Situationship</h1>
          </div>
          <div className="flex flex-col justify-between h-50 border border-gray-300 p-6 rounded-b-2xl">
            <p>Majo</p>
            <button className="bg-teal-800 text-white py-2 px-4 rounded cursor-pointer">
              Try
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
