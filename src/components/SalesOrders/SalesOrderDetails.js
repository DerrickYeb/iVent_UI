import {ActionIcon, Menu, Tooltip, Button, Tabs, Divider, ScrollArea, Badge} from "@mantine/core";
import {ChevronDown, XCircle} from "react-feather";
import {
    CustomersTypeToArray, formatDate,
    InvoiceStatus,
    MoneyFormat,
    OrderStatus,
    SalesOrdersStatus
} from "../../Helpers/Constants";
import {BasicRightDrawerUtils} from "../../modals/ModalUtils";
import React, {useEffect, useState} from "react";
import {useDidUpdate} from "@mantine/hooks";
import {useRecoilState} from "recoil";
import {SalesOrdersListStore} from "../../Store/Store";
import useAjaxError from "../../Helpers/useAjaxError";
import {useHistory} from "react-router-dom";
import useSWR from "swr";
import {getAxios} from "../../Helpers/API";
import moment from "moment";
import SalesOrdersButtonGroup from "./SalesOrdersButtonGroup";
import SalesOrderStatusToggle from "./SalesOrderStatusToggle";
import SalesOrderOrderInfo from "./SalesOrderOrderInfo";
import {NewSalesOrderUrl} from "../../Helpers/UrlHelper";
import BadgeWidget from "../../Widgets/BadgeWidget";
import TabLabelWidget from "../../Widgets/TabLabelWidget";
import PrimeGridHelper from "../../Helpers/PrimeGridHelper";
import {Column} from "primereact/column";
import PaymentReceivedInfo from "../PaymentsPartial/PaymentReceivedInfo";
import SalesOrderInfoComments from "./SalesOrderInfoComments";

export default function SalesOrderDetails({open, onClose, object}) {
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
    } = useSWR(object?.OrderId ? `sales/orders/get/order?orderId=${object?.OrderId}` : null, getAxios);


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
            <div className="border-r border-gray-200 bg-white w-2/6 flex-grow">
                <div className="flex p-4 items-center justify-end border-b">
                    {/*<Menu withArrow={true} position={"bottom"} trigger="click" delay={500}*/}
                    {/*      control={<div*/}
                    {/*          className="flex items-center justify-between space-x-2 rounded-lg bg-gray-50 p-1">*/}
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
                            onClick={() => history.push(NewSalesOrderUrl)}
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
                <div className="items-center bg-white p-2.5 flex justify-between space-x-4">
                    <div className="font-semibold">Order# {object?.OrderId}</div>

                    {/*action buttons*/}
                    <div className="flex space-x-4 items-center">
                        <div>
                            <SalesOrdersButtonGroup data={object}/>
                        </div>
                        <div>
                            <SalesOrderStatusToggle data={d} mutate={mutate}/>
                        </div>
                    </div>
                    {/*action buttons*/}
                    {/*close button*/}
                    <div>
                        <ActionIcon variant="filled" color={"red"} radius={100} onClick={onClose} size={"sm"}><XCircle/></ActionIcon>
                    </div>
                </div>
                {/*    divider*/}
                <Divider/>
                {/*    tabs*/}

                <Tabs>
                    <Tabs.Tab label={<TabLabelWidget title="Order Info"/>}>
                        <ScrollArea style={{height: 520}}>
                            <SalesOrderOrderInfo data={d} totalAmt={object?.OrderTotalAmt}
                                                 totalDiscount={object?.OrderTotalDiscount}
                                                 paymentProgress={d?.PaymentProgress?.PmtPrg}
                                                 isInvoiceSettled={d?.PaymentProgress?.IsInvoiceSettled}
                            />
                        </ScrollArea>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Payments History"/>}>
                        <OrderPaymentsHistory data={d?.PaymentHistory?.PmtHist}/>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Comments"/>}>
                        <SalesOrderInfoComments orderId={object?.OrderId}/>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Files"/>}>Files</Tabs.Tab>
                </Tabs>

            </div>
        </div>
    </BasicRightDrawerUtils>
}


function EachOrderCard({data}) {
    return <div className="flex justify-between p-4 text-gray-600 text-xs">
        <div className="flex flex-col space-y-1">
            <span className="text-gray-800 text-sm font-semibold">{data?.CustomerName}</span>
            <div className="flex items-center space-x-2">
                <span>{data?.OrderId}</span>
                <div className="h-1.5 w-1.5 bg-gray-200 rounded-full"/>
                <span>{moment(data?.Dated).format("ll")}</span>
            </div>
            <span className="text-xs">{data?.ReferenceId}</span>
        </div>
        <div className="flex flex-col space-y-1">
            <span className="text-gray-800 text-sm font-semibold">{MoneyFormat(data?.OrderTotalAmt)}</span>
            <BadgeWidget status={data?.OrderStatus}/>
            {/*<Badge*/}
            {/*    color={data?.OrderStatus === OrderStatus.Pending ? "yellow"*/}
            {/*        : data?.OrderStatus === InvoiceStatus.Completed ? "teal"*/}
            {/*            : "blue"}*/}
            {/*    variant={"filled"}*/}
            {/*    radius={0}*/}
            {/*>{data?.OrderStatus || ""}</Badge>*/}
        </div>
    </div>
}


function OrderPaymentsHistory({data}) {

    if (data && data.length > 0) return <div>
        <div className="p-2 font-medium text-gray-500 text-sm"><b>Note:</b> Amount shown may be higher which means the payment history accounts for other invoices that were paid for at the same time.</div>
        <PrimeGridHelper data={data} dataKey={"PaymentId"}
                                                              header="Order Payments History"
                                                              globalFilters={["PaymentId", "PaymentMethod", "Dated", "PaymentAmt"]}>
        <Column body={dateTpl} header="Date"/>
        <Column field="PaymentId" header="Payment#"/>
        <Column body={amountTpl} header="Amount"/>
        <Column field="PaymentMethod" header="Mode"/>
    </PrimeGridHelper>

    </div>;
    return <div>N/A</div>;

    function dateTpl(props) {
        return <span>{formatDate(props?.Dated)}</span>
    }

    function amountTpl(props) {
        return <span>{MoneyFormat(props?.PaymentAmt)}</span>
    }

}