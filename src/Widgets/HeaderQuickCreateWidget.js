import {useState} from "react";
import {Tooltip, Popover} from "@mantine/core";
import {Info, Plus, PlusCircle, XCircle, Box, ShoppingCart, ShoppingBag} from "react-feather";
import {Link} from 'react-router-dom';

export default function HeaderQuickCreateWidget() {
    const [open, setOpen] = useState(false);
    return <Popover
        opened={open}
        onClose={() => setOpen(false)}
        // target={open ? <XCircle onClick={() => setOpen((v) => !v)}/> :
        //     <PlusCircle onClick={() => setOpen((v) => !v)}/>
        // }
        target={<PlusCircle onClick={() => setOpen((v) => !v)} className="cursor-pointer text-white"/>
        }
        width={600}
        position="bottom"
        withArrow
        spacing="sm"
        noClickOutside={false}
        shadow="xl"
    >
        <div className="grid gap-6 grid-cols-3">
        {/*general*/}
            <div className="flex flex-col space-y-2">
               <MTitle icon={<Box size={16}/>} text="General"/>
                <MPartial text="Add Users"/>
                <MPartial text="Add Item"/>
                <MPartial text="Add Category"/>
                <MPartial text="Add Customer"/>
                <MPartial text="Add Supplier"/>
                <MPartial text="Add Roles"/>
                <MPartial text="Inventory Settings"/>
                <MPartial text="Settings"/>
            </div>

            {/*sales*/}
            <div className="flex flex-col space-y-2">
                <MTitle icon={<ShoppingCart size={16}/>} text="Sales"/>
                <MPartial text="Sales Orders"/>
                <MPartial text="Invoices"/>
                <MPartial text="Sales Receipts"/>
                <MPartial text="Customer Payments"/>
            </div>

            {/*purchase*/}
            <div className="flex flex-col space-y-2">
                <MTitle icon={<ShoppingBag size={16}/>} text="Purchases"/>
                <MPartial text="Purchase Orders"/>
                <MPartial text="Bills"/>
                <MPartial text="Disputes"/>
            </div>

        </div>
    </Popover>
}

function MPartial({icon, text, loc = "/dashboard"}){
    return <div className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-500">
        <Plus size={16}/>
        <Link to={loc}>{text}</Link>
    </div>
}

function MTitle({icon, text}){
    return <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 uppercase mb-2">
        {icon}
        <span>{text}</span>
    </div>
}