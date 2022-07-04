import React, {useState} from "react";
import {getAxios} from "../../../Helpers/API";
import useAjaxError from "../../../Helpers/useAjaxError";
import useToasts from "../../../Helpers/MyToasts";
import {ActionIcon, Popover, TextInput, Button} from "@mantine/core";
import {Edit3, PhoneCall} from "react-feather";

export default function UserInfoPhoneNumber({data: v, mutate, title = "Update user phone number"}) {
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [name, setName] = useState(v?.PhoneNumber);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();

    async function handleFinish() {
        setIsWorking(true);
        const result = await getAxios(`user/update/phone?username=${v?.Username}&name=${name}`)
            .catch(ajaxError)
            .finally(() => setIsWorking(false));

        if (result) {
            mutate({...v, PhoneNumber: result}, true);
            setOpen(false);
            //setName("");
            toast("User updated successfully", "success");
        }
    }


    return <div className="flex items-start space-x-6">
        {v?.PhoneNumber ? <div className="flex space-x-2 items-center"><PhoneCall/> <a
            href={`tel:+${v?.PhoneNumber}`}>{v?.PhoneNumber}</a></div> : <span>phone no not available</span>}

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
                    <TextInput
                        label="Enter phone number"
                        placeholder="Enter phone number"
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