import {Badge} from "@mantine/core";
import {InvoiceStatus, OrderStatus} from "../Helpers/Constants";
import React from "react";

export default function BadgeWidget({status, variant="filled", radius=0}) {
    return <Badge
        color={status === OrderStatus.Pending ? "yellow"
            : status === InvoiceStatus.Completed ? "teal"
                : "blue"}
        variant={variant}
        radius={radius}
    >{status || ""}</Badge>
}