import {ActionIcon} from "@mantine/core";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {DashboardUrl} from "../UrlHelper";
import {useRecoilState} from "recoil";
import {MenuIndexStore} from "../../Store/Store";

export default function DashboardMenuItem() {
    const history = useHistory();
    const [index, setIndex] = useRecoilState(MenuIndexStore);
    function toggleMenu() {
        setIndex(null);
        history.push(DashboardUrl)
    }
    return <React.Fragment>
        <div
            onClick={() => toggleMenu()}
            className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-700 cursor-pointer text-white">
            <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-current text-white"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>

                </div>
                <span className="font-semibold">Dashboard</span>
            </div>
        </div>
    </React.Fragment>
}