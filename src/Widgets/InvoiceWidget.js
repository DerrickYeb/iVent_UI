import SalesOrderBreakdownTable from "../components/SalesOrders/SalesOrderBreakdownTable";
import CompanyInvoiceHeader from "../Helpers/CompanyInvoiceHeader";
import React from "react";
import InvoiceFooter from "../Helpers/InvoiceFooter";

export default function InvoiceWidget({invoice, order, totalAmount, totalDiscount}){
    return <div id="invoice-wid">

    {/*    invoice header for now, the header is coming from order breakdown*/}
    {/*    <CompanyInvoiceHeader/>*/}

    {/*  invoice breakdown   */}
        <SalesOrderBreakdownTable data={order} totalAmount={totalAmount} totalDiscount={totalDiscount}/>

    {/*    invoice footer*/}
        <InvoiceFooter text={order?.Note}/>
    </div>
}