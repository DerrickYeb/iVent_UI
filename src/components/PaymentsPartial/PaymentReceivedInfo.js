import React, {useState} from 'react';
import {ActionIcon, Tabs, Badge} from "@mantine/core";
import {BasicRightDrawerUtils} from "../../modals/ModalUtils";
import useSWR from "swr";
import {getAxios} from "../../Helpers/API";
import useAjaxError from "../../Helpers/useAjaxError";
import {useHistory} from "react-router-dom";
import SalesOrdersButtonGroup from "../SalesOrders/SalesOrdersButtonGroup";
import {CircleX} from "tabler-icons-react";
import PaymentReceivedPartialAmountReceived from "./PaymentReceivedPartialAmountReceived";
import PaymentReceivedPartialPaymentMode from "./PaymentReceivedPartialPaymentMode";
import TabLabelWidget from "../../Widgets/TabLabelWidget";
import {formatDate} from "../../Helpers/Constants";
import PaymentReceivedHistoryList from "./PaymentReceivedHistoryList";
import PaymentReceivedInvoiceList from "./PaymentReceivedInvoiceList";
import InvoicesListGrid from "../../Helpers/Grids/InvoicesListGrid";
import PaymentReceivedAttachedFiles from "./PaymentReceivedAttachedFiles";

export default function PaymentReceivedInfo({open, onClose, paymentId, btnText = "View"}) {
    const [ajaxError] = useAjaxError();
    const history = useHistory();

    const {
        data: pmt,
        mutate,
        error
    } = useSWR(paymentId ? `payments/get/payment?paymentId=${paymentId}` : null, getAxios);

    const {data: invList} = useSWR(pmt?.PaymentId ? `get/invoices/by/payment?paymentId=${pmt?.PaymentId}` : null, getAxios);

    async function handleOnDone() {
        mutate(true);
    }

    return <BasicRightDrawerUtils open={open} onClose={onClose} size={"70%"}>
        {/*    header*/}
        <div className="items-center bg-white p-4 flex justify-between space-x-4">
            <div>Payment# {paymentId}</div>

            {/*action buttons*/}
            <div className="flex space-x-4 items-center">
                {pmt?.IsInvoiceSettled
                    ? <div className="flex items-center space-x-4">
                        <Badge radius={0} size={"md"} color={"pink"} variant={"filled"}>Order(s) Settled</Badge>
                        <Badge radius={0} size={"md"} color={"pink"} variant={"filled"}>Invoice(s) Settled</Badge>
                    </div>
                    : null}
            </div>
            {/*action buttons*/}
            {/*close button*/}
            <div>
                <ActionIcon variant="hover" onClick={onClose} size={"sm"}><CircleX/></ActionIcon>
            </div>
        </div>


        {/*    payment details*/}
        <div className="border-t p-4">
            <PaymentReceivedPartialAmountReceived paymentAmount={pmt?.PaymentAmount}
                                                  amountReceived={pmt?.AmountReceived}
                                                  change={pmt?.Change}
                                                  outstanding={pmt?.PreviousBalance}
                                                  paymentId={pmt?.PaymentId}
                                                  paymentStatus={pmt?.PaymentStatus}
                                                  isInvoiceSettled={pmt?.IsInvoiceSettled}
                                                  onDone={() => handleOnDone()}
            />
        </div>


        {/*    payment details*/}
        <div className="border-t p-4">
            <PaymentReceivedPartialPaymentMode customerName={pmt?.CustomerName}
                                               paymentMode={pmt?.PaymentMethod}
                                               depositAccount={pmt?.DepositAccount}/>
        </div>

        {/*    other details tab*/}
        <div className="border-t p-4 bg-white">
            <Tabs>
                <Tabs.Tab label={<TabLabelWidget title="Other Details"/>}>
                    <div className="grid gap-4 grid-cols-1">
                        <div className="flex space-x-4 items-center">
                            <div>First Payment Date:</div>
                            <div>{formatDate(pmt?.PaymentDate)}</div>
                        </div>
                        <div className="flex space-x-4 items-center">
                            <div>Date Recorded:</div>
                            <div>{formatDate(pmt?.Dated)}</div>
                        </div>
                        <div className="flex space-x-4 items-center">
                            <div>Last Invoice Date Recorded:</div>
                            <div>{formatDate(pmt?.LastInvoiceDate)}</div>
                        </div>
                    </div>

                </Tabs.Tab>
                <Tabs.Tab label={<TabLabelWidget title="Attached Files"/>}>
                    <PaymentReceivedAttachedFiles files={pmt?.AttachedFiles}/>
                </Tabs.Tab>
                <Tabs.Tab label={<TabLabelWidget title="Payment History"/>}>
                    <PaymentReceivedHistoryList list={pmt?.PaymentHist}/>
                </Tabs.Tab>
                <Tabs.Tab label={<TabLabelWidget title="Invoices"/>}>
                    {/*{invList && invList.length > 0 && <InvoicesListGrid data={invList || []}/>}*/}
                    {invList && invList.length > 0 && <PaymentReceivedInvoiceList list={invList}/>}
                </Tabs.Tab>
            </Tabs>
        </div>

    </BasicRightDrawerUtils>
}