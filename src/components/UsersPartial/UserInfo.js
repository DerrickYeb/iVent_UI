import {BasicRightDrawerUtils} from "../../modals/ModalUtils";
import {ActionIcon, Badge, Loader, ScrollArea, Tabs, Tooltip, Button} from "@mantine/core";
import useSWR from "swr";
import {getAxios, postAxios} from "../../Helpers/API";
import {XCircle} from "react-feather";
import DefaultUserImg from '../../images/avatar.png'
import {Mail, PhoneCall, Check} from "react-feather";
import React, {useEffect, useState} from "react";
import TabLabelWidget from "../../Widgets/TabLabelWidget";
import {formatDate} from "../../Helpers/Constants";
import moment from "moment";
import useAjaxError from "../../Helpers/useAjaxError";
import useToasts from "../../Helpers/MyToasts";
import UserInfoAvatar from "./UserInfoPartials/UserInfoAvatar";
import UserInfoFullname from "./UserInfoPartials/UserInfoFullname";
import UserInfoDepartment from "./UserInfoPartials/UserInfoDepartment";
import UserInfoDesignation from "./UserInfoPartials/UserInfoDesignation";
import UserInfoAccountStatus from "./UserInfoPartials/UserInfoAccountStatus";
import UserInfoEmailAddress from "./UserInfoPartials/UserInfoEmailAddress";
import UserInfoPhoneNumber from "./UserInfoPartials/UserInfoPhoneNumber";
import {GetUsername} from "../../Helpers/AuthService";


