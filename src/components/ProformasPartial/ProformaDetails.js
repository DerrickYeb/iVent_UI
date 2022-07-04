import {ActionIcon, Menu, Tooltip, Button, Tabs, Divider, ScrollArea} from "@mantine/core";
import {ChevronDown, XCircle} from "react-feather";
import {CustomersTypeToArray, MoneyFormat, SalesOrdersStatus} from "../../Helpers/Constants";
import {BasicRightDrawerUtils} from "../../modals/ModalUtils";
import React, {useState} from "react";
import {useDidUpdate} from "@mantine/hooks";
import {useRecoilState} from "recoil";
import {SalesOrdersListStore} from "../../Store/Store";
import useAjaxError from "../../Helpers/useAjaxError";
import {useHistory} from "react-router-dom";
import useSWR from "swr";
import {getAxios} from "../../Helpers/API";
import moment from "moment";
import SalesOrdersButtonGroup from "../SalesOrders/SalesOrdersButtonGroup";
import SalesOrderStatusToggle from "../SalesOrders/SalesOrderStatusToggle";
import ProformaInfo from "./ProformaInfo";
import {NewProformaUrl} from "../../Helpers/UrlHelper";

export default function ProformaDetails({open, onClose, object}) {
    //const {OrderId} = object;
    //const [data, setData] = useRecoilState(SalesOrdersListStore);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [ajaxError] = useAjaxError();
    const history = useHistory();

    const {
        data: d,
        mutate,
        error: err
    } = useSWR(object?.OrderId ? `proformas/get/proforma?orderId=${object?.OrderId}` : null, getAxios);


    useDidUpdate(() => {
        // if (!status) return;
        //fetchData();
    }, [status]);

    function handleOnStatusChange(status) {
        setStatus(status);
    }


    return <BasicRightDrawerUtils open={open} onClose={onClose} size="82%">
        <div className="flex items-start">
            {/*    left section*/}
            <div className="border-r border-gray-200 w-2/6 flex-grow">
                <div className="flex p-4 items-center justify-end border-b">
                    {/*<Menu withArrow={true} position={"bottom"} trigger="click" delay={500}*/}
                    {/*      control={<div*/}
                    {/*          className="flex items-center justify-between space-x-2 rounded-full bg-gray-50 p-1">*/}
                    {/*          <b>All</b>*/}
                    {/*          <ChevronDown/>*/}
                    {/*      </div>}*/}
                    {/*>*/}
                    {/*    <Menu.Item onClick={() => handleOnStatusChange("")}>All</Menu.Item>*/}
                    {/*    {SalesOrdersStatus.map((s, i) => <Menu.Item*/}
                    {/*        onClick={() => handleOnStatusChange(s?.label)} key={s?.label}>{s?.label}</Menu.Item>)}*/}
                    {/*</Menu>*/}

                    <Button variant="filled"
                            size={"xs"}
                            compact
                            onClick={() => history.push(NewProformaUrl)}
                            leftIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                           viewBox="0 0 24 24"
                                           stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>}>
                        New
                    </Button>
                </div>


                {/*  sales orders list*/}
                <EachOrderCard data={object}/>
            </div>


            {/*right section*/}
            <div className="flex-grow w-4/6 bg-white">
                {/*top action buttons*/}
                <div className="items-center bg-white p-4 flex justify-between space-x-4">
                    <div>Proforma# {object?.OrderId}</div>

                    {/*action buttons*/}
                    <div className="flex space-x-4 items-center">
                        <div>
                            <SalesOrdersButtonGroup data={object}/>
                        </div>
                        {/*<div>*/}
                        {/*    <SalesOrderStatusToggle data={d} mutate={mutate}/>*/}
                        {/*</div>*/}
                    </div>
                    {/*action buttons*/}
                    {/*close button*/}
                    <div>
                        <ActionIcon variant="hover" onClick={onClose} size={"sm"}><XCircle/></ActionIcon>
                    </div>
                </div>
                {/*    divider*/}
                <Divider/>
                {/*    tabs*/}

                <Tabs>
                    <Tabs.Tab label="Proforma Info">
                        <ScrollArea style={{height: 520}}>
                            <ProformaInfo data={d} totalAmt={object?.OrderTotalAmt}
                                                 totalDiscount={object?.OrderTotalDiscount}/>
                        </ScrollArea>
                    </Tabs.Tab>
                    <Tabs.Tab label="Comments">Comments</Tabs.Tab>
                    <Tabs.Tab label="Files">Files</Tabs.Tab>
                </Tabs>

            </div>
        </div>
    </BasicRightDrawerUtils>
}


function EachOrderCard({data}) {
    return <div className="flex justify-between p-4 text-gray-600 text-xs">
        <div className="flex flex-col space-y-1">
            <span className="text-gray-800 text-sm">{data?.CustomerName}</span>
            <div className="flex items-center space-x-2">
                <span>{data?.OrderId}</span>
                <div className="h-1.5 w-1.5 bg-gray-200 rounded-full"/>
                <span>{moment(data?.Dated).format("ll")}</span>
            </div>
            <span className="text-xs">{data?.ReferenceId}</span>
        </div>
        <div className="flex flex-col space-y-1">
            <span className="text-gray-800 text-sm">{MoneyFormat(data?.OrderTotalAmt)}</span>

            <span>{data?.OrderStatus}</span>
        </div>
    </div>
}