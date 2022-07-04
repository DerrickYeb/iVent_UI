import {Menu, Divider, Text, Avatar, Badge} from '@mantine/core';
import {IconButton} from '@material-ui/core';
import HeaderQuickCreateWidget from "./HeaderQuickCreateWidget";
import {Bell} from "react-feather";
import useGetMyProfile from "../Hooks/SWRHooks/useGetMyProfile";
import {useHistory} from "react-router-dom";
import {getAxios} from "../Helpers/API";
import useAjaxError from "../Helpers/useAjaxError";
import useToasts from "../Helpers/MyToasts";

export default function HeaderAvatarWidget() {
    const {data, mutate, error} = useGetMyProfile();
    const history = useHistory();
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();

    return <div className="flex items-center space-x-4 pr-4">
        <HeaderQuickCreateWidget/>
        <BellIcon/>
        <Menu withArrow={true} position={"bottom"} trigger="click" delay={500}
              control={<div className="flex items-center space-x-2 rounded-xl bg-gray-50 pl-2 pb-1 pt-1 pr-2">
                  <b>{data?.Fullname}</b>
                  <Avatar
                      alt="Avatar"
                      size={25}
                      mr={5}
                      radius="xl"
                      src={data?.Avatar}
                  />

              </div>}
        >
            <Menu.Item onClick={() => history.push("/me")}>Profile</Menu.Item>
            <Divider/>
            <Menu.Item color="red" onClick={() => handleLogout()}>Logout</Menu.Item>
        </Menu>
        <SettingsIcon/>
    </div>

    async function handleLogout() {
        const result = await getAxios("auth/logout").catch(ajaxError);
        if (result) history.push("/")
    }
}

function BellIcon() {
    return <IconButton>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path
                d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
        </svg>
    </IconButton>
}

function SettingsIcon() {
    return <IconButton>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
    </IconButton>
}