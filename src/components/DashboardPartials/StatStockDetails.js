export default function StatStockDetails() {
    return <div className="flex flex-col bg-white rounded-lg w-full p-4 mx-auto">
        <h2 className="font-semibold text-xl pl-2">Stock Details</h2>

        <div className="mt-2 flex gap-3 items-center justify-between font-medium text-gray-500 border-b border-gray-100 p-4">
            <span>Low Stock</span>
            <span>
                  0
                </span>
        </div>

        <div className="mt-2 flex gap-3 items-center justify-between font-medium text-gray-500 border-b border-gray-100 p-4">
            <span>Stock Categories</span>
            <span>
                  0
                </span>
        </div>

        <div className="mt-2 flex gap-3 items-center justify-between font-medium text-gray-500 border-b border-gray-100 p-4">
            <span>Close to Expiry</span>
            <span>
                 0
                </span>
        </div>

        <div className="mt-2 flex gap-3 items-center justify-between font-medium text-gray-500 border-b border-gray-100 p-4">
            <span>Expired</span>
            <span>
                 0
                </span>
        </div>

    </div>
}