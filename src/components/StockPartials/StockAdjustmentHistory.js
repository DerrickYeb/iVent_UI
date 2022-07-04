import React, {useMemo} from 'react';
import useSWR from "swr";
import {getAxios} from "../../Helpers/API";
import {Table} from '@mantine/core';
import {isEmpty} from 'lodash';
import {formatDate} from "../../Helpers/Constants";

export default function StockAdjustmentHistory({productId}) {
    const {data, mutate, error} = useSWR(productId ? `stock/get/adjustments/h?productId=${productId}` : null, getAxios);

    const dataArr = useMemo(() => !isEmpty(data) ? data : [], [data]);


    const rows = dataArr.map((element) => (
        <tr key={element?.AdjustmentId}>
            <td>{element?.PreviousQty}</td>
            <td>{element?.AddedQty}</td>
            <td>{element?.PreviousQty + element?.AddedQty}</td>
            <td>{element?.Fullname}</td>
            <td>{formatDate(element?.Dated)}</td>
            <td>{element?.Comment}</td>
        </tr>
    ));

    return (
        <Table highlightOnHover>
            <thead>
            <tr>
                <th>Previous Qty.</th>
                <th>Added Qty.</th>
                <th>Total Qty.</th>
                <th>Adjusted By</th>
                <th>Adj. Date</th>
                <th>Comment/Note</th>
            </tr>
            </thead>
            <tbody>{rows}</tbody>
        </Table>
    );
}