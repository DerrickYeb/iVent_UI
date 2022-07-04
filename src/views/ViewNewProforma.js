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
import {TextField} from "@material-ui/core";
import PartialHeader from "../Helpers/PartialHeader";
import React, {useEffect, useState} from "react";
import SideMenu from "../Helpers/SideMenu";
import SalesOrderSvg from "../Svgicons/SalesOrderSvg";
import useSWR from 'swr';
import {useFetchLovCustomersList, useFetchLovStocksList} from "../Hooks/SWRHooks/useLovHooks";
import {OrderReminderPeriod, OrderPaymentPeriod, Prefix, MoneyFormat, RefPrefix} from '../Helpers/Constants'
import {v4 as uuidv4} from 'uuid';
import {DatePicker} from '@mantine/dates';
import {useDidUpdate} from '@mantine/hooks';
import {getAxios, postAxios} from "../Helpers/API";
import useAjaxError from "../Helpers/useAjaxError";
import {cloneDeep} from "lodash";
import {XCircle} from 'react-feather';
import {useRecoilState} from "recoil";
import {ProformasListStore} from "../Store/Store";
import {ProformaUrl, SalesOrdersUrl} from "../Helpers/UrlHelper";
import {BasicRightDrawerUtils} from "../modals/ModalUtils";
import AvatarImg from '../images/avatar.png';
import TabLabelWidget from "../Widgets/TabLabelWidget";


const pObj = {
    ProductId: "",
    BatchNo: "",
    ProductName: "",
    Quantity: "",
    QuantityAtHand: "",
    SellingPrice: 0,
    TaxId: "",
    TaxRate: "",
    DiscountType: "",
    Discount: 0.00,
    Amount: 0,
}

