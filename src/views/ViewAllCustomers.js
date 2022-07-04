import SideMenu from "../Helpers/SideMenu";
import PartialHeader from "../Helpers/PartialHeader";
import React, {useState, useEffect} from "react";
import CustomersSvg from "../Svgicons/CustomersSvg";
import {GridHelper} from "../Helpers/GridHelper";
import {ColumnDirective, ColumnsDirective} from "@syncfusion/ej2-react-grids";
import {ActionIcon, Avatar, Badge, Button, Divider, Loader, Menu} from "@mantine/core";
import {CustomersTypeToArray, StockStatus} from "../Helpers/Constants";
import {AllCustomersUrl, NewCustomerUrl, NewInventoryUrl} from "../Helpers/UrlHelper";
import {ChevronDown, Plus, Settings} from "react-feather";
import {useHistory} from "react-router-dom";
import useAjaxError from "../Helpers/useAjaxError";
import EditCustomer from "../components/Customers/EditCustomer";
import {CustomersListStore} from "../Store/Store";
import {useRecoilState} from 'recoil';
import {getAxios} from "../Helpers/API";
import NewCustomer from "../components/Customers/NewCustomer";
import CustomerDetails from "../components/Customers/CustomerDetails";
import AvatarImg from '../images/avatar.png';

export default function ViewAllCustomers() {
    const [data, setData] = useRecoilState(CustomersListStore);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openCustomerDetailsDrawer, setOpenCustomerDetailsDrawer] = useState(false);
    const [customerId, setCustomerId] = useState("");
    const [ajaxError] = useAjaxError();
    const history = useHistory();

    async function fetchData() {
        setIsLoading(true);
        const result = await getAxios(`customers/get/customers`).catch(ajaxError).finally(() => {
            setIsLoading(false);
        });
        if (result) setData(result);
    }

    useEffect(() => {
        if (data.length > 0) return;
        fetchData();
    }, []);

    function handleChange(val) {

    }


    return <SideMenu title="All Customers">
        <PartialHeader title="All Customers" icon={<CustomersSvg/>}/>
        <div className="w-full border-t border-gray-200">

            <div className="flex items-center bg-white justify-end space-x-6 p-2">
                {/*<div>*/}
                {/*    <Menu withArrow={true} position={"bottom"} trigger="click" delay={500}*/}
                {/*          control={<div*/}
                {/*              className="flex items-center justify-between space-x-2 rounded bg-gray-50 p-1">*/}
                {/*              <b>All Customers</b>*/}
                {/*              <ChevronDown/>*/}
                {/*          </div>}*/}
                {/*    >*/}
                {/*        <Menu.Item onClick={() => handleChange("")}>All Customers</Menu.Item>*/}
                {/*        {CustomersTypeToArray().slice(1).map((s, i) => <Menu.Item*/}
                {/*            onClick={() => handleChange(s?.value)} key={s?.value}>{s?.label}</Menu.Item>)}*/}
                {/*    </Menu>*/}
                {/*</div>*/}
                <div className="flex items-center space-x-4">
                    <Button onClick={() => history.push(NewCustomerUrl)} className="bg-green-500" leftIcon={<Plus/>}
                            size={"xs"}>New</Button>
                    {/*<ActionIcon>*/}
                    {/*    <Settings/>*/}
                    {/*</ActionIcon>*/}
                </div>

            </div>


            {/*    main stocks list grid*/}
            <div className="p-2">
                {data.length > 0 ? <GridHelper data={data}>
                    <ColumnsDirective>
                        <ColumnDirective field="CustomerId" headerText="CustomerId" visible={false} isPrimaryKey/>
                        <ColumnDirective template={avatarTpl} headerText="Avatar" allowSearching={false} width={50}/>
                        <ColumnDirective field="CustomerName" headerText="Name" width={250}/>
                        <ColumnDirective field="CompanyName" headerText="Company Name" width={200}/>
                        <ColumnDirective field="CustomerEmail" headerText="Email" width={200}/>
                        <ColumnDirective field="CustomerWorkPhone" headerText="Work Phone" width={180}/>
                        {/*<ColumnDirective field="Receivables" headerText="Receivables" width={140}/>*/}
                        {/*<ColumnDirective field="Dated" headerText="Entered Date" format={"yMd"} datatype="date"*/}
                        {/*                 width={150}/>*/}
                        <ColumnDirective template={statusTpl} headerText="Status" allowSearching={false} width={100}/>
                        <ColumnDirective template={actionTpl} headerText="Action" allowSearching={false} width={100}/>
                    </ColumnsDirective>
                </GridHelper> : <Loader/>}
            </div>
        </div>

        <CustomerDetails open={openCustomerDetailsDrawer} onClose={() => setOpenCustomerDetailsDrawer(false)}
                         object={customerId}/>

    </SideMenu>

    function statusTpl(props) {
        return <Badge
            radius={0}
            color={`${props?.CustomerStatus === true ? "teal" : "red"}`}>{props?.CustomerStatus ? "Active" : "Inactive"}</Badge>
    }

    function avatarTpl(props) {
        return <Avatar src={props?.CustomerAvatar || AvatarImg} />
    }

    function actionTpl(props) {
        return <Menu withArrow={true} position={"bottom"} trigger="click" delay={500}
                     control={<ActionIcon>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-current text-gray-700"
                              fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                   d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                         </svg>
                     </ActionIcon>}
        >
            <Menu.Item onClick={() => {
                setCustomerId(props);
                setOpenCustomerDetailsDrawer(true);
            }
            }
                       icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                  stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                 d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                 d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                       </svg>}>View</Menu.Item>
            {/*<Menu.Item icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"*/}
            {/*                      stroke="currentColor">*/}
            {/*    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/}
            {/*          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>*/}
            {/*</svg>}>Edit</Menu.Item>*/}
            {/*<Menu.Item icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"*/}
            {/*                      stroke="currentColor">*/}
            {/*    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/}
            {/*          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>*/}
            {/*</svg>}>Email Customer</Menu.Item>*/}
            {/*<Menu.Item icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"*/}
            {/*                      stroke="currentColor">*/}
            {/*    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/}
            {/*          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>*/}
            {/*</svg>}>Send Invoice</Menu.Item>*/}
        </Menu>
    }
}