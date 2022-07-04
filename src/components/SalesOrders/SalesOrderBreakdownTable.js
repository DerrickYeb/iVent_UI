import React, {useState, useRef, useCallback} from 'react';
import {formatDate, MoneyFormat, renderAmount} from "../../Helpers/Constants";
import {Table} from '@mantine/core';
import CompanyInvoiceHeader from "../../Helpers/CompanyInvoiceHeader";

export default function SalesOrderBreakdownTable({data: v, totalAmount, totalDiscount}) {
    const invRef = useRef();

    const rows = v?.Stocks.map((element) => (
        <tr key={element.Id}>
            <td>
                <div className="flex flex-col">
                    <span>{element?.StockName}</span>
                    <span>Batch Id: {element?.BatchId}</span>
                </div>
            </td>
            <td>{element.StockQty}</td>
            <td>{MoneyFormat(element.StockSellingPrice)}</td>
            <td>{element.DiscountRate}%</td>
            <td>{renderAmount(element?.StockSellingPrice, element?.StockQty,element?.DiscountRate)}</td>
        </tr>
    ));

    return <div id="order-brk">
        <div className="pr-4 pb-12">
            <CompanyInvoiceHeader/>
        </div>
        <div ref={invRef}>
        <div className="grid gap-8 grid-cols-2">
            {/*    left*/}
            <div className="flex flex-col">
                <span className="text-xl font-bold">INVOICE</span>
                <span className="text-gray-600">Sales Order# <b>{v?.OrderId}</b></span>
                <div className="p-0.5 text-gray-60 text-xs">{v?.OrderStatus}</div>

                <div className="mt-8 flex flex-col space-y-4 text-gray-500">
                    <span className="text-gray-600 uppercase text-xs">Reference# &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <b>{v?.ReferenceId}</b></span>
                    <span className="text-gray-600 uppercase text-xs">Order Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <b>{formatDate(v?.OrderDate)}</b></span>
                    <span
                        className="text-gray-600 uppercase text-xs">Expected Shipment Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <b>{formatDate(v?.ExpectedShipmentDate)}</b></span>
                    <span
                        className="text-gray-600 uppercase text-xs">Payment Period &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <b>{v?.PaymentPeriod}</b></span>
                    <span
                        className="text-gray-600 uppercase text-xs">Reminder Period &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <b>{v?.ReminderPeriod}</b></span>
                </div>

            </div>

            {/*    right*/}
            <div className="flex flex-col space-y-2">
                {/*billing address*/}
                <div className="flex flex-col space-y-1">
                    <span className="text-lg">Billing Address</span>
                    <span className="text-base text-gray-600">{v?.Customer?.CustomerName}</span>
                    <div className="flex flex-col mt-2 text-gray-600 text-xs">
                        <span>{v?.BillingAddress?.AddressOne}, {v?.BillingAddress?.State}</span>
                        <span>{v?.BillingAddress?.Country}</span>
                    </div>
                </div>

                {/*    shipping adress*/}
                <div className="flex flex-col space-y-1">
                    <span className="text-lg">Shipping Address</span>
                    <div className="flex flex-col mt-2 text-gray-600 text-xs">
                        <span>{v?.ShippingAddress?.AddressOne}, {v?.ShippingAddress?.State}</span>
                        <span>{v?.ShippingAddress?.Country}</span>
                    </div>
                </div>
            </div>
        </div>


        {/*    break down table*/}
        <div className="mt-6">
            <Table>
                <thead className="bg-gray-200 text-white border-t border-b uppercase">
                <tr>
                    <th>Item/Description</th>
                    <th>Qty</th>
                    <th>Selling Price</th>
                    <th>Discount Rate</th>
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </div>

    {/*    subtotal and total*/}
        <div className="flex border-t flex-col items-end justify-end">
            <div className="flex space-x-4 p-6 border-b">
                <span className="font-semibold text-lg">Sub Total</span>
                <span className="font-semibold text-lg">{MoneyFormat(totalAmount - (totalAmount * totalDiscount) / 100)}</span>
            </div>

            <div className="flex space-x-4 p-6 border-b">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-semibold text-lg">{MoneyFormat(totalAmount - (totalAmount * totalDiscount) / 100)}</span>
            </div>
        </div>
    </div>
    </div>
}