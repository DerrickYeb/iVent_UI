import PartialHeader from "../Helpers/PartialHeader";
import DashboardSvg from "../Svgicons/DashboardSvg";
import SideMenu from "../Helpers/SideMenu";
import React, {useState} from "react";
import SettingsSvg from "../Svgicons/SettingsSvg";
import {Button, TextInput, Checkbox, Badge, PasswordInput, Select} from '@mantine/core';
import {TextField} from "@material-ui/core";
import {
    ColumnDirective,
    ColumnsDirective,
} from "@syncfusion/ej2-react-grids";
import "@syncfusion/ej2-react-grids/styles/tailwind.css";
import {RolesDemoData, UsersDemoData} from "../Demo/UsersDemoData";
import {GridHelper} from "../Helpers/GridHelper";
import {cloneDeep} from "lodash";
import ChangePasswordPartial from "../components/UsersPartial/ChangePasswordPartial";

export default function ViewChangePassword() {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(true);
    const [isWorking, setIsWorking] = useState(false);
    const [users, setUsers] = useState(UsersDemoData);

    const cloneUsers = cloneDeep(users);


    return <SideMenu>
        <PartialHeader title="Setups > Change Password" icon={<SettingsSvg/>}/>
        <div className="p-4 bg-white shadow w-full mx-auto mb-4">

            {/*    users grid*/}
            <GridHelper data={users}>
                <ColumnsDirective>
                    <ColumnDirective
                        headerText="Action"
                        width="80"
                        template={viewTemplate}
                        allowSearching={false}
                    />
                    <ColumnDirective
                        field="Id"
                        width="100"
                        // isPrimaryKey
                        visible={false}
                    />
                    {/*<ColumnDirective*/}
                    {/*    template={imageTemplate}*/}
                    {/*    headerText="Avatar"*/}
                    {/*    width="70"*/}
                    {/*/>*/}
                    <ColumnDirective
                        field="Username"
                        headerText="Username"
                        isPrimaryKey
                        width="120"
                        //isFrozen
                    />
                    <ColumnDirective
                        field="Fullname"
                        headerText="Fullname"
                        width="200"
                    />
                    <ColumnDirective
                        field="RegDate"
                        headerText="Date Registered"
                        width="150"
                    />
                    <ColumnDirective
                        field="Role"
                        headerText="User Role"
                        width="150"
                    />
                    <ColumnDirective
                        template={statusTemplate}
                        //field="Status"
                        headerText="Status"
                        width="120"
                    />
                    />
                </ColumnsDirective>
            </GridHelper>
        </div>
    </SideMenu>

    function viewTemplate(props) {
        return (
            <ChangePasswordPartial
                object={props}
                // onEditDone={(data) => onEditDone(data)}
            />
        );
    }

    function statusTemplate(props) {
        return (
            <Badge>{props?.Status ? "Active" : "Inactive"}</Badge>
        );
    }

    function imageTemplate(props) {
        return (
            <img
                src={props.Avatar}
                className="w-8 h-8 object-cover rounded"
                alt=""
            />
        );
    }
}