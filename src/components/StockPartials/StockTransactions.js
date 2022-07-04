import {ActionIcon, Badge, Button, Loader, Menu, Select, TextInput} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
import useAjaxError from "../../Helpers/useAjaxError";
import {GridHelper} from "../../Helpers/GridHelper";
import {ColumnDirective, ColumnsDirective} from "@syncfusion/ej2-react-grids";
import SalesOrderDetails from "../../components/SalesOrders/SalesOrderDetails";
import useSWR from "swr";
import {getAxios} from "../../Helpers/API";

export default function StockTransactions({stockId}) {
    const {data, error} = useSWR(stockId ? `stocks/get/stock/trans?stockId=${stockId}`: null, getAxios);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState(null);
    const [ajaxError] = useAjaxError();
    const history = useHistory();

    if(!data && !error) return <div><Loader/></div>

    if(data && !error)
    return <div>
        {data.length > 0 ? <GridHelper data={data}>
            <ColumnsDirective>
                <ColumnDirective field="Dated" headerText="Date" format={"yMd"} datatype="date"/>
                <ColumnDirective field="OrderId" headerText="Sales Order#" visible={true} isPrimaryKey/>
                <ColumnDirective field="ReferenceId" headerText="Reference#" visible={true}/>
                <ColumnDirective field="CustomerId" headerText="CustomerId" visible={false}/>
                <ColumnDirective field="CustomerName" headerText="Customer Name"/>
                <ColumnDirective template={statusTpl} headerText="Status" visible={false} allowSearching={false}/>
                <ColumnDirective template={viewTpl} headerText="Action" allowSearching={false}/>
            </ColumnsDirective>
        </GridHelper> : <Loader/>}

        {/*sales order details*/}
        <SalesOrderDetails open={open} onClose={() => setOpen(false)} object={order}/>

    </div>

    return null;

    function statusTpl(props) {
        return <Badge radius={0}>{props?.OrderStatus || ""}</Badge>
    }

    function viewTpl(props) {
        return <Button variant="white" size={"xs"} onClick={() => {
            setOrder(props);
            setOpen(true);
        }
        }>View</Button>
    }
}