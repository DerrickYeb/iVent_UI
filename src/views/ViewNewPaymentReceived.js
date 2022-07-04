import SideMenu from "../Helpers/SideMenu";
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
    Avatar, Badge,
    Textarea,
    Checkbox
} from '@mantine/core';
import React, {useEffect, useState} from "react";
import useSWR from 'swr';
import {
    useFetchLovCustomersList,
    useFetchLovPaymentAccounts,
    useFetchLovPaymentMethods
} from "../Hooks/SWRHooks/useLovHooks";
import {
    MoneyFormat,
    PaymentPrefix,
    InvoiceStatus, formatDate
} from '../Helpers/Constants'
import {v4 as uuidv4} from 'uuid';
import {DatePicker} from '@mantine/dates';
import {useDidUpdate} from '@mantine/hooks';
import {getAxios, postAxios} from "../Helpers/API";
import useAjaxError from "../Helpers/useAjaxError";
import {CircleX, FileInvoice, Plus} from 'tabler-icons-react';
import {useRecoilState} from "recoil";
import {PaymentsReceivedStore} from "../Store/Store";
import {PaymentsReceivedUrl} from "../Helpers/UrlHelper";
import {BasicRightDrawerUtils} from "../modals/ModalUtils";
import AvatarImg from '../images/avatar.png';
import TabLabelWidget from "../Widgets/TabLabelWidget";
import MantineTableHelper from "../Helpers/MantineTableHelper";
import NewPaymentAttachFiles from "../components/PaymentsPartial/NewPaymentAttachFiles";
import useToasts from "../Helpers/MyToasts";
import SalesOrderSvg from "../Svgicons/SalesOrderSvg";
import PartialHeader from "../Helpers/PartialHeader";
import CustomerDetails from "../components/Customers/CustomerDetails";

function TableHead() {
    return <tr>
        <th>Date</th>
        <th>Invoice #</th>
        <th>Order #</th>
        <th>Invoice Amount</th>
        <th>Amount Due</th>
    </tr>
}

