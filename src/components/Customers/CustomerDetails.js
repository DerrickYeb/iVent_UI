import {BasicModalUtils, BasicRightDrawerUtils} from "../../modals/ModalUtils";
import {ActionIcon, Button, Menu, Tooltip, Avatar, Badge, Tabs, TextInput, ScrollArea, Select} from "@mantine/core";
import {ChevronDown, XCircle, AtSign, Edit2, Edit3, Edit} from "react-feather";
import {
    CustomersTypeToArray,
    formatDate,
    MoneyFormat,
    OrderReminderPeriod,
    SalutationToArray
} from "../../Helpers/Constants";
import React, {useEffect, useRef, useState, useMemo, useCallback} from "react";
import {AllCustomersUrl, NewCustomerUrl, NewSalesOrderUrl, SingleInvoiceUrl} from "../../Helpers/UrlHelper";
import {useHistory} from "react-router-dom";
import useAjaxError from "../../Helpers/useAjaxError";
import useSWR from "swr";
import {getAxios, postAxios} from "../../Helpers/API";
import AvatarImg from '../../images/avatar.png';
import TabLabelWidget from "../../Widgets/TabLabelWidget";
import PrimeGridHelper from "../../Helpers/PrimeGridHelper";
import {Column} from 'primereact/column';
import BadgeWidget from "../../Widgets/BadgeWidget";
import SalesOrderDetails from "../SalesOrders/SalesOrderDetails";
import SideMenu from "../../Helpers/SideMenu";
import PaymentReceivedInfo from "../PaymentsPartial/PaymentReceivedInfo";
import {ColumnDirective} from "@syncfusion/ej2-react-grids";
import ReceiptInfo from "../ReceiptsPartial/ReceiptInfo";
import {debounce} from 'lodash'
import CustomerInfoAvatar from "./CustomerInfoAvatar";
import useToasts from "../../Helpers/MyToasts";
import OtherDetails from "./CustomerDetailsTabs/CustomerInfoOtherDetailsTab";
import Addresses from "./CustomerDetailsTabs/CustomerInfoAddressesTab";
import ContactPersons from "./CustomerDetailsTabs/CustomerInfoContactsTab";

