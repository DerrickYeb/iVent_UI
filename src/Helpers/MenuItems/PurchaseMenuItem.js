import {ActionIcon, Collapse} from "@mantine/core";
import React, {useState} from "react";
import {useRecoilState} from "recoil";
import {MenuIndexStore} from "../../Store/Store";

export default function PurchaseMenuItem() {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useRecoilState(MenuIndexStore);

    function toggleMenu() {
        setOpen((v) => !v);
        setIndex(3);
    }
    return <React.Fragment>
        <div onClick={() => toggleMenu()}
             className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-700 cursor-pointer text-white">
            <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-current text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <span className="font-semibold">Purchases</span>
            </div>
            {open ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>}
        </div>
        <Collapse in={index === 3}>
            
        </Collapse>
    </React.Fragment>
}