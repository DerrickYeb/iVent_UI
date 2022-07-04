import {Button, Popover, Menu} from '@mantine/core';
import {OrderStatus} from "../../Helpers/Constants";
import React, {useState} from 'react';
import {Clock, CheckCircle, X, Frown} from "react-feather";
import {Badge} from '@mantine/core';

export default function SalesOrderStatusToggle({data: d, mutate}) {
    const [opened, setOpened] = useState(false);


    return <Badge
        size={"xl"}
        radius={0}
        variant={"filled"}
        color={d?.OrderStatus === OrderStatus.Pending
            ? "yellow" : d?.OrderStatus === OrderStatus.Completed
                ? "teal" : d?.OrderStatus === OrderStatus.Cancelled ? "red"
                    : "blue"
        }
    >
        {d?.OrderStatus}
    </Badge>


    // return <Button variant={"light"}>
    //     {d?.OrderStatus === OrderStatus.Pending ? "Mark as Confirmed" : d?.OrderStatus === OrderStatus.Completed ? "Order" "Status Not Available"}
    // </Button>
    // return <Popover
    //     opened={opened}
    //     spacing="xs"
    //     onClose={() => setOpened(false)}
    //     target={<Button
    //         onClick={() => setOpened((o) => !o)}
    //         variant={"light"}
    //         color={d?.OrderStatus === OrderStatus.Pending ? "green" : d?.OrderStatus === OrderStatus.Completed ? "green" : d?.OrderStatus === OrderStatus.Cancelled ? "red" : "green"}
    //     >
    //         {d?.OrderStatus === OrderStatus.Pending ? "Mark as Confirmed" : d?.OrderStatus === OrderStatus.Completed ? "Order Completed" : d?.OrderStatus === OrderStatus.Cancelled ? "Order Cancelled" : "Status Not Available"}
    //     </Button>}
    //     //width={260}
    //     position="bottom"
    //     withArrow
    // >
    //     <div className="flex flex-col space-y-2">
    //         <Partial icon={<CheckCircle/>} title="Mark as Confirmed" color={"green"}/>
    //         <Partial icon={<X/>} title="Mark as Cancelled" color="red"/>
    //         <Partial icon={<Clock/>} title="Mark as Pending"/>
    //         <Partial icon={<Frown/>} title="Mark as Declined" color="dark"/>
    //     </div>
    //
    // </Popover>
}

// function Partial({title, icon, desc = "mark order status based", color}) {
//     return <Button variant="light" size={"xl"} leftIcon={icon} color={color}>
//         <div className="flex flex-col space-y-0 p-4">
//             <span className="text-base font-semibold text-gray-800">{title}</span>
//             <span className="text-gray-500 text-xs">{desc}</span>
//         </div>
//     </Button>
// }