export default function CustomerDetails({open, onClose, object, showEdit = true}) {
    //const [customerId, setCustomerId] = useState(object?.CustomerId);
    const history = useHistory();
    const [d, setD] = useState(null);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [ajaxError] = useAjaxError();
    const accIdRef = useRef(null);

    async function fetchData(id) {
        const result = await getAxios(`customers/get/customer?customerId=${id}`)
            .catch(ajaxError);
        if (result) setD(result);
    }

    const fetchD = useCallback(async () => {
        await fetchData(object?.CustomerId);
    }, [object?.CustomerId]);

    useEffect(() => {
        fetchD();
    }, [object?.CustomerId]);


    async function handleOnAnotherCustomerSelected(customer) {
        await fetchData(customer);
    }

    function handleAvatarChangedDone(fileUrl) {
        setD({
            ...d,
            CustomerAvatar: fileUrl
        })
    }

    function handleBasicInfoChangedDone(obj) {
    setD(obj);
    }

    // const {
    //     data: d,
    //     mutate,
    //     error: err
    // } = useSWR(customerId ? `customers/get/customer?customerId=${customerId}` : null, getAxios);


    return <BasicRightDrawerUtils open={open} onClose={onClose} size="82%">
        <div className="flex">
            {/*    left section*/}
            <div className="border-r border-gray-200 w-2/6 bg-white flex-grow">
                <div className="flex p-4 items-center justify-end border-b">
                    {/*<Menu withArrow={true} position={"bottom"} trigger="click" delay={500}*/}
                    {/*      control={<div*/}
                    {/*          className="flex items-center justify-between space-x-2 rounded-full bg-gray-50 p-1">*/}
                    {/*          <b>All Customers</b>*/}
                    {/*          <ChevronDown/>*/}
                    {/*      </div>}*/}
                    {/*>*/}
                    {/*    <Menu.Item onClick={() => handleChange("")}>All Customers</Menu.Item>*/}
                    {/*    {CustomersTypeToArray().slice(1).map((s, i) => <Menu.Item*/}
                    {/*        onClick={() => handleChange(s?.value)} key={s?.value}>{s?.label}</Menu.Item>)}*/}
                    {/*</Menu>*/}

                    <Button variant="filled"
                            size={"xs"}
                            compact
                            onClick={() => history.push(NewCustomerUrl)}
                            leftIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                           viewBox="0 0 24 24"
                                           stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>}>
                        New
                    </Button>
                </div>
                <EachCustomerCard data={d}/>
                {/*    fetch other customers*/}
                <FetchOtherCustomers currentCustomer={d?.CustomerId}
                                     onSelected={(customer) => handleOnAnotherCustomerSelected(customer)}/>
            </div>


            {/*right section*/}
            <div className="flex-grow w-4/6 bg-white">


                <div className="items-center bg-white p-2.5 border-b flex justify-between">
                    <b>{d?.CustomerName}'s Info</b>

                    {/*status badge*/}
                    <Badge
                        size={"xl"}
                        color={`${d?.CustomerStatus === true ? "teal" : "red"}`}
                        radius={0}>{d?.CustomerStatus ? "Active" : "Inactive"}</Badge>

                    {/*close button*/}
                    <div className="ml-8">
                        <ActionIcon color={"red"} variant="filled" radius={100} onClick={onClose} size={"sm"}><XCircle/></ActionIcon>
                    </div>
                </div>

                {/*    card*/}
                <div className="bg-yellow-200">
                    <Card data={d} onDone={(fileUrl) => handleAvatarChangedDone(fileUrl)}/>
                </div>


                {/*tabs*/}
                <Tabs>
                    <Tabs.Tab label={<TabLabelWidget title="Details"/>}>
                        <OtherDetails data={d} onDone={(obj) => handleBasicInfoChangedDone(obj)}/>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Addresses"/>}>
                        <Addresses data={d} onDone={(obj) => handleBasicInfoChangedDone(obj)}/>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Contacts"/>}>
                        <ContactPersons data={d} onDone={(obj) => handleBasicInfoChangedDone(obj)}/>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Invoices"/>}>
                        <CustomerInvoices customerId={d?.CustomerId}/>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Orders"/>}>
                        <CustomerOrders customerId={d?.CustomerId}/>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Payments"/>}>
                        <CustomerPayments customerId={d?.CustomerId}/>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Receipts"/>}>
                        <CustomerReceipts customerId={d?.CustomerId}/>
                    </Tabs.Tab>
                </Tabs>


            </div>
        </div>
    </BasicRightDrawerUtils>
}

function EachCustomerCard({data}) {
    return <div className="flex items-center justify-between p-2">
        <div className="flex space-x-3">
            <div>
                <Avatar src={data?.CustomerAvatar}/>
            </div>
            <div className="flex flex-col space-y-0">
                <span className="text-gray-800 text-sm font-semibold">{data?.CustomerName}</span>
                <div className="flex items-center space-x-1 text-gray-500 text-sm font-medium">
                    <AtSign size={14}/>
                    <span>{data?.CustomerEmail}</span>
                </div>
            </div>
        </div>
        <div className="flex">
            <Badge
                color={`${data?.CustomerStatus === true ? "teal" : "red"}`}
                radius={0}>{data?.CustomerStatus ? "Active" : "Inactive"}</Badge>
        </div>
    </div>
}

function Card({data: v, onDone}) {
    return <div className="flex">
        {/*    avatar*/}
        <div>
            <CustomerInfoAvatar data={v} onDone={onDone}/>
        </div>
        <div className="flex flex-col space-y-1 items-center justify-center bg-green-200 p-2 flex-grow">
            <span className="font-semibold text-lg">Amount Spent</span>
            <div className="bg-green-300 opacity-75 p-2 rounded-lg">
                <span className="font-bold text-4xl">{MoneyFormat(v?.AmountSpent)}</span>
            </div>
        </div>
        <div className="flex space-y-1 flex-col items-center justify-center bg-red-200 p-2 flex-grow">
            <span className="font-semibold text-lg">Outstanding Balance</span>
            <div className="bg-red-400 opacity-75 p-2 rounded-lg">
                <span className="font-bold text-4xl">{MoneyFormat(v?.OutstandingBalance)}</span>
            </div>
        </div>
    </div>
}


