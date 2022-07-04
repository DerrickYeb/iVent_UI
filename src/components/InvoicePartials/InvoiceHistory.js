import React, {useMemo} from 'react';
import useSWR from "swr";
import {getAxios} from "../../Helpers/API";
import { Table } from '@mantine/core';
import {formatDate} from "../../Helpers/Constants";
export default function InvoiceHistory({invId}) {

    const {data, mutate, error} = useSWR(invId ? `get/invoice/history?invoiceId=${invId}` : null, getAxios);


    const rows = data && data.map((element) => (
        <tr key={element.InvoiceId}>
            <td>{element.History}</td>
            <td>{formatDate(element.Dated)}</td>
        </tr>
    ));

    if (!data && !error) return <div>Trying to get invoice history</div>

    if (data && !error)
        return <div>
            <Table>
                <thead>
                <tr>
                    <th>History</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </div>

    return null;
}