export default function ViewNewPaymentReceived(props) {
    const [data, setData] = useRecoilState(PaymentsReceivedStore);
    const [isWorking, setIsWorking] = useState(false);
    const [isLoadingCustomerDetails, setIsLoadingCustomerDetails] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openCollapse, setOpenCollapse] = useState(false);
    const [openCustomerDetailsDrawer, setOpenCustomerDetailsDrawer] = useState(false);
    const [paymentId, setPaymentId] = useState("");
    const [customerId, setCustomerId] = useState("");
    //const [invoiceId, setInvoiceId] = useState("");
    const [paymentDate, setPaymentDate] = useState(new Date());
    const [note, setNote] = useState("");
    const [invoiceList, setInvoiceList] = useState([]); // list of sent/pending invoices so accountant
    const [customerDetails, setCustomerDetails] = useState(null);
    const [paymentAmt, setPaymentAmt] = useState(0.00);
    const [changeAmt, setChangeAmt] = useState(0.00);
    const [invoiceTotal, setInvoiceTotal] = useState(0.00);
    const [outstanding, setOutstanding] = useState(0.00);
    const [paymentMethodId, setPaymentMethodId] = useState("");
    const [depositToId, setDepositToId] = useState("");
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [sendThanksNote, setSendThanksNote] = useState(true);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();

    const history = useHistory();


    useEffect(() => {
        const genPmtId = PaymentPrefix + "-" + uuidv4().split("-")[0].toUpperCase();
        setPaymentId(genPmtId);
    }, []);

    useEffect(() => {
        if (invoiceList.length === 0) return;
        let output = 0;
        for (let v of invoiceList) {
            let final = v?.Invoices?.OrderTotalAmt - (v?.Invoices?.OrderTotalAmt * v?.Invoices?.OrderTotalDiscount) / 100
            output += final;
        }
        setInvoiceTotal(output);
    }, [invoiceList]);

    useEffect(() => {
        if (parseFloat(paymentAmt) > parseFloat(invoiceTotal)) {
            setChangeAmt(parseFloat(paymentAmt - invoiceTotal));
        } else setChangeAmt(0.00);
        if (parseFloat(paymentAmt) < parseFloat(invoiceTotal)) {
            setOutstanding(parseFloat(invoiceTotal - paymentAmt))
        }
    }, [paymentAmt, invoiceTotal]);


    async function fetchCustomerDetails() {
        setIsLoadingCustomerDetails(true);
        const result = await getAxios(`customers/get/customer?customerId=${customerId}`).catch(ajaxError).finally(() => {
            setIsLoadingCustomerDetails(false);
        });
        if (result) setCustomerDetails(result);
    }

    async function fetchCustomerInvoices() {
        let payload = {
            Status: [InvoiceStatus.Sent, InvoiceStatus.Pending, InvoiceStatus.Unsent],
            CustomerId: customerId
        }
        const result = await postAxios(`get/customer/invoices/for/payment`, payload).catch(ajaxError)
        if (result && Array.isArray(result) && result.length > 0){
            setInvoiceList(result)
        } else{
            toast("No invoices found for this customer. It is either this customer has invoices partially paid or not having invoices at all")
        };
    }


    useDidUpdate(() => {
        if (!customerId) return;
        fetchCustomerDetails();
        fetchCustomerInvoices();
    }, [customerId])


    const {data: customersList, error: err} = useFetchLovCustomersList();
    const {data: paymentModesList, error: pmError} = useFetchLovPaymentMethods();
    const {data: paymentAccounts} = useFetchLovPaymentAccounts();

    async function handleFetchCustomerDetails() {
        setOpenDrawer(true);
    }


    const mapInvoiceList = invoiceList && invoiceList.map((row, _) => (
        <tr key={row.Key}>
            <td>{formatDate(row?.Invoices?.InvoiceDate)}</td>
            <td>{row?.Invoices?.InvoiceId}</td>
            <td>{row?.Invoices?.OrderId}</td>
            <td>{MoneyFormat(row?.Invoices?.OrderTotalAmt)}</td>
            <td>{MoneyFormat(row?.Invoices?.OrderTotalAmt - (row?.Invoices?.OrderTotalAmt * row?.Invoices?.OrderTotalDiscount) / 100)}
                <Badge color="green" size={"xs"} variant={"dot"}>{row?.Invoices?.OrderTotalDiscount} %</Badge></td>
        </tr>
    ))


    return <SideMenu>
        <div className="flex items-center justify-between p-2 bg-white">
            <PartialHeader title="Record Payment" icon={<SalesOrderSvg/>}/>
        </div>

        <div className="w-full pt-4 border-gray-200 bg-white">
            <div className="w-full bg-gray-50 flex items-center justify-center">
                <div className="w-2/4 p-4">
                    <Select required={true} data={customersList || []} placeholder="Select a customer"
                            label="Select a customer"
                            value={customerId}
                            onChange={(e) => setCustomerId(e)}
                            clearable={true} variant="default" searchable={true}/>
                    {customerId && <Button
                        variant={"subtle"}
                        size={"xs"}
                        loading={isLoadingCustomerDetails}
                        onClick={() => handleFetchCustomerDetails()}

                        leftIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                       viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>}>View Customer Details</Button>}

                    {/*    billing and shipping details */}
                    {customerId && <div className="grid gap-14 grid-cols-2 mt-4">
                        <div>
                            <div className="uppercase mb-2 text-gray-600">
                                Billing Address
                            </div>
                            {customerDetails?.BillingAddress ?
                                <div className="grid gap-1 grid-cols-2 text-xs text-gray-500">
                                    <span>Country</span>
                                    <span>{customerDetails?.BillingAddress?.Country}</span>

                                    <span>City</span>
                                    <span>{customerDetails?.BillingAddress?.City}</span>

                                    <span>State</span>
                                    <span>{customerDetails?.BillingAddress?.State}</span>

                                    <span>Address One</span>
                                    <span>{customerDetails?.BillingAddress?.AddressOne}</span>

                                    <span>Zip Code</span>
                                    <span>{customerDetails?.BillingAddress?.ZipCode}</span>
                                </div> : <div>Not Available</div>}
                        </div>

                        <div>
                            <div className="uppercase mb-2 text-gray-600">
                                Shipping Address
                            </div>
                            {customerDetails?.BillingAddress ?
                                <div className="grid gap-1 grid-cols-2 text-xs text-gray-500">
                                    <span>Country</span>
                                    <span>{customerDetails?.ShippingAddress?.Country}</span>

                                    <span>City</span>
                                    <span>{customerDetails?.ShippingAddress?.City}</span>

                                    <span>State</span>
                                    <span>{customerDetails?.ShippingAddress?.State}</span>

                                    <span>Address One</span>
                                    <span>{customerDetails?.ShippingAddress?.AddressOne}</span>

                                    <span>Zip Code</span>
                                    <span>{customerDetails?.ShippingAddress?.ZipCode}</span>
                                </div> : <div>Not available</div>}
                        </div>
                    </div>}
                </div>
            </div>


            <div className="grid gap-6 grid-cols-2 mt-4 p-4 w-3/4 mx-auto">
                <div>
                    <NumberInput
                        value={paymentAmt}
                        onChange={(e) => setPaymentAmt(e)}
                        required={true}
                        label="Amount Received"
                        placeholder="Amount Received"
                        //icon="GHS"
                        parser={(value) => value.replace(/\GHS\s?|(,*)/g, '')}
                        formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                                ? `GHS ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                : 'GHS '
                        }
                    />
                </div>


                <div>
                    <DatePicker value={paymentDate} onChange={(e) => setPaymentDate(e)} label="Payment Date"
                                required={true}
                                placeholder="Payment date"/>
                </div>


                <div>
                    <TextInput
                        value={paymentId}
                        variant={"filled"}
                        required={true}
                        label="Payment#"
                        placeholder="Payment#" readOnly={true}/>
                </div>

                <div>
                    <Select required={true} data={paymentModesList || []} placeholder="Payment Mode"
                            label="Payment Mode" clearable={true} searchable={true} value={paymentMethodId}
                            onChange={(e) => setPaymentMethodId(e)}/>
                </div>

                <div>
                    <Select required={true} data={paymentAccounts || []} placeholder="Deposit To"
                            label="Deposit To" clearable={true} searchable={true} value={depositToId}
                            onChange={(e) => setDepositToId(e)}/>
                </div>


            </div>


            {/*    customer invoices list*/}
            <div className="mt-4 p-4">
                <div className="mb-1 text-xl text-gray-700 font-semibold pl-2 pb-2 border-b">
                    Unpaid Invoices
                </div>
                {invoiceList && invoiceList.length > 0 ?
                    <MantineTableHelper head={<TableHead/>} rows={mapInvoiceList} height={150}/> :
                    <div
                        className="w-2/4 mx-auto p-6 flex flex-col space-y-4 items-center text-gray-500 justify-center">
                        <FileInvoice size={60}/>
                        <span>Select a customer at the top to view unpaid invoices.</span>
                    </div>}

                {/*    notice*/}
                <div className="text-sm text-gray-500 border-t">
                    <span>**List contains only UNPAID invoices</span>
                </div>
            </div>


            {/*    summary total / notes*/}
            <div className="flex justify-between items-center p-4">

                {/*notes*/}
                <Textarea
                    value={note}
                    onChange={(e) => setNote(e.currentTarget.value)}
                    label="Notes (Internal use. Not visible to customer)"
                    placeholder={"Notes (Internal use. Not visible to customer)"}/>

                <div>
                    <div>Total: {MoneyFormat(invoiceTotal)}</div>
                    <div
                        className="bg-yellow-100 py-4 px-10 mt-2 flex space-y-4 flex-col rounded-lg border border-dotted">
                        {/*amount received/paid*/}
                        <div className="flex items-center space-x-4">
                            <span>Amount Received:</span>
                            <span>{MoneyFormat(paymentAmt)}</span>
                        </div>

                        {/*amount outstanding*/}
                        <div className="flex items-center space-x-4">
                            <span>Outstanding Balance:</span>
                            <span>{MoneyFormat(outstanding)}</span>
                        </div>

                        {/*    change to give*/}
                        <div className="flex items-center space-x-4">
                            <span>Amount In Excess:</span>
                            <span>{MoneyFormat(changeAmt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/*    attach files*/}
            <div className="p-4 border-t">
                <NewPaymentAttachFiles
                    data={attachedFiles}
                    onDone={(file) => setAttachedFiles((prev) => [file, ...prev])}
                    onRemove={(file) => setAttachedFiles((prev) => prev.filter((x) => x !== file))}
                />
            </div>


            {/*    send thank you note prompt*/}
            <div className="p-4 border-t flex flex-col space-y-2">
                <Checkbox
                    label="Email a 'thank you' note for this payment"
                    checked={sendThanksNote}
                    size={"xs"}
                    onChange={(checked) => setSendThanksNote(checked.currentTarget.checked)}
                />
                <div className="bg-gray-50 p-2 w-48">
                    {customerDetails?.CustomerEmail ? <Checkbox
                        label={customerDetails?.CustomerEmail}
                        checked={sendThanksNote}
                        color={"gray"}
                        size={"xs"}
                    /> : <span>No email available</span>}
                </div>
            </div>


        </div>


        {/*    side drawer*/}
        <BasicRightDrawerUtils open={openDrawer} onClose={() => setOpenDrawer(false)}
                               title={<span>Customer Details</span>}>
            <div className="bg-white">
                {/*top*/}
                <div className="flex items-center justify-between p-4">
                    <span className="font-semibold text-black">Customer Details</span>
                    <ActionIcon
                        color="red"
                        radius={100}
                        variant={"filled"}
                        onClick={() => setOpenDrawer(false)}><CircleX/></ActionIcon>
                </div>

                {/*    avatar and name*/}
                <div className="flex items-center space-x-4 p-4 bg-gray-100">
                    <div className="shadow-md rounded-full">
                        <img src={customerDetails?.CustomerAvatar || AvatarImg} className="h-16 w-16 object-cover" alt={""}/>
                    </div>
                    <div className="flex flex-col truncate ...">
                        <span
                            className="font-semibold text-black">{customerDetails?.Salutation}{customerDetails?.CustomerName}</span>
                        <span className="text-xs font-semibold text-gray-500">{customerDetails?.CustomerEmail}</span>
                    </div>
                    <div>
                        <ActionIcon
                            onClick={() => setOpenCustomerDetailsDrawer(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path
                                    d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                <path
                                    d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                            </svg>
                        </ActionIcon>
                    </div>
                </div>

                {/*    credit balance*/}
                <div className="flex items-center justify-center flex-col mt-6 space-y-2">
                    <span className="text-gray-500">Amount Spent</span>
                    <span
                        className="text-semibold text-xl">{MoneyFormat(customerDetails?.AmountSpent)}</span>
                </div>


                {/*    other details*/}
                <div className="mt-4 p-4">
                    <Button variant={"white"}
                            onClick={() => setOpenCollapse((v) => !v)}
                            rightIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                            </svg>}>Other Details</Button>

                    <Collapse in={openCollapse}>
                        <div className="grid gap-6 grid-cols-1 mt-4">
                            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                                <span>Phone No</span>
                                <span className="font-semibold">{customerDetails?.CustomerPhone}</span>
                            </div>

                            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                                <span>Email Address</span>
                                <span className="font-semibold">{customerDetails?.CustomerEmail}</span>
                            </div>

                            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                                <span>Company</span>
                                <span className="font-semibold">{customerDetails?.CompanyName}</span>
                            </div>

                            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                                <span>Department</span>
                                <span className="font-semibold">{customerDetails?.CustomerDepartment}</span>
                            </div>

                            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                                <span>Designation</span>
                                <span className="font-semibold">{customerDetails?.CustomerDesignation}</span>
                            </div>

                            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                                <span>Payment Terms</span>
                                <span className="font-semibold">{customerDetails?.PaymentTerms}</span>
                            </div>

                        </div>
                    </Collapse>


                </div>


                {/*    tabs*/}

                <Tabs>
                    <Tabs.Tab label={<TabLabelWidget title="Address"/>}>
                        <ScrollArea style={{height: 300, paddingBottom: 20}}>
                            <div className="p-4 overflow-auto">
                                {/*billing address*/}
                                <div className="uppercase mb-2">
                                    Billing Address
                                </div>
                                <div className="grid gap-2 grid-cols-2 text-xs text-gray-500">
                                    <span>Country</span>
                                    <span>{customerDetails?.BillingAddress?.Country}</span>

                                    <span>City</span>
                                    <span>{customerDetails?.BillingAddress?.City}</span>

                                    <span>State</span>
                                    <span>{customerDetails?.BillingAddress?.State}</span>

                                    <span>Address One</span>
                                    <span>{customerDetails?.BillingAddress?.AddressOne}</span>

                                    <span>Zip Code</span>
                                    <span>{customerDetails?.BillingAddress?.ZipCode}</span>
                                </div>

                                {/*    shipping address*/}

                                <div className="uppercase mt-6 mb-2">
                                    Shipping Address
                                </div>
                                <div className="grid gap-2 grid-cols-2 text-xs text-gray-500">
                                    <span>Country</span>
                                    <span>{customerDetails?.ShippingAddress?.Country}</span>

                                    <span>City</span>
                                    <span>{customerDetails?.ShippingAddress?.City}</span>

                                    <span>State</span>
                                    <span>{customerDetails?.ShippingAddress?.State}</span>

                                    <span>Address One</span>
                                    <span>{customerDetails?.ShippingAddress?.AddressOne}</span>

                                    <span>Zip Code</span>
                                    <span>{customerDetails?.ShippingAddress?.ZipCode}</span>
                                </div>

                            </div>
                        </ScrollArea>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Contact Persons"/>}>
                        <ScrollArea style={{height: 300, paddingBottom: 20}}>
                            <div className="p-4">
                                {customerDetails && customerDetails.ContactPersons.map((v, i) => <div
                                    className="flex space-x-4 mb-4">
                                    <div>
                                        <Avatar size={"lg"} radius={"xl"}/>
                                    </div>
                                    <div className="flex flex-col">
                                        <span
                                            className="font-semibold text-base">{v?.Salutation}&nbsp;{v?.Fullname}</span>
                                        <span className="text-gray-600 text-xs">{v?.EmailAddress}</span>
                                        <span className="text-gray-600 text-xs"><svg xmlns="http://www.w3.org/2000/svg"
                                                                                     className="h-3 w-3 inline"
                                                                                     fill="none"
                                                                                     viewBox="0 0 24 24"
                                                                                     stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
</svg>
                                            {v?.PhoneNo}</span>
                                    </div>
                                </div>)}
                            </div>
                        </ScrollArea>
                    </Tabs.Tab>

                </Tabs>


            </div>
        </BasicRightDrawerUtils>


        {/*customer details*/}
        {openCustomerDetailsDrawer &&
        <CustomerDetails open={openCustomerDetailsDrawer} onClose={() => setOpenCustomerDetailsDrawer(false)}
                         object={customerDetails}/>}

        {/*    bottom save button bar*/}
        <div className="sticky bottom-0 left-0 p-2 mt-4 bg-gray-200 shadow-lg flex items-center justify-end space-x-4">
            <Button variant="white" onClick={()=> history.goBack()}>Cancel</Button>
            <Button disabled={invoiceList.length === 0} color={"teal"} onClick={() => savePayment()} loading={isWorking}>Save</Button>
        </div>
    </SideMenu>


    async function savePayment() {
        //validations
        if(!paymentId) return toast("Cannot get payment Id");
        if(!paymentAmt) return toast("Please enter an amount to pay");
        if(isNaN(paymentAmt)) return toast("Amount to pay must be numbers");
        if(!depositToId) return toast("Please select deposit account");
        if(!paymentMethodId) return toast("Please select payment mode");
        if(invoiceList.length === 0) return toast("No invoices to make payment for");


        //get orders
        const orderIds = [];
        for (let v of invoiceList) {
            orderIds.push(v?.Key);
        }

        let payload = {
            PaymentId: paymentId,
            PaymentMethodId: paymentMethodId,
            PaymentAmount: invoiceTotal,
            DepositToId: depositToId,
            Note: note,
            Change: changeAmt,
            AmountReceived: paymentAmt,
            PreviousBalance: outstanding,
            PaymentDate: paymentDate,
            CustomerId: customerId,
            AttachedFiles: attachedFiles,
            CustomerEmail: customerDetails?.CustomerEmail,
            SendThanksNote: sendThanksNote,
            OrderIds: orderIds
        }
        setIsWorking(true);
        const result = await postAxios("payments/new/payment", payload).catch(ajaxError).finally(() => setIsWorking(false));
        if (result) {
            toast("Payment recorded successfully", "success")
            toast("Redirecting... Please wait", "success")
            setData((prev) => [result, ...prev]);
            setTimeout(()=>{
                history.push(PaymentsReceivedUrl);
            }, 2500);

        }
    }
}