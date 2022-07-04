import React, {useEffect, useState} from 'react';
import SideMenu from "../Helpers/SideMenu";
import PartialHeader from "../Helpers/PartialHeader";
import {Link, useHistory} from 'react-router-dom';
import {
    Button,
    Loader,
    TextInput,
    NumberInput,
    Select,
    Divider,
    Table,
    ActionIcon,
    Tooltip,
    Collapse,
    Tabs,
    ScrollArea,
    Avatar
} from '@mantine/core';
import {OrderReminderPeriod, OrderPaymentPeriod, Prefix, MoneyFormat, RefPrefix, InvPrefix} from '../Helpers/Constants'
import {v4 as uuidv4} from 'uuid';
import {useDidUpdate} from '@mantine/hooks';
import {getAxios, postAxios} from "../Helpers/API";
import useAjaxError from "../Helpers/useAjaxError";
import {cloneDeep} from "lodash";
import {XCircle} from 'react-feather';
import {useRecoilState} from "recoil";
import {InvoiceListStore} from "../Store/Store";
import useSWR from 'swr';
import {useFetchLovOrdersList} from "../Hooks/SWRHooks/useLovHooks";
import SalesOrderDetails from "../components/SalesOrders/SalesOrderDetails";
import {InvoicesUrl} from "../Helpers/UrlHelper";


export default function ViewNewInvoice() {
    const [data, setData] = useRecoilState(InvoiceListStore);
    const [isWorking, setIsWorking] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [invoiceId, setInvoiceId] = useState("");
    const [orderId, setOrderId] = useState(null);
    const [orderDetails, setOrderDetails] = useState("");
    //const [customerId, setCustomerId] = useState("");
    const history = useHistory();
    const [ajaxError] = useAjaxError();

    useEffect(() => {
        const genId = InvPrefix + "-" + uuidv4().split("-")[0].toUpperCase();
        setInvoiceId(genId);
    }, []);

    async function fetchOrderDetails() {
        const result = await getAxios(`sales/orders/get/order?orderId=${orderId}`).catch(ajaxError);
        if (result) setOrderDetails(result);
    }


    useDidUpdate(() => {
        if (!orderId) return setOrderDetails(null);
        fetchOrderDetails();
    }, [orderId])

    const {data: ordersLov, error} = useFetchLovOrdersList();


    return <SideMenu title="New Invoice">
        <PartialHeader title="New Invoice" icon={<div className="p-1.5 rounded-full bg-green-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
        </div>}/>


        <div className="mx-auto flex flex-col space-y-2 bg-white mt-8 p-6 rounded-lg shadow w-2/4">
            {/*    section*/}
            {/*    order basic details section*/}
            <div>
                <Select
                    label="Select Order"
                    placeholder="Select Order"
                    data={ordersLov || []}
                    onChange={(e) => handleOrderSelectChange(e)}
                />
            </div>
            {orderDetails &&
            <Button variant={"subtle"} size={"xs"} onClick={() => setOpenDrawer((v) => !v)}>View Order Details</Button>}


            {/*    new invoice form*/}
            <div className="mt-8">
                <TextInput value={invoiceId} label="Invoice Id" placeholder="Invoice Id"
                           onChange={(e) => setInvoiceId(e.target.value)}/>
            </div>

            <div className="mt-4">
                <Button loading={isWorking} onClick={() => handleCreateInv()}>Create</Button>
            </div>
        </div>

        {/*sales order details*/}
        <SalesOrderDetails open={openDrawer} onClose={() => setOpenDrawer(false)} object={orderDetails}/>
    </SideMenu>

    function handleOrderSelectChange(e) {
        setOrderId(e);
    }

    async function handleCreateInv() {
        setIsWorking(true);
        let payload = {
            InvoiceId: invoiceId,
            OrderId: orderId
        }
        const result = await postAxios("new/invoice", payload).catch(ajaxError).finally(() => setIsWorking(false));
        if (result) {
            const arr = data.unshift(result);
            //arr.unshift(result);
            setData(arr);
            history.push(InvoicesUrl);
        }
    }
}