function CustomerInvoices({customerId}) {
    const [data, setData] = useState([]);
    const [ajaxError] = useAjaxError();
    const history = useHistory();

    async function fetchData() {
        const result = await getAxios(`customer/get/invoices?status=&customerId=${customerId}`).catch(ajaxError);
        if (result) setData(result);
    }

    useEffect(() => {
        fetchData();
    }, [customerId]);

    if (data && data.length > 0) return <PrimeGridHelper data={data} dataKey={"InvoiceId"} header="Customer Invoices"
                                                         globalFilters={["OrderId", "InvoiceId", "CustomerName", "InvoiceStatus", "InvoiceDate"]}>
        <Column body={dateTpl} header="Date"/>
        <Column field="OrderId" header="Order#"/>
        <Column field="InvoiceId" header="Invoice#"/>
        <Column body={statusTpl} header="Status"/>
        <Column body={viewTpl} header="Action"/>
    </PrimeGridHelper>

    return <div>N/A</div>;

    function statusTpl(props) {
        return <BadgeWidget status={props?.InvoiceStatus}>{props?.InvoiceStatus}</BadgeWidget>
    }

    function dateTpl(props) {
        return <span>{formatDate(props?.InvoiceDate)}</span>
    }

    function viewTpl(props) {
        return <Button variant="white" size={"xs"}
                       onClick={() => history.push(SingleInvoiceUrl + props.InvoiceId)}>View</Button>
    }
}


function CustomerOrders({customerId}) {
    const [data, setData] = useState([]);
    const [ajaxError] = useAjaxError();
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState(null);

    async function fetchData() {
        const result = await getAxios(`customer/sales/orders?status=&customerId=${customerId}`).catch(ajaxError);
        if (result) setData(result);
    }

    useEffect(() => {
        fetchData();
    }, [customerId]);

    if (data && data.length > 0) return <div><PrimeGridHelper data={data} dataKey={"OrderId"} header="Customer Orders"
                                                              globalFilters={["OrderId", "ReferenceId", "CustomerName", "OrderStatus", "Dated"]}>
        <Column body={dateTpl} header="Date"/>
        <Column field="OrderId" header="Order#"/>
        <Column field="ReferenceId" header="Reference#"/>
        <Column body={statusTpl} header="Status"/>
        <Column body={viewTpl} header="Action"/>
    </PrimeGridHelper>

        {/*sales order details*/}
        <SalesOrderDetails open={open} onClose={() => setOpen(false)} object={order}/>

    </div>
    return <div>N/A</div>;

    function statusTpl(props) {
        return <BadgeWidget status={props?.OrderStatus}>{props?.OrderStatus}</BadgeWidget>
    }

    function dateTpl(props) {
        return <span>{formatDate(props?.Dated)}</span>
    }

    function viewTpl(props) {
        return <Button variant="white" size={"xs"} onClick={() => {
            setOrder(props);
            setOpen(true);
        }
        }>View</Button>
    }
}

function CustomerPayments({customerId}) {
    const [data, setData] = useState([]);
    const [ajaxError] = useAjaxError();
    const [selectedPaymentId, setSelectedPaymentId] = useState("");
    const [openPaymentInfoDrawer, setOpenPaymentInfoDrawer] = useState(false);

    async function fetchData() {
        const result = await getAxios(`payments/get/payments/by/customer?customerId=${customerId}`).catch(ajaxError);
        if (result) setData(result);
    }

    useEffect(() => {
        fetchData();
    }, [customerId]);

    if (data && data.length > 0) return <div><PrimeGridHelper data={data} dataKey={"PaymentId"}
                                                              header="Customer Payments"
                                                              globalFilters={["PaymentId", "CustomerName", "PaymentMethod", "Dated"]}>
        <Column body={dateTpl} header="Date"/>
        <Column field="PaymentId" header="Payment#"/>
        <Column field="PaymentMethod" header="PaymentMode"/>
        {/*<Column body={statusTpl} header="Status"/>*/}
        <Column body={viewTpl} header="Action"/>
    </PrimeGridHelper>

        {openPaymentInfoDrawer && <PaymentReceivedInfo
            open={openPaymentInfoDrawer}
            onClose={() => setOpenPaymentInfoDrawer(false)}
            paymentId={selectedPaymentId}/>}

    </div>
    return <div>N/A</div>;

    function statusTpl(props) {
        return <BadgeWidget status={props?.OrderStatus}>{props?.OrderStatus}</BadgeWidget>
    }

    function dateTpl(props) {
        return <span>{formatDate(props?.Dated)}</span>
    }

    function viewTpl(props) {
        return <Button variant="white" size={"xs"} onClick={() => {
            setOpenPaymentInfoDrawer(true);
            setSelectedPaymentId(props?.PaymentId);
        }
        }>View</Button>
    }
}


