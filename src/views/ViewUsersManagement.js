import PartialHeader from "../Helpers/PartialHeader";
import SideMenu from "../Helpers/SideMenu";
import React, {useState, useEffect} from "react";
import SettingsSvg from "../Svgicons/SettingsSvg";
import {Button, TextInput, Badge, PasswordInput, Select, Loader} from '@mantine/core';
import {
    ColumnDirective,
    ColumnsDirective,
} from "@syncfusion/ej2-react-grids";
import {useRecoilState} from 'recoil';
import {GridHelper} from "../Helpers/GridHelper";
import {UsersListStore} from "../Store/Store";
import {getAxios} from "../Helpers/API";
import useAjaxError from "../Helpers/useAjaxError";
import useToasts from "../Helpers/MyToasts";
import DefaultUserImg from '../images/avatar.png'
import UserInfo from "../components/UsersPartial/UserInfo";
import NewUserPartial from "../components/UsersPartial/NewUserPartial";

export default function ViewUsersManagement() {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [users, setUsers] = useRecoilState(UsersListStore);
    const [selectedUser, setSelectedUser] = useState("");
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();

    async function fetchUsers() {
        const result = await getAxios(`users/get/users`).catch(ajaxError);
        if (result && Array.isArray(result)) {
            setUsers(result);
        }
    }

    useEffect(() => {
        if (users.length > 0) return;
        fetchUsers()
    }, []);

    return <SideMenu>
        <PartialHeader title="Setups > Users Management" icon={<SettingsSvg/>}/>
        <div className="p-4 bg-white shadow w-full mx-auto mb-4">
            <div className="flex justify-end mb-4">
                <NewUserPartial/>
            </div>


            {/*    users grid*/}
            {users && users.length > 0 ? <GridHelper data={users} pageCount={6}>
                <ColumnsDirective>
                    <ColumnDirective
                        field="Id"
                        width="100"
                        // isPrimaryKey
                        visible={false}
                    />
                    <ColumnDirective
                        template={imageTemplate}
                        headerText="Avatar"
                        width="70"
                    />
                    <ColumnDirective
                        field="Username"
                        headerText="Username"
                        isPrimaryKey
                        width="100"
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
                        format={"yMd"}
                        type={"date"}
                    />
                    <ColumnDirective
                        field="LastLogin"
                        headerText="Last Login"
                        width="150"
                        format={"yMd"}
                        type={"date"}
                    />
                    <ColumnDirective
                        template={statusTemplate}
                        //field="Status"
                        headerText="Status"
                        width="120"
                    />
                    <ColumnDirective
                        headerText="Action"
                        width="80"
                        template={viewTemplate}
                        allowSearching={false}
                    />
                </ColumnsDirective>
            </GridHelper> : <Loader/>}
        </div>

        {/*user info drawer*/}
        {openDrawer && <UserInfo
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            username={selectedUser}/>}


    </SideMenu>

    function viewTemplate(props) {
        return <Button onClick={() => handleSelectedUser(props?.Username)} size={"xs"}
                       variant={"subtle"}>Action</Button>
    }

    function handleSelectedUser(user) {
        setSelectedUser(user);
        setOpenDrawer(true);
    }

    function statusTemplate(props) {
        return (
            <Badge color={props?.AccountStatus ? "teal" : "red"}>{props?.AccountStatus ? "Active" : "Inactive"}</Badge>
        );
    }

    function imageTemplate(props) {
        return (
            <img
                src={props.Avatar || DefaultUserImg}
                className="w-8 h-8 object-cover rounded-full"
                alt=""
            />
        );
    }

    function handleToggleStatus(checker, object) {
        const getIndex = users.findIndex((e) => e.Id === object?.Id);
        // cloneUsers[getIndex].Status = checker;
        // console.log(checker);
        // setUsers(cloneUsers);
    }
}

