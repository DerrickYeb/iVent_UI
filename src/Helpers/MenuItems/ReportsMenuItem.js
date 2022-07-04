import {ActionIcon, Collapse} from "@mantine/core";
import React, {useState} from "react";
import {useRecoilState} from "recoil";
import {MenuIndexStore} from "../../Store/Store";

export default function ReportsMenuItem() {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useRecoilState(MenuIndexStore);

    function toggleMenu() {
        setOpen((v) => !v);
        setIndex(6);
    }

    return <React.Fragment>
        <div onClick={() => toggleMenu()}
             className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-700 cursor-pointer text-white">
            <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-current text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <span className="font-semibold">Reports</span>
            </div>
            {open ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>}
        </div>
        <Collapse in={index === 6}>
           
        </Collapse>
    </React.Fragment>
}