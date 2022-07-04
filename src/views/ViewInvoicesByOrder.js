import SideMenu from "../Helpers/SideMenu";
import PartialHeader from "../Helpers/PartialHeader";
import React, {useEffect, useState} from "react";
import {Badge, Button, Loader, Menu} from "@mantine/core";
import {NewInvoiceUrl, NewSalesOrderUrl, SingleInvoiceUrl} from "../Helpers/UrlHelper";
import {ChevronDown, Plus} from "react-feather";
import {useHistory} from "react-router-dom";
import {InvoiceStatus, InvoiceStatusArr} from "../Helpers/Constants";
import {useDidUpdate} from "@mantine/hooks";
import useAjaxError from "../Helpers/useAjaxError";
import {getAxios} from "../Helpers/API";
import {GridHelper} from "../Helpers/GridHelper";
import {ColumnDirective, ColumnsDirective} from "@syncfusion/ej2-react-grids";

export default function ViewInvoicesByOrder(props) {
    const [id, setId] = useState(props.match.params.id);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState(null);
    const [ajaxError] = useAjaxError();
    const history = useHistory();

    if (id !== props.match.params.id) {
        setId(props.match.params.id);
    }

    async function fetchData() {
        setIsLoading(true);
        const result = await getAxios(`get/invoices/by/order?status=${status}&orderId=${id}`).catch(ajaxError).finally(() => {
            setIsLoading(false);
        });
        if (result) setData(result);
    }

    useEffect(() => {
        if (data.length > 0) return;
        setStatus("");
        fetchData();
    }, []);

    useDidUpdate(() => {
        fetchData();
    }, [status]);

    function handleOnStatusChange(status) {
        setStatus(status);
    }

    return <SideMenu title="Invoices">
        <PartialHeader title={"Invoices for order #" + id} icon={<div className="p-1.5 rounded-full bg-green-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
        </div>}/>

        {/*    filter and action button*/}
        <div className="w-full bg-white border-t border-gray-200">
            <div className="flex items-center w-full justify-between p-2">
                <div className="w-full bg-white">
                    <Menu withArrow={true} position={"bottom"} trigger="click" delay={500}
                          control={<div
                              className="flex items-center justify-between space-x-2 rounded-full bg-gray-50 p-1">
                              <b>All</b>
                              <ChevronDown/>
                          </div>}
                    >
                        <Menu.Item onClick={() => handleOnStatusChange("")}>All Invoices</Menu.Item>
                        {InvoiceStatusArr().map((s, i) => <Menu.Item
                            onClick={() => handleOnStatusChange(s?.label)} key={s?.label}>{s?.label}</Menu.Item>)}
                    </Menu>
                </div>

                <div>
                    <Button onClick={() => history.push(NewInvoiceUrl)} className="bg-green-500" leftIcon={<Plus/>}
                            size={"xs"}>New</Button>
                </div>
            </div>
        </div>

        {/*    main grid start*/}
        <div className="p-2">
            {data.length > 0 ? <GridHelper data={data}>
                <ColumnsDirective>
                    <ColumnDirective field="InvoiceDate" headerText="Date" width={150} format={"yMd"} datatype="date"/>
                    <ColumnDirective field="InvoiceId" headerText="Invoice#" visible={true} width={150} isPrimaryKey/>
                    <ColumnDirective field="OrderId" headerText="OrderId#" visible={true} width={150}/>
                    <ColumnDirective field="CustomerId" headerText="CustomerId" width={200} visible={false}/>
                    <ColumnDirective field="CustomerName" headerText="Customer Name" width={200}/>
                    <ColumnDirective template={statusTpl} headerText="Status" allowSearching={false} width={100}/>
                    <ColumnDirective template={viewTpl} headerText="Action" allowSearching={false} width={100}/>
                </ColumnsDirective>
            </GridHelper> : <Loader/>}
        </div>
        {/*    main grid end*/}
    </SideMenu>

    function statusTpl(props) {
        return <Badge radius={0}>{props?.InvoiceStatus || ""}</Badge>
    }

    function viewTpl(props) {
        return <Button variant="white" size={"xs"}
                       onClick={() => history.push(SingleInvoiceUrl + props.InvoiceId)}>View</Button>
    }
}