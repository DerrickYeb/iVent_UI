import PartialHeader from "../Helpers/PartialHeader";
import SalesOrderSvg from "../Svgicons/SalesOrderSvg";
import {ActionIcon, Badge, Button, Loader, Menu, Select, TextInput} from "@mantine/core";
import {
    OrderPaymentPeriod,
    OrderReminderPeriod,
    OrderStatus,
    SalesOrdersStatus,
    StockStatus
} from "../Helpers/Constants";
import SideMenu from "../Helpers/SideMenu";
import React, {useEffect, useState} from "react";
import {ChevronDown, Plus, Settings} from "react-feather";
import {useHistory} from 'react-router-dom';
import {NewProformaUrl} from "../Helpers/UrlHelper";
import {useRecoilState} from "recoil";
import {ProformasListStore} from "../Store/Store";
import useAjaxError from "../Helpers/useAjaxError";
import {getAxios} from "../Helpers/API";
import {GridHelper} from "../Helpers/GridHelper";
import {ColumnDirective, ColumnsDirective} from "@syncfusion/ej2-react-grids";
import {useDidUpdate} from "@mantine/hooks";
import ProformaDetails from "../components/ProformasPartial/ProformaDetails";

export default function ViewProformas() {
    const [data, setData] = useRecoilState(ProformasListStore);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState(null);
    const [ajaxError] = useAjaxError();
    const history = useHistory();

    async function fetchData() {
        setIsLoading(true);
        const result = await getAxios(`proforma/get/proformas?status=${status}`).catch(ajaxError).finally(() => {
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
        // if (!status) return;
        fetchData();
    }, [status]);

    function handleOnStatusChange(status) {
        setStatus(status);
    }


    return <SideMenu title="Proformas">
        <PartialHeader title="Proformas" icon={<SalesOrderSvg/>}/>
        <div className="w-full border-t border-gray-200 bg-white">
            <div className="flex items-center bg-white justify-end space-x-6 p-2">
                {/*<div>*/}
                {/*    <Menu withArrow={true} position={"bottom"} trigger="click" delay={500}*/}
                {/*          control={<div*/}
                {/*              className="flex items-center justify-between space-x-2 rounded-full bg-gray-50 p-1">*/}
                {/*              <b>All</b>*/}
                {/*              <ChevronDown/>*/}
                {/*          </div>}*/}
                {/*    >*/}
                {/*        <Menu.Item onClick={() => handleOnStatusChange("")}>All</Menu.Item>*/}
                {/*        {SalesOrdersStatus.map((s, i) => <Menu.Item*/}
                {/*            onClick={() => handleOnStatusChange(s?.label)} key={s?.label}>{s?.label}</Menu.Item>)}*/}
                {/*    </Menu>*/}
                {/*</div>*/}


                <div className="flex items-center space-x-4">
                    <Button onClick={() => history.push(NewProformaUrl)} className="bg-green-500" leftIcon={<Plus/>}
                            size={"xs"}>New</Button>
                    <ActionIcon>
                        <Settings/>
                    </ActionIcon>
                </div>

            </div>

        </div>

        {/*    main list grid*/}
        <div className="p-2">
            {data.length > 0 ? <GridHelper data={data}>
                <ColumnsDirective>
                    <ColumnDirective field="Dated" headerText="Date" width={150} format={"yMd"} datatype="date"/>
                    <ColumnDirective field="OrderId" headerText="Sales Order#" visible={true} width={150} isPrimaryKey/>
                    <ColumnDirective field="ReferenceId" headerText="Reference#" visible={true} width={150}/>
                    <ColumnDirective field="CustomerId" headerText="CustomerId" width={200} visible={false}/>
                    <ColumnDirective field="CustomerName" headerText="Customer Name" width={200}/>
                    {/*<ColumnDirective template={statusTpl} headerText="Status" allowSearching={false} width={100}/>*/}
                    <ColumnDirective template={viewTpl} headerText="Action" allowSearching={false} width={100}/>
                </ColumnsDirective>
            </GridHelper> : <div>Trying to fetch proformas... Please wait.</div>}
        </div>

        {/*proforma details*/}
        <ProformaDetails open={open} onClose={() => setOpen(false)} object={order}/>

    </SideMenu>


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