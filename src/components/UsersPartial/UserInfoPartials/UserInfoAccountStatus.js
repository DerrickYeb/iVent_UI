import React, {useState} from "react";
import {getAxios} from "../../../Helpers/API";
import useAjaxError from "../../../Helpers/useAjaxError";
import useToasts from "../../../Helpers/MyToasts";
import {Loader, Popover, Button, Badge, Tooltip} from "@mantine/core";
import {Edit3} from "react-feather";

export default function UserInfoAccountStatus({data: v, mutate}) {
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    //const [name, setName] = useState(v?.AccountStatus);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();

    async function handleFinish(status) {
        setIsWorking(true);
        const val = status !== true;
        const result = await getAxios(`user/update/account/status?username=${v?.Username}&status=${val}`)
            .catch(ajaxError)
            .finally(() => setIsWorking(false));
            mutate({...v, AccountStatus: val}, true);
            setOpen(false);
            //setName("");
            toast("User updated successfully", "success");
    }


    return <Popover
        opened={open}
        onClose={() => setOpen(false)}
        target={<Tooltip withArrow={true} color={v?.AccountStatus ? "teal" : "red"}
                         label={v?.AccountStatus ? "Active account" : "Inactive account"}><Badge
            onClick={() => setOpen((o) => !o)}
            color={v?.AccountStatus ? "teal" : "red"} className="cursor-pointer">
            {v?.AccountStatus ? "Active" : "Inactive"}</Badge></Tooltip>}
        width={280}
        position="bottom"
        placement={"center"}
        withArrow
        shadow={"xl"}
    >
        <div className="border-b mb-4">
            <b>Update user account status</b>
        </div>
        <div className="flex flex-col space-y-2">
            <Button loading={isWorking} onClick={() => handleFinish(v?.AccountStatus)} variant="light" color={v?.AccountStatus ? "red" : "teal"}>
                {v?.AccountStatus ? "Deactivate Account" : "Activate Account"}
            </Button>
        </div>
    </Popover>
}