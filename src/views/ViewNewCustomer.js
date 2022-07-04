import SideMenu from "../Helpers/SideMenu";
import React from "react";
import PartialHeader from "../Helpers/PartialHeader";
import CustomersSvg from "../Svgicons/CustomersSvg";
import NewCustomer from "../components/Customers/NewCustomer";

export default function ViewNewCustomer(){
    return <SideMenu title="All Customers">
        <PartialHeader title="New Customer" icon={<CustomersSvg/>}/>

        <div className="w-full border-t border-gray-200">
            <div className="mx-auto w-3/4 bg-white p-4 rounded-lg mt-4 mb-4">
        <NewCustomer/>
            </div>
        </div>
    </SideMenu>
}