import SideMenu from "../Helpers/SideMenu";
import PartialHeader from "../Helpers/PartialHeader";
import React, {useEffect, useState} from "react";
import {Tabs, Button, Divider, Loader, Menu, Tooltip, TextInput, Textarea} from "@mantine/core";
import {NewInvoiceUrl, NewSalesOrderUrl} from "../Helpers/UrlHelper";
import {ChevronDown, Eye, FileText, Plus, Mail} from "react-feather";
import {useHistory} from "react-router-dom";
import {downloadAsPdf, InvoiceStatus, InvoiceStatusArr} from "../Helpers/Constants";
import useAjaxError from "../Helpers/useAjaxError";
import {getAxios} from "../Helpers/API";
import useSWR from "swr";
import InvoiceWidget from "../Widgets/InvoiceWidget";
import SalesOrderDetails from "../components/SalesOrders/SalesOrderDetails";
import {useReactToPrint} from 'react-to-print';
import useToasts from "../Helpers/MyToasts";
import dompurify from 'dompurify'
import TabLabelWidget from "../Widgets/TabLabelWidget";
import InvoiceHistory from "../components/InvoicePartials/InvoiceHistory";
import {CircleCheck, SquareCheck, Check, Checks} from 'tabler-icons-react';


export default function ViewSingleInvoice(props) {
    const [id, setId] = useState(props.match.params.id);
    const [mailSubject, setMailSubject] = useState(`invoice for #${id}`);
    const [mailBody, setMailBody] = useState("");
    const [isWorking, setIsWorking] = useState(false);
    const [ajaxError] = useAjaxError();
    const history = useHistory();

    if (id !== props.match.params.id) {
        setId(props.match.params.id);
    }

    const {
        data: inv,
        mutate: invMutate,
        error: invError
    } = useSWR(id ? `get/invoice?invoiceId=${id}` : null, getAxios);

    const {
        data: ord,
        mutate: orderMutate,
        error: orderError
    } = useSWR(inv?.OrderId ? `sales/orders/get/order?orderId=${inv?.OrderId}` : null, getAxios);


    return <SideMenu title={"Invoice for"}>
        <PartialHeader title={"Invoice #" + id} icon={<div className="p-1.5 rounded-full bg-green-50">
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
                    <Button onClick={() => history.goBack()} variant="white" leftIcon={<Plus/>}
                            size={"xs"}>Back</Button>
                </div>
                <div>
                    <Button onClick={() => history.push(NewInvoiceUrl)} className="bg-green-500" leftIcon={<Plus/>}
                            size={"xs"}>New</Button>
                </div>
            </div>
        </div>

        {/*    main invoice body section*/}
        <div className="p-4">
            <div className="flex justify-between space-x-12">
                {/*    invoice template body*/}
                <div className="flex-grow w-3/5 p-4 bg-white border shadow rounded-lg">
                    {ord ? <InvoiceWidget
                        invoice={inv}
                        order={ord}
                        totalDiscount={ord?.OrderTotalDiscount}
                        totalAmount={ord?.OrderTotalAmt}/> : null}

                </div>

                {/*    invoice actions section*/}
                <div className="flex-grow w-2/5">
                    <div className="sticky top-24 bg-white border shadow rounded-lg">
                        {/*status comp*/}
                        <InvoiceStatusComp order={ord} inv={inv}/>
                        <Tabs>
                            <Tabs.Tab label={<TabLabelWidget title={"Actions"}/> }>
                                {/*    action buttons*/}
                                <div className="grid gap-0 grid-cols-3 p-2">
                                    {/*<div>*/}
                                    {/*    <InvoiceMoreMenu order={ord} inv={inv}/>*/}
                                    {/*</div>*/}
                                    <div>
                                        <DownloadInvoiceAsPdf order={ord} inv={inv}/>
                                    </div>
                                    <div>
                                        <PrintInvoice order={ord} inv={inv}/>
                                    </div>
                                    <div>
                                        <ViewInvoiceOrder order={ord} inv={inv}/>
                                    </div>
                                </div>


                                {/*issued by*/}
                                <div className="p-4 border-t">
                                    Issued by: {inv?.Fullname}
                                </div>


                                {/*  send  mail section*/}
                                {inv?.InvoiceStatus === InvoiceStatus.Pending ? <div className="grid gap-4 grid-cols-1 p-4 border-t mt-2">
                                    <div>
                                        <TextInput
                                            required={true}
                                            placeholder="Email Subject"
                                            title="Email Subject" value={mailSubject}
                                            onChange={(e) => setMailBody(e.currentTarget.value)}
                                            variant={"filled"}
                                        />
                                    </div>
                                    <div>
                                        <Textarea
                                            placeholder="Optional email body"
                                            title="Optional email body" value={mailBody}
                                            onChange={(e) => setMailBody(e.currentTarget.value)}
                                            variant={"filled"}
                                            minRows={2}
                                            maxRows={5}
                                            autosize={true}/>
                                    </div>
                                    <div>
                                        <Button loading={isWorking} fullWidth={true}>Click to Email Invoice to Customer</Button>
                                    </div>
                                </div> : <div className="p-8">
                                    <div className="flex items-center space-x-4 justify-center flex-col">
                                        <Checks size={68} className="text-green-500"/>
                                        <span>Payment is completed and confirmed</span>
                                    </div>
                                </div>}
                                {/*    send mail section end*/}
                            </Tabs.Tab>

                            <Tabs.Tab label={<TabLabelWidget title={"History"}/> }>
                            <InvoiceHistory invId={inv?.InvoiceId}/>
                            </Tabs.Tab>
                        </Tabs>

                    </div>


                </div>
            </div>
        </div>
        {/*    main invoice body section end*/}
    </SideMenu>
}

function InvoiceMoreMenu({inv, order}) {
    return <Menu withArrow={true} placement={"center"} shadow="xl"
                 control={<Button variant="subtle" leftIcon={<Mail/>}>More</Button>}>
        <Menu.Item>Complete Invoice</Menu.Item>
        <Menu.Item>Mark as Pending</Menu.Item>
        <Divider/>
        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item color="red">Cancel Invoice</Menu.Item>
    </Menu>
}

function DownloadInvoiceAsPdf({inv, order}) {

    async function handleDownloadPdf() {
        const ele = document.getElementById("invoice-wid");
        await downloadAsPdf(ele);
    }

    return <Tooltip withArrow={true} label="Download as PDF"><Button onClick={() => handleDownloadPdf()}
                                                                     variant="subtle"
                                                                     leftIcon={<FileText/>}>Pdf</Button></Tooltip>
}

function ViewInvoiceOrder({inv, order}) {
    const [open, setOpen] = useState(false);

    return <React.Fragment><Tooltip withArrow={true} label="View invoice order"><Button variant="subtle"
                                                                                        onClick={() => setOpen(true)}
                                                                                        leftIcon={<Eye/>}>View
        Order</Button></Tooltip>
        <SalesOrderDetails open={open} onClose={() => setOpen(false)} object={order}/>
    </React.Fragment>
}

function PrintInvoice({inv, order}) {
    const [toast] = useToasts();

    const handlePrint = useReactToPrint({
        content: () => document.getElementById("invoice-wid"),
        //onBeforeGetContent: () => toast("Printing started", "info")
    })


    return <Tooltip label={"Print Invoice"}><Button onClick={() => handlePrint()} variant="subtle"
                                                    leftIcon={<Mail/>}>Print</Button></Tooltip>
}

function InvoiceStatusComp({inv, order}) {
    if (inv?.InvoiceStatus === InvoiceStatus.Pending || inv?.InvoiceStatus === InvoiceStatus.Unsent) return <div
        className="p-2 w-full bg-gray-500 mb-2 rounded-t flex items-center justify-center font-bold text-lg text-white uppercase">Unsent</div>;

    if (inv?.InvoiceStatus === InvoiceStatus.Sent) return <div
        className="p-2 w-full bg-blue-500 mb-2 rounded-t flex items-center justify-center font-bold text-lg text-white uppercase">Sent
        to Customer</div>;

    if (inv?.InvoiceStatus === InvoiceStatus.Completed) return <div
        className="p-2 w-full bg-green-500 mb-2 rounded-t flex items-center justify-center font-bold text-lg text-white uppercase">Completed</div>;

    if (inv?.InvoiceStatus === InvoiceStatus.Cancelled) return <div
        className="p-2 w-full bg-red-500 mb-2 rounded-t flex items-center justify-center font-bold text-lg text-white uppercase">Invoice
        Cancelled</div>;

    return null;
}