function CustomerReceipts({customerId}) {
    const [data, setData] = useState([]);
    const [ajaxError] = useAjaxError();
    const [selected, setSelected] = useState("");
    const [open, setOpen] = useState(false);

    async function fetchData() {
        const result = await getAxios(`get/receipts/by/customer?customerId=${customerId}`).catch(ajaxError);
        if (result) setData(result);
    }

    useEffect(() => {
        fetchData();
    }, [customerId]);

    if (data && data.length > 0) return <div><PrimeGridHelper data={data} dataKey={"PaymentId"}
                                                              header="Customer Receipts"
                                                              globalFilters={["PaymentId", "CustomerName", "PaymentMethod", "AmountReceived", "DepositAccount", "Dated"]}>
        <Column body={dateTpl} header="Date"/>
        <Column field="PaymentId" header="Payment#"/>
        <Column header="Amt Rcvd." field="AmountReceived"/>
        <ColumnDirective header="Deposit Account" field="DepositAccount"/>
        <Column field="PaymentMethod" header="Pmt. Mode"/>
        {/*<Column body={statusTpl} header="Status"/>*/}
        <Column body={viewTpl} header="Action"/>
    </PrimeGridHelper>

        {open && <ReceiptInfo
            open={open}
            onClose={() => setOpen(false)}
            selected={selected}/>}

    </div>
    return <div>N/A</div>;

    function dateTpl(props) {
        return <span>{formatDate(props?.Dated)}</span>
    }

    function viewTpl(props) {
        return <Button variant="white" size={"xs"} onClick={() => {
            setOpen(true);
            setSelected(props);
        }
        }>View</Button>
    }
}

//fetch other 15 customers
function FetchOtherCustomers({currentCustomer, onSelected}) {
    const [data, setData] = useState([]);
    const [ajaxError] = useAjaxError();

    async function fetchData() {
        const result = await getAxios(`customers/get/other/customers/in/customer/detail/view?customerId=${currentCustomer}&search=`).catch(ajaxError);
        if (result) setData(result);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const searchFn = useCallback(debounce((val) => {
        getAxios(`customers/get/other/customers/in/customer/detail/view?customerId=${currentCustomer}&search=${val}`).then((result) => {
            if (result) setData(result);
        }).catch(ajaxError);

    }, 500), [currentCustomer])

    async function handleSearch(val) {
        if (val) {
            searchFn(val)
        } else await fetchData();
    }

    return <div className="border-t border-t-4">
        <div
            className="bg-gray-200 p-2 text-sm text-gray-700 font-semibold flex items-center justify-between space-x-6">
            <div className="flex-grow">Few Other Customers</div>
            <div className="flex-grow">
                <TextInput
                    onChange={(e) => handleSearch(e.target.value)}
                    size={"xs"}
                    placeholder="Search..."
                    variant="filled"
                    radius={"xl"}
                />
            </div>
        </div>
        <ScrollArea style={{
            height: window.innerHeight - 160
        }}>
            {data && data.map((v, i) => <div onClick={() => onSelected(v?.CustomerId)}
                                             className="hover:bg-gray-100 cursor-pointer" key={v?.CustomerId}>
                <EachCustomerCard data={v}/></div>)}
        </ScrollArea>
    </div>
}