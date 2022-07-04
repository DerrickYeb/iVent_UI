import {Printer, FileText, Edit3, Mail, Paperclip} from "react-feather";
import {Tooltip} from '@mantine/core';
import {useHistory} from "react-router-dom";
import {EditSingleStockUrl} from "../../Helpers/UrlHelper";
import {downloadAsPdf, OrderStatus} from "../../Helpers/Constants";
import {useReactToPrint} from "react-to-print";
import React from "react";


export default function SalesOrdersButtonGroup({data}) {
    async function handleDownloadPdf() {
        const ele = document.getElementById("order-brk");
        await downloadAsPdf(ele);
    }

    const handlePrint = useReactToPrint({
        content: () => document.getElementById("order-brk"),
        //onBeforeGetContent: () => toast("Printing started", "info")
    })

    return <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center">
            <div className="inline-flex rounded">
                {/*edit*/}
                {data?.OrderStatus !== OrderStatus.Completed && <Tooltip label={"Edit"} withArrow={true}>
                    <button type="button"
                            className="rounded-l inline-block px-3 py-1.5 font-light bg-gray-50 hover:bg-gray-100 text-gray-600 transition duration-150 ease-in-out">
                        <Edit3 size={20}/>
                    </button>
                </Tooltip>}
                {/*   pdf*/}
                <Tooltip label={"PDF"} withArrow={true}>
                    <button type="button"
                            onClick={() => handleDownloadPdf()}
                            className="inline-block px-3 border-l py-1.5 font-light bg-gray-50 hover:bg-gray-100 text-gray-600 transition duration-150 ease-in-out">
                        <FileText size={20}/>
                    </button>
                </Tooltip>
                {/*    print*/}
                <Tooltip label={"Print"} withArrow={true}>
                    <button type="button"
                            onClick={() => handlePrint()}
                            className="border-l inline-block px-3 py-1.5 font-light bg-gray-50 hover:bg-gray-100 text-gray-600 transition duration-150 ease-in-out">
                        <Printer size={20}/>
                    </button>
                </Tooltip>
                {/*    mail*/}
                {data?.OrderStatus !== OrderStatus.Completed && <Tooltip label={"Email"} withArrow={true}>
                    <button type="button"
                            className="rounded-r inline-block px-3 py-1.5 font-light bg-green-400 hover:bg-green-500 text-gray-50 transition duration-150 ease-in-out">
                        <Mail size={20}/>
                    </button>
                </Tooltip>}
            </div>
        </div>
        {/*<div><Tooltip label={"Attach File"} withArrow={true}>*/}
        {/*    <button type="button"*/}
        {/*            className="inline-block px-3 border rounded py-1.5 font-light bg-gray-50 hover:bg-gray-100 text-gray-600 transition duration-150 ease-in-out">*/}
        {/*        <Paperclip size={20}/>*/}
        {/*    </button>*/}
        {/*</Tooltip></div>*/}
    </div>
}

export function StockDetailsButtonGroup({data}) {
    const history = useHistory();

    return <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center">
            <div className="inline-flex rounded">
                {/*edit*/}
                <Tooltip label={"Edit"} withArrow={true}>
                    <button type="button"
                            onClick={() => history.push(EditSingleStockUrl + data?.ProductId)}
                            className="rounded-l inline-block px-3 py-1.5 font-light bg-gray-50 hover:bg-gray-100 text-gray-600 transition duration-150 ease-in-out">
                        <Edit3 size={20}/>
                    </button>
                </Tooltip>
                {/*   pdf*/}
                {/*<Tooltip label={"PDF"} withArrow={true}>*/}
                {/*    <button type="button"*/}
                {/*            className="inline-block px-3 border-l py-1.5 font-light bg-gray-50 hover:bg-gray-100 text-gray-600 transition duration-150 ease-in-out">*/}
                {/*        <FileText size={20}/>*/}
                {/*    </button>*/}
                {/*</Tooltip>*/}
                {/*    print*/}
                {/*<Tooltip label={"Print"} withArrow={true}>*/}
                {/*    <button type="button"*/}
                {/*            className="border-l inline-block px-3 py-1.5 font-light bg-gray-50 hover:bg-gray-100 text-gray-600 transition duration-150 ease-in-out">*/}
                {/*        <Printer size={20}/>*/}
                {/*    </button>*/}
                {/*</Tooltip>*/}
                {/*    mail*/}
                <Tooltip label={"Email"} withArrow={true}>
                    <button type="button"
                            className="rounded-r inline-block px-3 py-1.5 font-light bg-green-400 hover:bg-green-500 text-gray-50 transition duration-150 ease-in-out">
                        <Mail size={20}/>
                    </button>
                </Tooltip>
            </div>
        </div>
        {/*<div><Tooltip label={"Attach File"} withArrow={true}>*/}
        {/*    <button type="button"*/}
        {/*            className="inline-block px-3 border rounded py-1.5 font-light bg-gray-50 hover:bg-gray-100 text-gray-600 transition duration-150 ease-in-out">*/}
        {/*        <Paperclip size={20}/>*/}
        {/*    </button>*/}
        {/*</Tooltip></div>*/}
    </div>
}