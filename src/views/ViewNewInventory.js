import SideMenu from "../Helpers/SideMenu";
import PartialHeader from "../Helpers/PartialHeader";
import SettingsSvg from "../Svgicons/SettingsSvg";
import React, {useState} from "react";
import InventorySvg from "../Svgicons/InventorySvg";
import {ActionIcon, Avatar, Button, Divider, Menu} from "@mantine/core";
import {ChevronDown, Plus, Settings} from "react-feather";
import SingeItemImg from '../images/drug.png';
import MultipleItemImg from '../images/medicine.png';
import {useHistory} from "react-router-dom";
import {AddSingleStockUrl} from "../Helpers/UrlHelper";

export default function ViewNewInventory() {
    const [stocksList, setStocksList] = useState([]);
    const history = useHistory();


    return <SideMenu title="New Item">
        <PartialHeader title="Stocks > New Stock Type" icon={<InventorySvg/>}/>
        <div className="w-full border-t border-gray-200">

                <div className="grid grid-cols-2 gap-4 w-3/4 mx-auto mt-8">
                    {/*stock groups*/}
                    {/*<div*/}
                    {/*    className="flex items-center justify-center flex-col shadow-md p-8 space-y-6 rounded bg-white hover:bg-gray-50 cursor-pointer">*/}
                    {/*    <span className="font-medium text-xl">Items group</span>*/}
                    {/*    <img src={MultipleItemImg} className="h-20 w-auto object-cover" alt={""}/>*/}
                    {/*    <span className="text-center">Create an item bundles that you sell together.</span>*/}
                    {/*    <Button className="bg-green-500">New Item Group</Button>*/}
                    {/*</div>*/}
                    {/*single stock*/}
                    <div
                        className="flex items-center justify-center flex-col shadow-md p-8 space-y-6 rounded bg-white hover:bg-gray-50 cursor-pointer"
                        onClick={() => history.push(AddSingleStockUrl)}>
                        <span className="font-medium text-xl">Item</span>
                        <img src={SingeItemImg} className="h-20 w-auto object-cover" alt={""}/>
                        <span className="text-center">Create a single item that you buy and sell.</span>
                        <Button style={{backgroundColor:"#582A72"}}>New Item</Button>
                    </div>
                </div>
        </div>
    </SideMenu>
}