export default function ViewNewProforma() {
    const [data, setData] = useRecoilState(ProformasListStore);
    const [isWorking, setIsWorking] = useState(false);
    const [isLoadingCustomerDetails, setIsLoadingCustomerDetails] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openCollapse, setOpenCollapse] = useState(false);
    const [customerId, setCustomerId] = useState("");
    const [orderId, setOrderId] = useState("");
    const [referenceId, setReferenceId] = useState("");
    const [orderDate, setOrderDate] = useState(new Date());
    const [shipmentDate, setShipmentDate] = useState(new Date());
    const [note, setNote] = useState("");
    const [reminderPeriod, setReminderPeriod] = useState("");
    const [paymentPeriod, setPaymentPeriod] = useState("");
    const [products, setProducts] = useState([]); //
    const [selectedItem, setSelectedItem] = useState("");
    const [total, setTotal] = useState(0.00);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [ajaxError] = useAjaxError();

    const cloneArr = cloneDeep(products);
    const history = useHistory();

    useEffect(() => {
        const genOrderId = Prefix + "-" + uuidv4().split("-")[0].toUpperCase();
        const genRefId = RefPrefix + "-" + uuidv4().split("-")[0].toUpperCase();
        setOrderId(genOrderId);
        setReferenceId(genRefId);
    }, []);

    useEffect(() => {
        if (products.length === 0) return;
        let output = 0;
        for (let v of products) {
            let discount = (v?.SellingPrice * v?.Quantity) * v?.Discount / 100;
            let final = (v?.SellingPrice * v?.Quantity) - discount
            output += final;
        }
        setTotal(output);
    }, [products]);

    async function fetchCustomerDetails() {
        setIsLoadingCustomerDetails(true);
        const result = await getAxios(`customers/get/customer?customerId=${customerId}`).catch(ajaxError).finally(() => {
            setIsLoadingCustomerDetails(false);
        });
        if (result) setCustomerDetails(result);
    }

    useDidUpdate(() => {
        if (!customerId) return;
        fetchCustomerDetails();
    }, [customerId])

    async function handleSelectedItem(e) {
        setSelectedItem(e);
        if (!e) return;
        const result = await getAxios(`stocks/get/basic/stock?stockId=${e}`).catch(ajaxError);
        if (result) {
            pObj.ProductId = result?.ProductId;
            pObj.ProductName = result?.ProductName;
            pObj.BatchNo = result?.ProductSKU;
            pObj.Quantity = 1;
            pObj.Discount = 0.00;
            pObj.QuantityAtHand = result?.ProductOpeningStockQty;
            pObj.SellingPrice = result?.ProductSellingPrice;
            cloneArr.push(pObj)
            setProducts(cloneArr);
        }
        setSelectedItem("");
    }


    const {data: customersList, error: err} = useFetchLovCustomersList();
    const {data: stocksLov, error} = useFetchLovStocksList();

    function renderAmount(sellingPrice, quantity, discountRate) {
        if (isNaN(quantity)) quantity = 1;
        if (parseFloat(quantity) === 0) quantity = 1;
        if (parseFloat(quantity) < 1) quantity = 1;
        if (isNaN(discountRate)) discountRate = parseFloat(0.00);
        if (parseFloat(discountRate) > 100) discountRate = parseFloat(0.00);
        let discount = (sellingPrice * quantity) * discountRate / 100;
        return (sellingPrice * quantity) - discount;
    }

    const rows = products.map((element, index) => (
        <tr key={element.ProductId}>
            <td>
                <div className="flex flex-col">
                    <span>{element?.ProductName}</span>
                    <span className="text-gray-500 text-xs font-medium">Batch No: {element?.BatchNo}</span>
                </div>
            </td>
            <td>
                <div className="w-32 flex flex-col">
                    <NumberInput variant={"default"} size={"xs"} value={element?.Quantity} onChange={(e) => {
                        cloneArr[index].Quantity = (parseFloat(e) < 1) ? 1 : isNaN(e) ? 1 : e;
                        setProducts(cloneArr);
                    }}/>
                    <span className="text-gray-500 text-xs font-medium">Stocks at hand: {element?.QuantityAtHand}</span>
                </div>
            </td>
            <td>
                <div className="w-24 flex flex-col">
                    <TextInput icon={"%"} variant={"default"} size={"xs"} value={element?.Discount} onChange={(e) => {
                        cloneArr[index].Discount = e.target.value;
                        setProducts(cloneArr);
                    }}/>
                </div>
            </td>
            <td><b>{MoneyFormat(renderAmount(element?.SellingPrice, element?.Quantity, element?.Discount))}</b>
            </td>
            <td className="w-20">
                <Tooltip
                    label={"Click to remove"}
                    withArrow={true}
                    color={"red"}><ActionIcon
                    onClick={() => handleOnRemove(element.ProductId, index)}
                    color={"red"} size={"xs"}
                    radius={"xl"}><XCircle/></ActionIcon></Tooltip>
            </td>
        </tr>
    ));

    function handleOnRemove(productId, index) {
        const arr = cloneArr.filter((x) => x.ProductId !== productId);
        if (arr) setProducts(arr);
    }

    async function handleFetchCustomerDetails() {
        setOpenDrawer(true);
    }

    return <SideMenu title="New Proforma">
        <PartialHeader title="New Proforma" icon={<div className="p-1.5 rounded-full bg-green-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
        </div>}/>


        <div className="w-full border-t border-gray-200 bg-white">

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
                    <TextInput value={orderId} onChange={(e) => setOrderId(e.target.value)} required={true}
                               label="Proforma#" placeholder="Proforma#"/>
                </div>
                <div>
                    <TextInput value={referenceId} onChange={(e) => setReferenceId(e.target.value)} required={true}
                               label="Reference#" placeholder="Reference#"/>
                </div>
                <div>
                    <DatePicker value={orderDate} onChange={(e) => setOrderDate(e)} label="Proforma Generation Date" required={true}
                                placeholder="Proforma Generation Date"/>
                </div>
                {/*<div>*/}
                {/*    <DatePicker value={shipmentDate} onChange={(e) => setShipmentDate(e)} label="Expected Shipment Date"*/}
                {/*                required={true} placeholder="Expected shipment date"/>*/}
                {/*</div>*/}
                <div>
                    <Select required={true} data={OrderReminderPeriod || []} placeholder="Reminder period"
                            label="Reminder period" clearable={true} searchable={true} value={reminderPeriod}
                            onChange={(e) => setReminderPeriod(e)}/>
                </div>
                {/*<div>*/}
                {/*    <Select required={true} data={OrderPaymentPeriod || []} placeholder="Payment period"*/}
                {/*            label="Payment period" clearable={true} searchable={true} value={paymentPeriod}*/}
                {/*            onChange={(e) => setPaymentPeriod(e)}/>*/}
                {/*</div>*/}
            </div>

            {/*divider div*/}
            <div>
                <Divider/>
            </div>
            {/*    products grid/table*/}
            <Table captionSide="bottom">
                <caption>
                    <div className="p-4 bg-white w-2/4"><Select data={stocksLov || []}
                                                                placeholder="Type or click to select an item"
                                                                variant="filled"
                                                                clearable={true} searchable={true} value={selectedItem}
                                                                onChange={(e) => handleSelectedItem(e)}/></div>

                </caption>
                <thead>
                <tr>
                    <th>STOCK DETAILS</th>
                    <th>QUANTITY</th>
                    <th>DISCOUNT</th>
                    {/*<th>TAX</th>*/}
                    <th>AMOUNT</th>
                    <th>ACTION</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>


            {/*    customer notes and total*/}
            <div className="grid gap-4 grid-cols-2 p-4 mb-20">
                <div>
                    <TextField
                        variant={"outlined"}
                        fullWidth={true}
                        multiline={true}
                        minRows={2}
                        maxRows={5}
                        value={note}
                        onChange={(e) => setNote(e.target.value)} color={"primary"} label="Customer notes"
                        placeholder="Enter any note you want to show in the transaction."/>
                </div>
                <div
                    className="w-full bg-gray-200 flex items-center p-4 justify-end rounded text-xl font-semibold text-black">
                    <span>Total: {MoneyFormat(total || 0.00)}</span>
                </div>
            </div>
        </div>

        {/*    save bottom bar*/}
        <div
            className="fixed w-full bottom-0 left-0 justify-end items-center flex p-4 bg-white shadow-2xl shadow-inner z-50">

            <div>
                <Button loading={isWorking} onClick={() => handleSave()}>Save</Button>
            </div>
        </div>


        {/*    side drawer*/}
        <BasicRightDrawerUtils open={openDrawer} onClose={() => setOpenDrawer(false)}
                               title={<span>Customer Details</span>}>
            <div className="bg-white">
                {/*top*/}
                <div className="flex items-center justify-between p-4">
                    <span className="font-semibold text-black">Customer Details</span>
                    <ActionIcon onClick={() => setOpenDrawer(false)}><XCircle/></ActionIcon>
                </div>

                {/*    avatar and name*/}
                <div className="flex items-center space-x-4 p-4 bg-gray-100">
                    <div className="shadow-md rounded-full">
                        <img src={AvatarImg} className="h-16 w-16 object-cover" alt={""}/>
                    </div>
                    <div className="flex flex-col truncate ...">
                        <span
                            className="font-semibold text-black">{customerDetails?.Salutation}{customerDetails?.CustomerName}</span>
                        <span className="text-xs font-semibold text-gray-500">{customerDetails?.CustomerEmail}</span>
                    </div>
                    <div>
                        <ActionIcon>
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
                    <span className="text-gray-500">Unused Credits</span>
                    <span
                        className="text-semibold text-xl">{MoneyFormat(customerDetails?.Balances?.UnusedCredits)}</span>
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
    </SideMenu>

    async function handleSave() {
        setIsWorking(true);
        let payload = {
            OrderId: orderId,
            ReferenceId: referenceId,
            CustomerId: customerId,
            ReminderPeriod: reminderPeriod,
            PaymentPeriod: paymentPeriod,
            Note: note,
            OrderDate: orderDate,
            ExpectedShipmentDate: shipmentDate,
            Stocks: products
        }
        const result = await postAxios('proforma/new/proforma', payload).catch(ajaxError).finally(() => {
            setIsWorking(false)
        });
        if (result) {
            let d = data.push(result);
            setData(d);
            history.push(ProformaUrl);
        }
    }
}