import {Button} from "@mantine/core";
import {Plus} from "react-feather";
import SalesOrderBreakdownTable from "./SalesOrderBreakdownTable";
import {InvoiceStatus, MoneyFormat} from "../../Helpers/Constants";
import {InvoicesByOrderUrl} from "../../Helpers/UrlHelper";
import {useHistory} from "react-router-dom";
import {Badge} from '@mantine/core';
import React from "react";


export default function SalesOrderOrderInfo({data: v, totalAmt, totalDiscount, paymentProgress, isInvoiceSettled = false}) {
    const history = useHistory()
    return <div className="-mt-2.5 bg-gray-50">
        {!v?.OrderStatus === InvoiceStatus.Completed &&
        <div className="flex space-x-4 items-center justify-between bg-gray-50 p-4">
            <div className="text-lg">What's next?</div>
            <Button variant={`white`} size={"xs"} onClick={() => history.push(InvoicesByOrderUrl + v?.OrderId)}>View/Create
                Invoices</Button>
        </div>}
        {/*<Button size="xs" variant="subtle" leftIcon={<Plus size={16}/>}>Add a Comment</Button>*/}

        {/*total amount and payable*/}
        <div className="grid grid-cols-2 p-4 gap-4 bg-white border-b">
            <div className="flex flex-col space-y-2 items-center justify-start p-6 bg-blue-500 rounded">
                <span className="text-white">Order Total Amount</span>
                <span className="text-3xl text-white font-bold">{MoneyFormat(totalAmt)}</span>
            </div>
            <div className="relative flex flex-col space-y-2 items-center justify-center p-6 bg-pink-500 rounded">
                <span className="text-white">Order Total Payable</span>
                <span className="text-3xl text-white font-bold">{MoneyFormat(totalAmt - (totalAmt * totalDiscount) / 100)} <Badge variant={"filled"} size={"md"} radius={5} color="blue">{totalDiscount}%</Badge></span>

            <PaymentProgress data={paymentProgress} isInvoiceSettled={isInvoiceSettled}/>
            </div>
        </div>


        <div className="p-4 bg-white">
            <SalesOrderBreakdownTable data={v} totalAmount={totalAmt} totalDiscount={totalDiscount}/>
        </div>
    </div>
}

function PaymentProgress({data, isInvoiceSettled}){
    // if(data) return <div className="relative flex items-center space-x-6 justify-between mt-6 bg-white p-4 rounded shadow opacity-75">
    //     <div className="flex flex-col items-center justify-center">
    //         <span className="font-medium text-base">Outstanding</span>
    //         <span className="font-bold text-xl">{MoneyFormat(data?.PreviousBalance)}</span>
    //     </div>
    //
    //     <div className="flex flex-col">
    //         <span className="font-medium text-base">Paid So Far</span>
    //         <span className="font-bold text-xl">{MoneyFormat(data?.AmountReceived)}</span>
    //     </div>
    //
    // {/*    overlay*/}
    //     {isInvoiceSettled && <div className="absolute bottom-16 left-10 text-yellow-700 font-bold text-3xl h-full w-full opacity-75 transform -rotate-45">
    //     Completed
    // </div>}
    // </div>;

    return isInvoiceSettled && <div className="absolute bottom-8 left-10 text-green-200 font-bold text-3xl h-full w-full opacity-75 transform -rotate-45">
            Completed
         </div>;

    return null;
}