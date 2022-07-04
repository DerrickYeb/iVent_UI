import React, {useState} from "react";
import {getAxios, postAxios} from "../../../Helpers/API";
import useAjaxError from "../../../Helpers/useAjaxError";
import useToasts from "../../../Helpers/MyToasts";
import {ActionIcon, Loader, Popover, TextInput, Button} from "@mantine/core";
import {Edit3} from "react-feather";

export default function UserInfoFullname({data: v, mutate, title="Update user fullname"}) {
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [name, setName] = useState(v?.Fullname);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();

    async function handleFinish() {
        setIsWorking(true);
        const result = await getAxios(`user/update/fullname?username=${v?.Username}&name=${name}`)
            .catch(ajaxError)
            .finally(() => setIsWorking(false));

        if (result) {
            mutate({...v, Fullname: result}, true);
            setOpen(false);
            //setName("");
            toast("User updated successfully", "success");
        }
    }


    return <div className="flex items-start space-x-6">
        <span className="font-bold">{v?.Fullname}</span>

        <Popover
            opened={open}
            onClose={() => setOpen(false)}
            target={<ActionIcon size={"xs"} onClick={() => setOpen((o) => !o)}><Edit3/></ActionIcon>}
            width={300}
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
                    <TextInput
                        label="Enter fullname"
                        placeholder="Enter fullname"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant={"filled"}
                    />
                </div>
                <div>
                    <Button onClick={() => handleFinish()} loading={isWorking} size={"xs"}>Update</Button>
                </div>
            </div>
        </Popover>
    </div>
}