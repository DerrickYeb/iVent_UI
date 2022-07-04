import {Button} from "@mantine/core";
import {MoneyFormat} from "../../Helpers/Constants";
import {useHistory} from "react-router-dom";
import ProformaBreakdownTable from "./ProformaBreakdownTable";

export default function ProformaInfo({data:v, totalAmt, totalDiscount}){
    const history = useHistory()
    return <div className="-mt-2.5 bg-gray-50">

        {/*<Button size="xs" variant="subtle" leftIcon={<Plus size={16}/>}>Add a Comment</Button>*/}

        {/*total amount and payable*/}
        <div className="grid grid-cols-2 p-4 gap-4 bg-white border-b">
            <div className="flex flex-col space-y-2 items-center justify-center p-6 bg-gray-50 rounded">
                <span className="text-gray-700">Total Amount</span>
                <span className="text-2xl">{MoneyFormat(totalAmt)}</span>
            </div>
            <div className="flex flex-col space-y-2 items-center justify-center p-6 bg-gray-50 rounded">
                <span className="text-gray-700">Total Payable</span>
                <span className="text-2xl">{MoneyFormat(totalAmt - (totalAmt * totalDiscount) / 100)} <em className="text-base text-green-500 font-semibold">{totalDiscount}%</em></span>
            </div>
        </div>


        <div className="p-4 bg-white">
            <ProformaBreakdownTable data={v} totalAmount={totalAmt} totalDiscount={totalDiscount}/>
        </div>
    </div>
}