import SideMenu from "../Helpers/SideMenu";
import React, {useState} from "react";
import {ActionIcon, Badge, Button, Loader, ScrollArea, Tabs, Tooltip} from "@mantine/core";
import {XCircle} from "react-feather";
import useGetMyProfile from "../Hooks/SWRHooks/useGetMyProfile";
import {useHistory} from "react-router-dom";
import useAjaxError from "../Helpers/useAjaxError";
import useToasts from "../Helpers/MyToasts";
import UserInfoAvatar from "../components/UsersPartial/UserInfoPartials/UserInfoAvatar";
import UserInfoFullname from "../components/UsersPartial/UserInfoPartials/UserInfoFullname";
import UserInfoEmailAddress from "../components/UsersPartial/UserInfoPartials/UserInfoEmailAddress";
import UserInfoPhoneNumber from "../components/UsersPartial/UserInfoPartials/UserInfoPhoneNumber";
import UserInfoAccountStatus from "../components/UsersPartial/UserInfoPartials/UserInfoAccountStatus";
import TabLabelWidget from "../Widgets/TabLabelWidget";
import UserInfoDepartment from "../components/UsersPartial/UserInfoPartials/UserInfoDepartment";
import UserInfoDesignation from "../components/UsersPartial/UserInfoPartials/UserInfoDesignation";
import {formatDate} from "../Helpers/Constants";
import moment from "moment";
import MyProfileChangePassword from "../components/MyProfilePartials/MyProfileChangePassword";


export default function ViewMyProfile(props){
    const {data:v, mutate, error} = useGetMyProfile();
    const history = useHistory();
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();


    if (!v && !error) return <SideMenu title="My Profile"><div className="w-full bg-white flex items-center justify-center p-24"><Loader/></div></SideMenu>

    if (v && !error)
    return <SideMenu title="My Profile">
        <div className="mx-auto w-2/4 rounded-lg m-4 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                    <span className="font-semibold text-xl">My Profile</span>
                </div>
            </div>

            <div className="">
                    <div className="p-4">
                        <div className="mx-auto flex flex-col space-y-4 items-center justify-center w-full">
                            <UserInfoAvatar data={v} mutate={mutate}/>
                            <div>
                                <UserInfoFullname data={v} mutate={mutate} title={"Update your fullname"}/>
                            </div>
                            <UserInfoEmailAddress data={v} mutate={mutate} title={"Update your email address"}/>
                            <UserInfoPhoneNumber data={v} mutate={mutate} title="Update your phone number"/>

                            <div className="flex space-x-2 items-center">
                                {/*<UserInfoAccountStatus data={v} mutate={mutate}/>*/}
                                <Tooltip withArrow={true} color={v?.AccountStatus ? "teal" : "red"}
                                         label={v?.AccountStatus ? "Active account" : "Inactive account"}><Badge
                                    color={v?.AccountStatus ? "teal" : "red"}>{v?.AccountStatus ? "Active" : "Inactive"}</Badge></Tooltip>
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
                        <Tabs grow={true}>
                            <Tabs.Tab label={<TabLabelWidget title="Other Details"/>}>
                                <div className="grid gap-4 grid-cols-1 p-4">
                                    <div className="flex items-center space-x-4">
                                        <span>Department:</span>
                                        <UserInfoDepartment data={v} mutate={mutate} title="Update your department"/>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span>Designation:</span>
                                        <UserInfoDesignation data={v} mutate={mutate} title="Update your designation"/>
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
                            <Tabs.Tab label={<TabLabelWidget title="Roles I am in"/>}>
                                <div className="p-2">

                                    {v?.Roles && v?.Roles.length > 0 ?
                                        <div
                                            className="grid grid-cols-2 gap-2">
                                            {v?.Roles.map((r, i) => <Button key={r} size={"xs"}

                                            >{r}</Button>)}
                                        </div>
                                        :
                                        <div>You are not in any role(s)</div>}
                                </div>
                            </Tabs.Tab>
                            <Tabs.Tab label={<TabLabelWidget title="Change Password"/>}>
                                <div className="p-2">
                                <MyProfileChangePassword username={v?.Username}/>
                                </div>
                            </Tabs.Tab>
                        </Tabs>
                    </div>
            </div>
        </div>
    </SideMenu>

    return null;
}