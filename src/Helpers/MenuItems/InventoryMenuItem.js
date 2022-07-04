import {ActionIcon, Collapse} from "@mantine/core";
import React, {useState} from "react";
import SubMenuItem from "./SubMenuItem";
import {
    AllInventoryUrl, BrandsManagementUrl, CategoriesManagementUrl,
    ChangePasswordUrl,
    GeneralSettingsUrl, NewInventoryUrl,
    RolesManagementUrl,
    UsersManagementUrl
} from "../UrlHelper";
import {useRecoilState} from "recoil";
import {MenuIndexStore} from "../../Store/Store";

export default function InventoryMenuItem() {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useRecoilState(MenuIndexStore);

    function toggleMenu() {
        setOpen((v) => !v);
        setIndex(1);
    }
    return <React.Fragment>
        <div onClick={() => toggleMenu()}
             className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-700 cursor-pointer text-white">
            <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-current text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <span className="font-semibold">Stocks</span>
            </div>
            {open ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>}
        </div>
        <Collapse in={index === 1}>
            <div className="flex flex-col space-y-2 ml-4 mr-4 pt-2 pb-2">
                <SubMenuItem text={"All Stocks"} loc={AllInventoryUrl}/>
                <SubMenuItem text={"New Stock"} loc={NewInventoryUrl}/>
                <SubMenuItem text={"Categories"} loc={CategoriesManagementUrl}/>
                <SubMenuItem text={"Brands"} loc={BrandsManagementUrl}/>
                <SubMenuItem text={"Manufacturers"} loc={NewInventoryUrl}/>
                {/*<SubMenuItem text={"Stocks Adjustment"}/>*/}
            </div>
        </Collapse>
    </React.Fragment>
}