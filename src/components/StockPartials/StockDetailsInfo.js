import {formatDate, MoneyFormat} from "../../Helpers/Constants";

export default function StockDetailsInfo({stock: v}) {
    return <div>
        <div className="flex flex-col justify-between w-full">
            <div className="grid gap-4 grid-cols-2">
                <BasicStockInfo stock={v}/>
                <StockQtyInfo stock={v}/>
            </div>
            <StockSalesInfo stock={v}/>
        </div>
    </div>
}

function BasicStockInfo({stock: d}) {
    return <div className="grid gap-4 grid-cols-2 flex-grow">
        <div>Batch No</div>
        <div>{d?.ProductSKU}</div>
        <div>Volume</div>
        <div>{d?.Volume}</div>
        <div>Strength</div>
        <div>{d?.Strength}</div>
        <div>Created By</div>
        <div>{d?.EnteredBy}</div>
        <div>Created Date</div>
        <div>{formatDate(d?.Dated)}</div>
    </div>
}

function StockQtyInfo({stock: v}) {
    return <div className="flex flex-col space-y-6 flex-grow bg-gray-50 rounded p-4">
        <div className="flex flex-col space-y-2 items-center justify-center">
            <span className="text-black text-xl">Opening Quantity</span>
            <span>{v?.ProductOpeningStockQty}</span>
        </div>
        <div className="flex flex-col space-y-2 items-center justify-center">
            <span className="text-black text-xl">Current Quantity</span>
            <span>{v?.ProductQuantityAtHand}</span>
        </div>
        <div className="flex flex-col space-y-2 items-center justify-center">
            <span className="text-black text-xl">Reorder Point</span>
            <span>{v?.ProductReorderPoint}</span>
        </div>
    </div>
}

function StockManufactureInfo({stock: v}) {
    return <div className="grid gap-4 grid-cols 2"></div>
}

function StockSalesInfo({stock: v}) {
    return <div className="grid gap-4 grid-cols-2 flex-grow w-full mt-8">
        <div className="flex items-center flex-col justify-center space-y-2 bg-blue-200 p-6 rounded-lg">
            <span className="text-xl font-medium text-gray-700">Cost Price</span>
            <span className="text-2xl font-semibold">{MoneyFormat(v?.ProductCostPrice)}</span>
        </div>
        <div className="flex items-center flex-col justify-center space-y-2 bg-blue-200 p-6 rounded-lg">
            <span className="text-xl font-medium text-gray-700">Selling Price</span>
            <span className="text-2xl font-semibold">{MoneyFormat(v?.ProductSellingPrice)}</span>
        </div>
    </div>
}