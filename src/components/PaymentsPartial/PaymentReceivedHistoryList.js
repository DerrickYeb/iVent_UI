import React from "react";
import {formatDate, MoneyFormat} from "../../Helpers/Constants";
import {Badge} from "@mantine/core";
import MantineTableHelper from "../../Helpers/MantineTableHelper";

function TableHead() {
    return <tr>
        <th>Date</th>
        <th>User</th>
        <th>Payment #</th>
        <th>Payment Amount</th>

    </tr>
}

export default function PaymentReceivedHistoryList({list}) {

    const rows = list && list.map((row, _) => (
        <tr key={row.Id}>
            <td>{formatDate(row?.Dated)}</td>
            <td>{row?.Fullname}</td>
            <td>{row?.PaymentId}</td>
            <td>{MoneyFormat(row?.PaymentAmt)}</td>
        </tr>
    ))


    return list && <div>
        <MantineTableHelper head={<TableHead/>} rows={rows} height={150}/>
    </div>

}