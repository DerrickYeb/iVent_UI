import useSWR from 'swr';
import {getAxios} from "../../Helpers/API";
import InvoicesListGrid from "../../Helpers/Grids/InvoicesListGrid";
import React from "react";
import {formatDate, MoneyFormat} from "../../Helpers/Constants";
import {Badge} from "@material-ui/core";
import MantineTableHelper from "../../Helpers/MantineTableHelper";
import {SingleInvoiceUrl} from "../../Helpers/UrlHelper";
import {Button} from "@mantine/core";
import {useHistory} from "react-router-dom";
function TableHead() {
    return <tr>
        <th>Date</th>
        <th>Invoice #</th>
        <th>Order #</th>
        <th>Status</th>
        <th>Action</th>

    </tr>
}
export default function PaymentReceivedInvoiceList({list}) {
    const history = useHistory();

    const rows = list && list.map((row, _) => (
        <tr key={row.InvoiceId}>
            <td>{formatDate(row?.InvoiceDate)}</td>
            <td>{row?.InvoiceId}</td>
            <td>{row?.OrderId}</td>
            <td><Badge>{row?.InvoiceStatus}</Badge></td>
            <td>
                <Button variant="white" size={"xs"}
                        onClick={() => history.push(SingleInvoiceUrl + row?.InvoiceId)}>View</Button>
            </td>
        </tr>
    ))


    return list && <div>
        <MantineTableHelper head={<TableHead/>} rows={rows} height={250}/>
    </div>
}