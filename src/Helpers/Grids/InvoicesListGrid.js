import {ColumnDirective, ColumnsDirective} from "@syncfusion/ej2-react-grids";
import {GridHelper} from "../GridHelper";
import {Button, Loader, Badge} from "@mantine/core";
import {SingleInvoiceUrl} from "../UrlHelper";
import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";
import {InvoiceStatus} from "../Constants";

export default function InvoicesListGrid({data}) {
    const history = useHistory();

    return data && data.length > 0 ? <GridHelper data={data}>
        <ColumnsDirective>
            <ColumnDirective field="InvoiceDate" headerText="Date" width={150} format={"yMd"} datatype="date"/>
            <ColumnDirective field="InvoiceId" headerText="Invoice#" visible={true} width={150} isPrimaryKey/>
            <ColumnDirective field="OrderId" headerText="OrderId#" visible={true} width={150}/>
            <ColumnDirective field="CustomerId" headerText="CustomerId" width={200} visible={false}/>
            <ColumnDirective field="CustomerName" headerText="Customer Name" width={200}/>
            <ColumnDirective template={statusTpl} headerText="Status" allowSearching={false} width={100}/>
            <ColumnDirective template={viewTpl} headerText="Action" allowSearching={false} width={100}/>
        </ColumnsDirective>
    </GridHelper> : <Loader/>


    function statusTpl(props) {
        return <Badge
            color={props?.InvoiceStatus === InvoiceStatus.Pending ? "yellow"
                : props?.InvoiceStatus === InvoiceStatus.Completed ? "teal"
                    : "blue"}
            variant={"filled"}
            radius={0}
        >{props?.InvoiceStatus || ""}</Badge>
    }

    function viewTpl(props) {
        return <Button variant="white" size={"xs"}
                       onClick={() => history.push(SingleInvoiceUrl + props?.InvoiceId)}>View</Button>
    }
}

