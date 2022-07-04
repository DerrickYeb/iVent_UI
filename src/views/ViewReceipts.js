import SideMenu from "../Helpers/SideMenu";
import React, {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {ReceiptsStore} from "../Store/Store";
import {getAxios} from "../Helpers/API";
import useAjaxError from "../Helpers/useAjaxError";
import {GridHelper} from "../Helpers/GridHelper";
import {ColumnDirective, ColumnsDirective} from "@syncfusion/ej2-react-grids";
import {Button, ActionIcon} from "@mantine/core";
import {BasicRightDrawerUtils} from "../modals/ModalUtils";
import {XCircle, Printer} from 'react-feather';
import LogoImg from '../images/dlogo.svg';
import CompanyInvoiceHeader from "../Helpers/CompanyInvoiceHeader";
import {formatDate, MoneyFormat} from "../Helpers/Constants";
import useGetMyProfile from "../Hooks/SWRHooks/useGetMyProfile";
import {useReactToPrint} from 'react-to-print';
import PartialHeader from "../Helpers/PartialHeader";
import SalesOrderSvg from "../Svgicons/SalesOrderSvg";
import ReceiptInfo from "../components/ReceiptsPartial/ReceiptInfo";


export default function ViewReceipts(props) {
    const [data, setData] = useRecoilState(ReceiptsStore);
    const [ajaxError] = useAjaxError();
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);

    async function fetchData() {
        const result = await getAxios("get/receipts").catch(ajaxError);
        if (result) setData(result);
    }


    useEffect(() => {

        if (data.length > 0) return;
        fetchData();
    }, []);





    return <SideMenu>
        <div className="flex items-center justify-between bg-white p-2">
            <PartialHeader title="Payment Receipts" icon={<SalesOrderSvg/>}/>
        </div>


        {/*    grid*/}
        <div className="">
            <GridHelper data={data || []}>
                <ColumnsDirective>
                    <ColumnDirective headerText="PaymentId" field="PaymentId" isPrimaryKey={true} visible={false}/>
                    <ColumnDirective headerText="EnteredBy" field="Username" visible={false}/>
                    <ColumnDirective headerText="Payment Date" field="PaymentDate" dataType="datetime" format="yMd"/>
                    <ColumnDirective headerText="Customer Name" field="CustomerName"/>
                    <ColumnDirective headerText="Amt. Received" field="AmountReceived"/>
                    <ColumnDirective headerText="Pmt. Mode" field="PaymentMethod"/>
                    <ColumnDirective headerText="Deposit Account" field="DepositAccount"/>
                    <ColumnDirective headerText="EnteredBy" field="Fullname"/>
                    <ColumnDirective headerText="Action" template={actionTpl}/>
                </ColumnsDirective>
            </GridHelper>
        </div>


        {open && <ReceiptInfo selected={selected} open={open} onClose={() => setOpen(false)}/>}


    </SideMenu>

    function actionTpl(props) {
        return <Button variant={"white"} size={"xs"} onClick={() => {
            setSelected(props);
            setOpen(true);
        }
        }>View</Button>
    }

}

