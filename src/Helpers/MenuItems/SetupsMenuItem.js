import {ActionIcon, Collapse, Button} from "@mantine/core";
import React, {useState} from "react";
import SubMenuItem from "./SubMenuItem";
import {ChangePasswordUrl, GeneralSettingsUrl, RolesManagementUrl, UsersManagementUrl} from "../UrlHelper";
import {MenuIndexStore} from "../../Store/Store";
import {useRecoilState} from 'recoil';

export default function SetupsMenuItem() {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useRecoilState(MenuIndexStore);

    function toggleMenu() {
        setOpen((v) => !v);
        setIndex(0);
    }

    return <React.Fragment>
        <div onClick={() => toggleMenu()}
             className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-700 cursor-pointer text-white">
            <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-current text-white" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </div>
                <span className="font-semibold">Setups</span>
            </div>
            {open ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>}
        </div>
        <Collapse in={index === 0}>
            <div className="flex flex-col space-y-2 ml-4 mr-4 pt-2 pb-2">
                <SubMenuItem text={"Users Management"} loc={UsersManagementUrl}/>
                <SubMenuItem text={"Change Password"} loc={ChangePasswordUrl}/>
                <SubMenuItem text={"Roles Management"} loc={RolesManagementUrl}/>
                {/*<SubMenuItem text={"Unit of Measurement"}/>*/}
                {/*<SubMenuItem text={"Inventory Settings"}/>*/}
                <SubMenuItem text={"General Settings"} loc={GeneralSettingsUrl}/>
            </div>
        </Collapse>
    </React.Fragment>
}