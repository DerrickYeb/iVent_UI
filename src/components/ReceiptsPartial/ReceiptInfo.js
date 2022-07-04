import {ActionIcon, Button} from "@mantine/core";
import {Printer, XCircle} from "react-feather";
import CompanyInvoiceHeader from "../../Helpers/CompanyInvoiceHeader";
import {formatDate, MoneyFormat} from "../../Helpers/Constants";
import {BasicRightDrawerUtils} from "../../modals/ModalUtils";
import React from "react";
import {useReactToPrint} from "react-to-print";
import useGetMyProfile from "../../Hooks/SWRHooks/useGetMyProfile";

export default function ReceiptInfo({selected, open, onClose}) {

    const {data: me} = useGetMyProfile();


    const handlePrint = useReactToPrint({
        content: () => document.getElementById("receipt-div"),
        //onBeforeGetContent: () => toast("Printing started", "info")
    })

return <BasicRightDrawerUtils size={500} open={open} onClose={onClose}>
    <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
        </div>
        <div>
            <Button
                leftIcon={<Printer size={16}/>}
                size={"xs"}
                variant="white"
                onClick={() => handlePrint()}
            >Print Receipt</Button>
        </div>
        <div>
            <ActionIcon onClick={onClose}>
                <XCircle/>
            </ActionIcon>
        </div>
    </div>


    {/*    receipt body*/}
    <div id="receipt-div" className="px-4 bg-white">
        <div>
            <CompanyInvoiceHeader/>
        </div>
        <div className="flex items-center justify-center p-4 font-bold text-xl mb-2">
            Receipt
        </div>
        <div className="flex flex-col space-y-2">
            <EachDiv title="Payment #" value={selected?.PaymentId}/>
            <EachDiv title="Customer Name" value={selected?.CustomerName}/>
            <EachDiv title="Invoice Amount" value={MoneyFormat(selected?.PaymentAmount)}/>
            <EachDiv title="Amount Received" value={MoneyFormat(selected?.AmountReceived)}/>
            <EachDiv title="Outstanding" value={MoneyFormat(selected?.PreviousBalance)}/>
            <EachDiv title="Excess" value={MoneyFormat(selected?.Change)}/>
            <EachDiv title="Payment Date" value={formatDate(selected?.PaymentDate)}/>
            <EachDiv title="Payment Mode" value={selected?.PaymentMethod}/>
        </div>

        <div className="flex items-center justify-center mt-8 text-gray-700 text-sm text-center">
            Print time - {new Date().toDateString()} <br/> by {me?.Fullname || ""}
        </div>
    </div>
</BasicRightDrawerUtils>
}

function EachDiv({title, value}) {
    return <div className="flex space-x-4 items-center">
        <span className="text-gray-800 text-sm">{title}:</span>
        <span className="text-gray-800 text-sm">{value}</span>
    </div>
}