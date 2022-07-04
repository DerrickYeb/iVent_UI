import React, {useEffect, useState} from "react";
import useAjaxError from "../../../Helpers/useAjaxError";
import useToasts from "../../../Helpers/MyToasts";
import {postAxios} from "../../../Helpers/API";
import {Button, Select, TextInput} from "@mantine/core";
import {Edit3} from "react-feather";
import {formatDate, OrderReminderPeriod, SalutationToArray} from "../../../Helpers/Constants";
import {BasicModalUtils} from "../../../modals/ModalUtils";

export default function OtherDetails({data: customerDetails, onDone}) {
    const [open, setOpen] = useState(false);
    const [ajaxError] = useAjaxError();
    const [isWorking, setIsWorking] = useState(false);
    const [toast] = useToasts();
    const [obj, setObj] = useState({
        salutation: customerDetails?.Salutation,
        name: customerDetails?.CustomerName,
        email: customerDetails?.CustomerEmail,
        phone: customerDetails?.CustomerPhone,
        workPhone: customerDetails?.CustomerWorkPhone,
        paymentTerms: customerDetails?.PaymentTerms
    });

    useEffect(() => {
        setObj({
            ...obj,
            salutation: customerDetails?.Salutation,
            name: customerDetails?.CustomerName,
            email: customerDetails?.CustomerEmail,
            phone: customerDetails?.CustomerPhone,
            workPhone: customerDetails?.CustomerWorkPhone,
            paymentTerms: customerDetails?.PaymentTerms
        })
    }, [customerDetails]);

    async function handleUpdate() {
        if (!obj.salutation) return toast("Salutation is required");
        if (!obj.name) return toast("Customer name is required");
        setIsWorking(true);
        let payload = {
            CustomerId: customerDetails.CustomerId,
            Salutation: obj.salutation,
            CustomerName: obj.name,
            CustomerEmail: obj.email,
            CustomerPhone: obj.phone,
            CustomerWorkPhone: obj.workPhone,
            PaymentTerms: obj.paymentTerms
        };
        const result = await postAxios("customers/update/customer/basic/info", payload)
            .catch(ajaxError)
            .finally(() => {
                setIsWorking(false);
            });
        if (result) {
            setOpen(false);
            toast("Customer updated successfully", "success");
            onDone(result);
        }
    }


    return <div>
        <div className="flex items-center justify-end pr-4">
            <Button variant={"white"} leftIcon={<Edit3 size={20}/>} onClick={() => setOpen(true)}>Update</Button>
        </div>
        <div className="grid gap-4 grid-cols-1 p-4">

            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                <b>Customer Fullname</b>
                <span className="font-semibold">{customerDetails?.CustomerName}</span>
            </div>

            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                <b>Salutation</b>
                <span className="font-semibold">{customerDetails?.Salutation}</span>
            </div>


            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                <b>Phone No</b>
                <span className="font-semibold">{customerDetails?.CustomerPhone}</span>
            </div>

            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                <b>Work Phone</b>
                <span className="font-semibold">{customerDetails?.CustomerWorkPhone}</span>
            </div>

            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                <b>Email Address</b>
                <span className="font-semibold">{customerDetails?.CustomerEmail}</span>
            </div>

            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                <b>Company</b>
                <span className="font-semibold">{customerDetails?.CompanyName}</span>
            </div>

            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                <b>Department</b>
                <span className="font-semibold">{customerDetails?.CustomerDepartment}</span>
            </div>

            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                <b>Designation</b>
                <span className="font-semibold">{customerDetails?.CustomerDesignation}</span>
            </div>

            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                <b>Payment Terms</b>
                <span className="font-semibold">{customerDetails?.PaymentTerms}</span>
            </div>

            <div className="flex items-center space-x-8 text-gray-500 text-xs">
                <b>Reg Date</b>
                <span className="font-semibold">{formatDate(customerDetails?.Dated)}</span>
            </div>
        </div>

        {open && <BasicModalUtils
            open={open}
            onClose={() => setOpen(false)}
            title={"Edit Customer Basic Info"}
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
                        value={obj.salutation} onChange={(e) => setObj({...obj, salutation: e})}
                        variant={"filled"}
                        required={true}
                        clearable={true}
                        searchable={true}
                    />
                </div>
                <div>
                    <TextInput
                        label="Name"
                        placeholder="Name"
                        value={obj.name}
                        variant={"filled"}
                        required={true}
                        onChange={(e) => setObj(
                            {
                                ...obj,
                                name: e.target.value
                            })}/>
                </div>

                <div>
                    <TextInput
                        label="Email"
                        placeholder="Email"
                        value={obj.email}
                        variant={"filled"}
                        onChange={(e) => setObj(
                            {
                                ...obj,
                                email: e.target.value
                            })}/>
                </div>
                <div>
                    <TextInput
                        label="Mobile Phone"
                        placeholder="Mobile Phone"
                        value={obj.phone}
                        variant={"filled"}
                        onChange={(e) => setObj(
                            {
                                ...obj,
                                phone: e.target.value
                            })}/>
                </div>


                <div>
                    <TextInput
                        label="Work Phone"
                        placeholder="Work Phone"
                        value={obj.workPhone}
                        variant={"filled"}
                        onChange={(e) => setObj(
                            {
                                ...obj,
                                workPhone: e.target.value
                            })}/>
                </div>

                <div>
                    <Select variant={"filled"} data={OrderReminderPeriod || []} placeholder="Payment Terms"
                            label="Payment Terms" clearable={true} searchable={true} value={obj.paymentTerms}
                            onChange={(e) => setObj({
                                ...obj,
                                paymentTerms: e
                            })}/>
                </div>
            </div>


        </BasicModalUtils>}

    </div>
}