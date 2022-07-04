import SideMenu from "../Helpers/SideMenu";
import {Button, Menu} from "@mantine/core";
import {CreditCard, Eye, FileInvoice, Plus} from "tabler-icons-react";
import {useRecoilState} from "recoil";
import {PaymentsReceivedStore} from "../Store/Store";
import useAjaxError from "../Helpers/useAjaxError";
import React, {useState, useEffect} from "react";
import {getAxios} from "../Helpers/API";
import {GridHelper} from "../Helpers/GridHelper";
import LoadingWidget from "../Widgets/LoadingWidget";
import {useHistory} from "react-router-dom";
import {InvoicesUrl, NewPaymentReceivedUrl, SingleInvoiceUrl} from "../Helpers/UrlHelper";
import EmptyDataWidget from "../Widgets/EmptyDataWidget";
import {ColumnDirective, ColumnsDirective} from "@syncfusion/ej2-react-grids/src/grid/columns-directive";
import PaymentReceivedInfo from "../components/PaymentsPartial/PaymentReceivedInfo";
import PartialHeader from "../Helpers/PartialHeader";
import SalesOrderSvg from "../Svgicons/SalesOrderSvg";

export default function ViewPaymentsReceived(props) {
    const [fetching, setFetching] = useState(false);
    const [data, setData] = useRecoilState(PaymentsReceivedStore);
    const [ajaxError] = useAjaxError();
    const [isFetching, setIsFetching] = useState(false);
    const [openPaymentInfoDrawer, setOpenPaymentInfoDrawer] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState("");
    const history = useHistory();

    async function fetchData() {
        setIsFetching(true);
        const result = await getAxios("payments/get/payments").catch(ajaxError).finally(() => setIsFetching(false));
        if (result && Array.isArray(result) && result.length > 0) {
            setData(result);
        }
    }

    useEffect(() => {
        if (data.length > 0) return;
        fetchData();
    }, []);


    return <SideMenu>
        <div className="flex items-center justify-between bg-white p-2">
            <PartialHeader title="Payments Received" icon={<SalesOrderSvg/>}/>
            <div className="flex items-center space-x-4">
                <Button onClick={() => history.push(NewPaymentReceivedUrl)} leftIcon={<Plus/>} size={"xs"}>New</Button>
            </div>
        </div>


        {/*    list of payments received*/}
        {!isFetching && data.length > 0
            ? <GridHelper data={data}>
                <ColumnsDirective>
                    <ColumnDirective field="PaymentId" headerText="Invoice#" visible={true} width={150} isPrimaryKey/>
                    <ColumnDirective field="Dated" headerText="Date" width={150} format={"yMd"} datatype="date"/>
                    <ColumnDirective field="CustomerId" headerText="CustomerId" width={200} visible={false}/>
                    <ColumnDirective field="CustomerName" headerText="Customer Name" width={200}/>
                    <ColumnDirective field="PaymentMethod" headerText="Payment Method" width={200}/>
                    <ColumnDirective template={viewTpl} headerText="Action" allowSearching={false} width={100}/>
                </ColumnsDirective>
            </GridHelper>
            : isFetching
                ? <LoadingWidget/>
                : <EmptyDataWidget title="Where is all the money?"
                                   desc="No payments have been made for your invoices. Payments will show up once the invoices get paid."
                                   btnText="Go to Invoices" btnUrl={InvoicesUrl}/>}


        {openPaymentInfoDrawer && <PaymentReceivedInfo
            open={openPaymentInfoDrawer}
            onClose={() => setOpenPaymentInfoDrawer(false)}
            paymentId={selectedPaymentId}/>}
    </SideMenu>


    function viewTpl(props) {
        return <Button
            variant="white" size={"xs"}
            onClick={() => {
                setOpenPaymentInfoDrawer(true);
                setSelectedPaymentId(props?.PaymentId);
            }}
        >View</Button>

    }

}