export default function UserInfo({open, onClose, username}) {
    const [unassignedRoles, setUnassignedRoles] = useState([]);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();

    const getUsername = GetUsername();

    const {data: v, mutate, error} = useSWR(username ? `users/get/user?id=${username}` : null, getAxios);

    async function fetchData() {
        const result = await getAxios(`roles/get/unassigned/roles/for/user?username=${username}`).catch(ajaxError);
        if (result && Array.isArray(result)) {
            setUnassignedRoles(result);
        }
    }

    useEffect(() => {
        fetchData()
    }, [username])


    if (!v && !error) return <div className="w-full bg-white flex items-center justify-center p-24"><Loader/></div>
    if (v && !error)
        return <BasicRightDrawerUtils size={450} open={open} onClose={onClose}>
            <div className="flex items-center justify-between p-4 bg-white border-b">
                <div>
                    <span className="font-semibold">{v?.Fullname}'s profile</span>
                </div>
                <div>
                    <ActionIcon color="red" onClick={onClose}>
                        <XCircle/>
                    </ActionIcon>
                </div>
            </div>

            <div className="bg-white">
                <ScrollArea style={{height: window.innerHeight - 90}}>
                    <div className="p-4">
                        <div className="mx-auto flex flex-col space-y-4 items-center justify-center w-full">
                            <UserInfoAvatar data={v} mutate={mutate}/>
                            <div>
                                <UserInfoFullname data={v} mutate={mutate}/>
                            </div>
                            <UserInfoEmailAddress data={v} mutate={mutate}/>
                            <UserInfoPhoneNumber data={v} mutate={mutate}/>

                            <div className="flex space-x-2 items-center">
                                <UserInfoAccountStatus data={v} mutate={mutate}/>
                                {/*<Tooltip withArrow={true} color={v?.AccountStatus ? "teal" : "red"}*/}
                                {/*         label={v?.AccountStatus ? "Active account" : "Inactive account"}><Badge*/}
                                {/*    color={v?.AccountStatus ? "teal" : "red"}>{v?.AccountStatus ? "Active" : "Inactive"}</Badge></Tooltip>*/}
                                <Tooltip withArrow={true} color={v?.OnlineStatus ? "teal" : "gray"}
                                         label={v?.OnlineStatus ? "Online" : "Offline"}>
                                    <div
                                        className={`h-3.5 w-3.5 rounded-full ${v?.OnlineStatus ? "bg-green-500" : "bg-gray-700"} animate-wave`}/>
                                </Tooltip>

                            </div>
                        </div>
                    </div>

                    {/*    tabs*/}
                    <div className="mt-4">
                        <Tabs>
                            <Tabs.Tab label={<TabLabelWidget title="Other Details"/>}>
                                <div className="grid gap-4 grid-cols-1 p-4">
                                    <div className="flex items-center space-x-4">
                                        <span>Department:</span>
                                        <UserInfoDepartment data={v} mutate={mutate}/>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span>Designation:</span>
                                        <UserInfoDesignation data={v} mutate={mutate}/>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span>Reg Date:</span>
                                        <b>{formatDate(v?.RegDate)}</b>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span>Last Login:</span>
                                        {v?.OnlineStatus ? <b>Online</b> :
                                            <b>{moment(v?.LastLogin).fromNow()}</b>}
                                    </div>
                                </div>
                            </Tabs.Tab>
                            <Tabs.Tab label={<TabLabelWidget title="User Roles"/>}>
                                <div className="p-2">

                                    {v?.Roles && v?.Roles.length > 0 ?
                                        <div
                                            className="grid grid-cols-2 gap-2">
                                            {v?.Roles.map((r, i) => <Button key={r} size={"xs"}
                                                                            onClick={() => handleOnRemoveUserFromRole(r)}
                                            >{r}</Button>)}
                                        </div>
                                        :
                                        <div>No roles for now</div>}
                                </div>
                            </Tabs.Tab>
                            <Tabs.Tab label={<TabLabelWidget title="Assign Roles"/>}>
                                <div className="p-2">
                                    <div
                                        className="grid grid-cols-2 gap-2">
                                        {unassignedRoles && unassignedRoles.map((role, _) => <Button key={role?.RoleId}
                                                                                                     size={"xs"}
                                                                                                     color="dark"
                                                                                                     variant={"light"}
                                                                                                     compact={true}
                                                // leftIcon={<ActionIcon size={"xs"}>
                                                //     <Check size={12}/>
                                                // </ActionIcon>}
                                                                                                     onClick={() => handleOnRoleSelected(role)}
                                            >
                                                <div className="flex space-2 items-center">
                                                    {/*<Check size={12}/>*/}
                                                    {role?.RoleName}
                                                </div>

                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Tabs.Tab>
                        </Tabs>
                    </div>
                </ScrollArea>
            </div>

        </BasicRightDrawerUtils>

    async function handleOnRoleSelected(role) {
        const payload = {
            Username: username,
            RoleId: role?.RoleId
        }
        const result = postAxios("roles/add/user/to/role", payload).catch(ajaxError);
        if (result) {
            toast("Role assigned successfully", "success");
            setUnassignedRoles((prev) => prev.filter(x => x.RoleId !== role?.RoleId));
            v?.Roles.unshift(role?.RoleName);
            //update local storage
            if(username === getUsername) {
                localStorage.setItem("r", JSON.stringify(v?.Roles))
            }
            await mutate(v, true);

        }
    }

    async function handleOnRemoveUserFromRole(roleName) {
        toast("removing role... Please wait", "info");
        const result = await getAxios(`roles/remove/user/from/role?username=${username}&roleName=${roleName}`).catch(ajaxError);
        if (result) {
            toast("Role remove successfully", "success");
            //get role and add it back to roles list
            const getRole = await getAxios(`roles/get/role?id=${result}`).catch(ajaxError);

            if (getRole) {
                setUnassignedRoles((prev) => [getRole, ...prev]);

                //update local storage
                if (username === getUsername) {
                    const getR = v?.Roles.filter(x => x !== roleName);
                    localStorage.setItem("r", JSON.stringify(getR))
                    v.Roles = getR;
                    await mutate(v, true);
                } else {
                    const getR = v?.Roles.filter(x => x !== roleName);
                    delete v.Roles;
                    v.Roles = getR;
                    await mutate(v, true);
                }


            }
        }
    }
}