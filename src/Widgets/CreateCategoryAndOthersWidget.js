import React, {useState} from "react";
import {ActionIcon, Tooltip, Button, TextInput} from "@mantine/core";
import {Plus} from "react-feather";
import {useSWRConfig} from "swr";
import {BasicModalUtils} from "../modals/ModalUtils";
import useAjaxError from "../Helpers/useAjaxError";
import useToasts from "../Helpers/MyToasts";
import DOMPurify from "dompurify";
import {postAxios} from "../Helpers/API";
import {InputField, TextField} from '@material-ui/core';


//create category widget
export function CreateCategoryWidget({smallIcon = true, onDone}) {
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [name, setName] = useState("");
    const [toast] = useToasts();
    const [ajaxError] = useAjaxError();
    const {mutate} = useSWRConfig()

    async function createCategory() {
        if (!name) return toast("Category name is required", "info")
        const sanitizeStr = DOMPurify.sanitize(name);
        setIsWorking(true);
        let payload = {
            CategoryName: sanitizeStr
        }
        const result = await postAxios("categories/new/category", payload).catch((err) => {
            setIsWorking(false);
            ajaxError(err);
        });
        if (result) {
            await mutate("get/categories/lov");
            setIsWorking(false);
            setOpen(false);
            setName("");
        }
    }

    return <React.Fragment>
        {smallIcon ?
            <Tooltip label="Quick create new category"><ActionIcon
                onClick={() => setOpen(true)}><Plus/></ActionIcon></Tooltip>
            : null}

        {/*    modal start */}
        <BasicModalUtils open={open} onClose={() => setOpen(false)} title="Quick create category"
                         okBtn={<Button size={"xs"} loading={isWorking}
                                        onClick={() => createCategory()}>Create</Button>}
                         size="xs">
            <div>
                <TextInput label="Enter category name" placeholder="Enter category name" required={true}
                           error={!name}
                           variant="filled" value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
        </BasicModalUtils>
        {/*    modal end */}
    </React.Fragment>
}


//create brand widget
export function CreateBrandWidget({smallIcon = true, onDone}) {
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [name, setName] = useState("");
    const [toast] = useToasts();
    const [ajaxError] = useAjaxError();
    const {mutate} = useSWRConfig()

    async function createBrand() {
        if (!name) return toast("Brand name is required", "info")
        const sanitizeStr = DOMPurify.sanitize(name);
        setIsWorking(true);
        let payload = {
            BrandName: sanitizeStr
        }
        const result = await postAxios("brands/new/brand", payload).catch((err) => {
            setIsWorking(false);
            ajaxError(err);
        });
        if (result) {
            await mutate("get/brands/lov");
            setIsWorking(false);
            setOpen(false);
            setName("");
        }
    }

    return <React.Fragment>
        {smallIcon ?
            <Tooltip label="Quick create new brand"><ActionIcon
                onClick={() => setOpen(true)}><Plus/></ActionIcon></Tooltip>
            : null}

        {/*    modal start */}
        <BasicModalUtils open={open} onClose={() => setOpen(false)} title="Quick create brand"
                         okBtn={<Button size={"xs"} loading={isWorking}
                                        onClick={() => createBrand()}>Create</Button>}
                         size="xs">
            <div>
                <TextInput label="Enter brand name" placeholder="Enter brand name" required={true}
                           error={!name}
                           variant="filled" value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
        </BasicModalUtils>
        {/*    modal end */}
    </React.Fragment>
}


//create manufacturer widget
export function CreateManufacturerWidget({smallIcon = true, onDone}) {
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [name, setName] = useState("");
    const [toast] = useToasts();
    const [ajaxError] = useAjaxError();
    const {mutate} = useSWRConfig()

    async function createManufacturer() {
        if (!name) return toast("Manufacturer name is required", "info")
        const sanitizeStr = DOMPurify.sanitize(name);
        setIsWorking(true);
        let payload = {
            ManufacturerName: sanitizeStr
        }
        const result = await postAxios("manufacturers/new/manufacturer", payload).catch((err) => {
            setIsWorking(false);
            ajaxError(err);
        });
        if (result) {
            await mutate("get/manufacturers/lov");
            setIsWorking(false);
            setOpen(false);
            setName("");
        }
    }

    return <React.Fragment>
        {smallIcon ?
            <Tooltip label="Quick create new manufacturer"><ActionIcon
                onClick={() => setOpen(true)}><Plus/></ActionIcon></Tooltip>
            : null}

        {/*    modal start */}
        <BasicModalUtils open={open} onClose={() => setOpen(false)} title="Quick create manufacturer"
                         okBtn={<Button size={"xs"} loading={isWorking}
                                        onClick={() => createManufacturer()}>Create</Button>}
                         size="xs">
            <div>
                <TextInput label="Enter manufacturer name" placeholder="Enter manufacturer name" required={true}
                           error={!name}
                           variant="filled" value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
        </BasicModalUtils>
        {/*    modal end */}
    </React.Fragment>
}

//create supplier widget
export function CreateSupplierWidget({smallIcon = true, onDone}) {
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [address, setAddress] = useState("");
    const [toast] = useToasts();
    const [ajaxError] = useAjaxError();
    const {mutate} = useSWRConfig()

    async function createBrand() {
        if (!name) return toast("Supplier name is required", "info")
        const sanitizeName = DOMPurify.sanitize(name);
        const sanitizeAddress = DOMPurify.sanitize(address)
        setIsWorking(true);
        let payload = {
            SupplierName: sanitizeName,
            SupplierEmail: email,
            SupplierPhoneNo: phoneNo,
            SupplierAddress: sanitizeAddress
        }
        const result = await postAxios("suppliers/new/supplier", payload).catch((err) => {
            setIsWorking(false);
            ajaxError(err);
        });
        if (result) {
            await mutate("get/suppliers/lov");
            setIsWorking(false);
            clearStates();
            setOpen(false);
        }
    }

    function clearStates() {

        setName("");
        setEmail("");
        setPhoneNo("");
        setAddress("");
    }

    return <React.Fragment>
        {smallIcon ?
            <Tooltip label="Quick create new supplier"><ActionIcon
                onClick={() => setOpen(true)}><Plus/></ActionIcon></Tooltip>
            : null}

        {/*    modal start */}
        <BasicModalUtils open={open} onClose={() => setOpen(false)} title="Quick create supplier"
                         okBtn={<Button size={"xs"} loading={isWorking}
                                        onClick={() => createBrand()}>Create</Button>}
                         size="xs">

            <div>
                {/*name*/}
                <TextInput label="Enter supplier name" placeholder="Enter supplier name" required={true}
                           error={!name}
                           variant="filled" value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="grid gap-2 grid-cols-2 my-4">

                {/*email*/}
                <TextInput label="Enter supplier email" placeholder="Enter supplier email"
                           variant="filled" value={email} onChange={(e) => setEmail(e.target.value)}/>
                {/*phone*/}
                <TextInput label="Enter supplier phone" placeholder="Enter supplier phone"
                           variant="filled" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)}/>
            </div>
            <div className="w-full">
                {/*address*/}
                <TextField fullWidth={true}
                           multiline={true}
                           label="Enter supplier address" placeholder="Enter supplier address"
                           variant="filled" value={address} onChange={(e) => setAddress(e.target.value)}
                           minRows={2}
                           maxRows={4}
                />
            </div>
        </BasicModalUtils>
        {/*    modal end */}
    </React.Fragment>
}