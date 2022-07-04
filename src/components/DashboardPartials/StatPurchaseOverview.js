export default function StatPurchaseOverview() {
    return <div className="grid gap-6 mb-6 grid-cols-2">
        <div
            className="rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800"
        >
            <div className="p-2 flex items-center">
                <div
                    className="p-3 rounded-full text-orange-500 dark:text-orange-100 bg-orange-100 dark:bg-orange-500 mr-4"
                >
                    <div
                        className="p-3 rounded-full text-red-500 bg-red-100"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    </div>
                </div>
                <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Cancel Order
                    </p>
                    <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        0
                    </p>
                </div>
            </div>
        </div>

        <div
            class="rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800"
        >
            <div class="p-4 flex items-center">
                <div
                    class="p-3 rounded-full text-green-500 dark:text-green-100 bg-green-100 dark:bg-green-500 mr-4"
                >
                    <svg fill="currentColor" viewBox="0 0 20 20" className="w-8 h-8">
                        <path
                            fill-rule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </div>
                <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Sales
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        GHC 0.00
                    </p>
                </div>
            </div>
        </div>
        <div
            className="rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800"
        >
            <div className="p-4 flex items-center">
                <div
                    className="p-3 rounded-full text-blue-500 dark:text-blue-100 bg-blue-100 dark:bg-blue-500 mr-4"
                >
                    <svg fill="currentColor" viewBox="0 0 20 20" className="w-8 h-8">
                        <path
                            d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                        ></path>
                    </svg>
                </div>
                <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        New Purchases
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                       0
                    </p>
                </div>
            </div>
        </div>
        <div
            className="rounded-lg shadow-xs overflow-hidden bg-white dark:bg-gray-800"
        >
            <div className="p-4 flex items-center">
                <div
                    className="p-3 rounded-full text-teal-500 dark:text-teal-100 bg-teal-100 dark:bg-teal-500 mr-4"
                >
                    <svg fill="currentColor" viewBox="0 0 20 20" class="w-8 h-8">
                        <path
                            fill-rule="evenodd"
                            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </div>
                <div>
                    <p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Pending Orders
                    </p>
                    <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">0</p>
                </div>
            </div>
        </div>
    </div>
}