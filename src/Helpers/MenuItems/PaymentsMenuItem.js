import {ActionIcon, Collapse} from "@mantine/core";
import React, {useState} from "react";
import SubMenuItem from "./SubMenuItem";
import {InvoicesUrl, PaymentsReceivedUrl, ProformaUrl, ReceiptsUrl, SalesOrdersUrl} from "../UrlHelper";
import {useRecoilState} from "recoil";
import {MenuIndexStore} from "../../Store/Store";

export default function PaymentsMenuItem() {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useRecoilState(MenuIndexStore);

    function toggleMenu() {
        setOpen((v) => !v);
        setIndex(7);
    }
    return <React.Fragment>
        <div onClick={() => toggleMenu()}
             className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-700 cursor-pointer text-white">
            <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-current text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <span className="font-semibold">Payments</span>
            </div>
            {open ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>}
        </div>
        <Collapse in={index === 7}>
            <div className="flex flex-col space-y-2 ml-4 mr-4 pt-2 pb-2">
                <SubMenuItem text={"PaymentsReceived "} loc={PaymentsReceivedUrl}/>
                <SubMenuItem text={"Receipts"} loc={ReceiptsUrl}/>
            </div>
        </Collapse>
    </React.Fragment>
}