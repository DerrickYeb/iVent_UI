import {Avatar, ActionIcon, Button, Select, TextInput} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {Edit3, Plus, PlusCircle} from "react-feather";
import {BasicModalUtils} from "../../../modals/ModalUtils";
import {formatDate, OrderReminderPeriod, SalutationToArray} from "../../../Helpers/Constants";
import useAjaxError from "../../../Helpers/useAjaxError";
import useToasts from "../../../Helpers/MyToasts";
import {postAxios} from "../../../Helpers/API";

export default function ContactPersons({data: v, onDone}) {
    const [open, setOpen] = useState(false);
    const [ajaxError] = useAjaxError();
    const [isWorking, setIsWorking] = useState(false);
    const [toast] = useToasts();
    const [salutation, setSalutation] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    async function handleUpdate() {
        if (!salutation) return toast("Salutation is required");
        if (!name) return toast("Contact name is required");
        if (!email) return toast("Contact email is required");
        setIsWorking(true);
        let payload = {
            CustomerId: v.CustomerId,
            Salutation: salutation,
            Fullname: name,
            EmailAddress: email,
            PhoneNo: phone,
        };
        const result = await postAxios("customers/add/contact/person", payload)
            .catch(ajaxError)
            .finally(() => {
                setIsWorking(false);
            });
        if (result) {
            setOpen(false);
            toast("Customer contact updated successfully", "success");
            setName("");
            setSalutation("");
            setEmail("");
            setPhone("");
            onDone(result);
        }
    }


    return <div>
        <div className="flex items-center justify-end pr-4">
            <Button variant={"white"} loading={isWorking} leftIcon={<PlusCircle size={16}/>} onClick={() => setOpen(true)}>Add</Button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
            {v && v.ContactPersons && v.ContactPersons.map((v, i) =>
            <EachContact key={v?.Id} data={v} onDone={(obj) => onDone(obj)}/>)}
        </div>


        {open && <BasicModalUtils
            open={open}
            onClose={() => setOpen(false)}
            title={"Edit Customer Contact Info"}
            size="xs"
            zIndex={200}
            okBtn={<Button loading={isWorking} onClick={() => handleUpdate()}>Save</Button>}
        >

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Select
                        data={SalutationToArray() || []}
                        label="Salutation"
                        placeholder="Salutation"
                        value={salutation} onChange={(e) => setSalutation(e)}
                        variant={"filled"}
                        required={true}
                        clearable={true}
                        searchable={true}
                    />
                </div>
                <div>
                    <TextInput
                        label="Contact Name"
                        placeholder="Contact Name"
                        value={name}
                        variant={"filled"}
                        required={true}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <TextInput
                        label="Contact Email"
                        placeholder="Contact Email"
                        value={email}
                        variant={"filled"}
                        onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div>
                    <TextInput
                        label="Contact Phone"
                        placeholder="Contact Phone"
                        value={phone}
                        variant={"filled"}
                        onChange={(e) => setPhone(e.target.value)}/>
                </div>


            </div>
        </BasicModalUtils>}

    </div>
}

function EachContact({data: v, onDone}) {
    const [open, setOpen] = useState(false);
    const [ajaxError] = useAjaxError();
    const [isWorking, setIsWorking] = useState(false);
    const [toast] = useToasts();
    const [salutation, setSalutation] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        setSalutation(v?.Salutation)
        setName(v?.Fullname);
        setEmail(v?.EmailAddress);
        setPhone(v?.PhoneNo);
    }, [v]);

    async function handleUpdate() {
        if (!salutation) return toast("Salutation is required");
        if (!name) return toast("Contact name is required");
        if (!email) return toast("Contact email is required");
        setIsWorking(true);
        let payload = {
            Id:v?.Id,
            CustomerId: v.CustomerId,
            Salutation: salutation,
            Fullname: name,
            EmailAddress: email,
            PhoneNo: phone,
        };
        const result = await postAxios("customers/update/customer/contact/person", payload)
            .catch(ajaxError)
            .finally(() => {
                setIsWorking(false);
            });
        if (result) {
            setOpen(false);
            toast("Customer contact updated successfully", "success");
            onDone(result);
        }
    }

    async function handleDelete() {
        setIsWorking(true);
        let payload = {
            CustomerId: v.CustomerId,
            Id: v?.Id
        };
        const result = await postAxios("customers/delete/contact/person", payload)
            .catch(ajaxError)
            .finally(() => {
                setIsWorking(false);
            });
        if (result) {
            setOpen(false);
            toast("Customer contact updated successfully", "success");
            onDone(result);
        }
    }

    return <div>
        <div
            className="flex space-x-4 mb-4" key={v?.Id}>
            <div>
                <Avatar size={"lg"} radius={"xl"}/>
            </div>
            <div className="flex flex-col">
                                        <span
                                            className="font-semibold text-base">{v?.Salutation}&nbsp;{v?.Fullname}</span>
                <span className="text-gray-600 text-xs">{v?.EmailAddress}</span>
                <span className="text-gray-600 text-xs"><svg xmlns="http://www.w3.org/2000/svg"
                                                             className="h-3 w-3 inline"
                                                             fill="none"
                                                             viewBox="0 0 24 24"
                                                             stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
</svg>
                    {v?.PhoneNo}</span>
            </div>
            <div>
                <ActionIcon onClick={() => setOpen(true)}>
                    <Edit3/>
                </ActionIcon>
            </div>
        </div>

        {open && <BasicModalUtils
            open={open}
            onClose={() => setOpen(false)}
            title={"Edit Customer Contact Info"}
            size="xs"
            zIndex={200}
            okBtn={<Button loading={isWorking} onClick={() => handleUpdate()}>Save</Button>}
            closeBtn={<Button loading={isWorking} onClick={() => handleDelete()} color={"red"}
                              variant={"white"}>Delete</Button>}
        >

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Select
                        data={SalutationToArray() || []}
                        label="Salutation"
                        placeholder="Salutation"
                        value={salutation} onChange={(e) => setSalutation(e)}
                        variant={"filled"}
                        required={true}
                        clearable={true}
                        searchable={true}
                    />
                </div>
                <div>
                    <TextInput
                        label="Contact Name"
                        placeholder="Contact Name"
                        value={name}
                        variant={"filled"}
                        required={true}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <TextInput
                        label="Contact Email"
                        placeholder="Contact Email"
                        value={email}
                        variant={"filled"}
                        onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div>
                    <TextInput
                        label="Contact Phone"
                        placeholder="Contact Phone"
                        value={phone}
                        variant={"filled"}
                        onChange={(e) => setPhone(e.target.value)}/>
                </div>


            </div>
        </BasicModalUtils>}


    </div>
}