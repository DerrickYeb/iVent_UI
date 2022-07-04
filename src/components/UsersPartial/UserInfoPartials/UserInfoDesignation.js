import React, {useState} from "react";
import {getAxios, postAxios} from "../../../Helpers/API";
import useAjaxError from "../../../Helpers/useAjaxError";
import useToasts from "../../../Helpers/MyToasts";
import {ActionIcon, Loader, Popover, TextInput, Button, Select} from "@mantine/core";
import {Edit3} from "react-feather";
import {useFetchLovDesignations} from "../../../Hooks/SWRHooks/useLovHooks";

export default function UserInfoDesignation({data: v, mutate, title = "Update user designation"}) {
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [name, setName] = useState(v?.Designation);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();

    const {data: desgn} = useFetchLovDesignations();

    async function handleFinish() {
        setIsWorking(true);
        const result = await getAxios(`user/update/designation?username=${v?.Username}&name=${name}`)
            .catch(ajaxError)
            .finally(() => setIsWorking(false));

        if (result) {
            mutate({...v, Designation: result}, true);
            setOpen(false);
            //setName("");
            toast("User updated successfully", "success");
        }
    }


    return <div className="flex items-start space-x-6">
        <b>{v?.Designation || "N/A"}</b>

        <Popover
            opened={open}
            onClose={() => setOpen(false)}
            target={<ActionIcon size={"xs"} onClick={() => setOpen((o) => !o)}><Edit3/></ActionIcon>}
            width={280}
            position="bottom"
            placement={"end"}
            withArrow
            shadow={"xl"}
        >
            <div className="border-b mb-4">
                <b>{title}</b>
            </div>
            <div className="flex flex-col space-y-2">
                <div>
                    <Select
                        data={desgn || []}
                        value={name} variant="filled"
                        onChange={(e) => setName(e)}
                        placeholder="Select designation"
                        label="Select designation"/>
                </div>
                <div>
                    <Button onClick={() => handleFinish()} loading={isWorking} size={"xs"}>Update</Button>
                </div>
            </div>
        </Popover>
    </div>
}