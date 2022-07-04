import React, {useEffect, useState} from "react";
import useAjaxError from "../../../Helpers/useAjaxError";
import useToasts from "../../../Helpers/MyToasts";
import {postAxios} from "../../../Helpers/API";
import {Button, Select, Tabs, Textarea, TextInput} from "@mantine/core";
import {Edit3} from "react-feather";
import {formatDate, OrderReminderPeriod, SalutationToArray} from "../../../Helpers/Constants";
import {BasicModalUtils} from "../../../modals/ModalUtils";


export default function Addresses({data: customerDetails, onDone}) {
    const [openBillingModal, setOpenBillingModal] = useState(false);
    const [openShippingModal, setOpenShippingModal] = useState(false);
    const [ajaxError] = useAjaxError();
    const [isWorking, setIsWorking] = useState(false);
    const [toast] = useToasts();
    const [billingObj, setBillingObj] = useState({
        country: "Ghana",
        city: "",
        state: "",
        addressOne: "",
        addressTwo: "",
        zipCode: "",
        phone: "",
        fax: ""
    });

    const [shippingObj, setShippingObj] = useState({
        country: "Ghana",
        city: "",
        state: "",
        addressOne: "",
        addressTwo: "",
        zipCode: "",
        phone: "",
        fax: ""
    });


    useEffect(() => {
        setBillingObj({
            ...billingObj,
            country: customerDetails?.BillingAddress?.Country,
            city: customerDetails?.BillingAddress?.City,
            state: customerDetails?.BillingAddress?.State,
            addressOne: customerDetails?.BillingAddress?.AddressOne,
            addressTwo: customerDetails?.BillingAddress?.AddressTwo,
            zipCode: customerDetails?.BillingAddress?.ZipCode,
            phone: ""
        });


        setShippingObj({
            ...shippingObj,
            country: customerDetails?.ShippingAddress?.Country,
            city: customerDetails?.ShippingAddress?.City,
            state: customerDetails?.ShippingAddress?.State,
            addressOne: customerDetails?.ShippingAddress?.AddressOne,
            addressTwo: customerDetails?.ShippingAddress?.AddressTwo,
            zipCode: customerDetails?.ShippingAddress?.ZipCode,
            phone: ""
        })
    }, [customerDetails]);

    async function handleBillingUpdate() {
        setIsWorking(true);
        let payload = {
            CustomerId: customerDetails.CustomerId,
            AddressOne: billingObj.addressOne,
            AddressTwo: billingObj.addressTwo,
            Country: billingObj.country,
            State: billingObj.state,
            ZipCode: billingObj.zipCode,
            Phone: billingObj.phone,
            City:billingObj.city
        };
        const result = await postAxios("customers/update/customer/billing/address", payload)
            .catch(ajaxError)
            .finally(() => {
                setIsWorking(false);
            });
        if (result) {
            setOpenBillingModal(false);
            toast("Customer billing address successfully", "success");
            onDone(result);
        }
    }

    async function handleShippingUpdate() {
        setIsWorking(true);
        let payload = {
            CustomerId: customerDetails.CustomerId,
            AddressOne: shippingObj.addressOne,
            AddressTwo: shippingObj.addressTwo,
            Country: shippingObj.country,
            State: shippingObj.state,
            ZipCode: shippingObj.zipCode,
            Phone: shippingObj.phone,
            City:shippingObj.city
        };
        const result = await postAxios("customers/update/customer/shipping/address", payload)
            .catch(ajaxError)
            .finally(() => {
                setIsWorking(false);
            });
        if (result) {
            setOpenShippingModal(false);
            toast("Customer shipping address successfully", "success");
            onDone(result);
        }
    }


    return <div className="grid grid-cols-2 gap-8 p-4">
        <div>
            <div className="uppercase mb-2 font-semibold flex items-center justify-between">
                Billing Address
                <Button size={"xs"} variant={"white"} leftIcon={<Edit3 size={16}/>}
                        onClick={() => setOpenBillingModal(true)}>Update</Button>
            </div>
            <div className="grid gap-4 grid-cols-2 text-xs text-gray-500">
                <b>Country</b>
                <span>{customerDetails?.BillingAddress?.Country}</span>

                <b>City</b>
                <span>{customerDetails?.BillingAddress?.City}</span>

                <b>State</b>
                <span>{customerDetails?.BillingAddress?.State}</span>

                <b>Address One</b>
                <span>{customerDetails?.BillingAddress?.AddressOne}</span>

                <b>Address Two</b>
                <span>{customerDetails?.BillingAddress?.AddressTwo}</span>

                <b>Zip Code</b>
                <span>{customerDetails?.BillingAddress?.ZipCode}</span>

                <b>Phone</b>
                <span>{customerDetails?.BillingAddress?.Phone}</span>
            </div>
        </div>

        <div>
            {/*    shipping address*/}

            <div className="uppercase mb-2 font-semibold flex items-center justify-between">
                Shipping Address
                <Button size={"xs"} variant={"white"} leftIcon={<Edit3 size={16}/>}
                        onClick={() => setOpenShippingModal(true)}>Update</Button>
            </div>
            <div className="grid gap-4 grid-cols-2 text-xs text-gray-500">
                <b>Country</b>
                <span>{customerDetails?.ShippingAddress?.Country}</span>

                <b>City</b>
                <span>{customerDetails?.ShippingAddress?.City}</span>

                <b>State</b>
                <span>{customerDetails?.ShippingAddress?.State}</span>

                <b>Address One</b>
                <span>{customerDetails?.ShippingAddress?.AddressOne}</span>

                <b>Address Two</b>
                <span>{customerDetails?.ShippingAddress?.AddressTwo}</span>

                <b>Zip Code</b>
                <span>{customerDetails?.ShippingAddress?.ZipCode}</span>

                <b>Phone</b>
                <span>{customerDetails?.ShippingAddress?.Phone}</span>
            </div>
        </div>


        {/*     billing modal*/}
        {openBillingModal && <BasicModalUtils
            open={openBillingModal}
            onClose={() => setOpenBillingModal(false)}
            title={"Edit Customer Billing Address"}
            size="xs"
            zIndex={200}
            okBtn={<Button loading={isWorking} onClick={() => handleBillingUpdate()}>Save</Button>}
        >
            {/*    billing address*/}
            <div className="grid gap-4 grid-cols-1">
                <div>
                    <TextInput
                        label="Country"
                        placeholder="Country"
                        value={billingObj.country}
                        variant={"filled"}
                        onChange={(e) => setBillingObj(
                            {
                                ...billingObj,
                                country: e.target.value
                            })}/>
                </div>

                <div className="flex items-center space-x-4">
                    <TextInput
                        label="City"
                        placeholder="City"
                        value={billingObj.city}
                        variant={"filled"}
                        onChange={(e) => setBillingObj(
                            {
                                ...billingObj,
                                city: e.target.value
                            })}/>

                    <TextInput
                        label="State"
                        placeholder="State"
                        value={billingObj.state}
                        variant={"filled"}
                        onChange={(e) => setBillingObj(
                            {
                                ...billingObj,
                                state: e.target.value
                            })}/>
                </div>

                <div>
                    <Textarea
                        label="Address one"
                        placeholder="Address one"
                        value={billingObj.addressOne}
                        variant={"filled"}
                        minRows={1}
                        maxRows={3}
                        autosize
                        onChange={(e) => setBillingObj(
                            {
                                ...billingObj,
                                addressOne: e.target.value
                            })}/>
                </div>

                <div>
                    <Textarea
                        label="Address two"
                        placeholder="Address two"
                        value={billingObj.addressTwo}
                        variant={"filled"}
                        minRows={1}
                        maxRows={3}
                        autosize
                        onChange={(e) => setBillingObj(
                            {
                                ...billingObj,
                                addressTwo: e.target.value
                            })}/>
                </div>

                <div className="flex items-center space-x-4">
                    <TextInput
                        label="Zip Code"
                        placeholder="Zip Code"
                        value={billingObj.zipCode}
                        variant={"filled"}
                        onChange={(e) => setBillingObj(
                            {
                                ...billingObj,
                                zipCode: e.target.value
                            })}/>

                    <TextInput
                        label="Phone"
                        placeholder="phone"
                        value={billingObj.phone}
                        variant={"filled"}
                        onChange={(e) => setBillingObj(
                            {
                                ...billingObj,
                                phone: e.target.value
                            })}/>
                </div>

            </div>
        </BasicModalUtils>}


        {/*    shipping modal*/}
        {openShippingModal && <BasicModalUtils
            open={openShippingModal}
            onClose={() => setOpenShippingModal(false)}
            title={"Edit Customer Shipping Address"}
            size="xs"
            zIndex={200}
            okBtn={<Button loading={isWorking} onClick={() => handleShippingUpdate()}>Save</Button>}
        >
            <div className="grid gap-4 grid-cols-1">
                <div>
                    <TextInput
                        label="Country"
                        placeholder="Country"
                        value={shippingObj.country}
                        variant={"filled"}
                        onChange={(e) => setShippingObj(
                            {
                                ...shippingObj,
                                country: e.target.value
                            })}/>
                </div>

                <div className="flex items-center space-x-4">
                    <TextInput
                        label="City"
                        placeholder="City"
                        value={shippingObj.city}
                        variant={"filled"}
                        onChange={(e) => setShippingObj(
                            {
                                ...shippingObj,
                                city: e.target.value
                            })}/>

                    <TextInput
                        label="State"
                        placeholder="State"
                        value={shippingObj.state}
                        variant={"filled"}
                        onChange={(e) => setShippingObj(
                            {
                                ...shippingObj,
                                state: e.target.value
                            })}/>
                </div>

                <div>
                    <Textarea
                        label="Address one"
                        placeholder="Address one"
                        value={shippingObj.addressOne}
                        variant={"filled"}
                        minRows={1}
                        maxRows={3}
                        autosize
                        onChange={(e) => setShippingObj(
                            {
                                ...shippingObj,
                                addressOne: e.target.value
                            })}/>
                </div>

                <div>
                    <Textarea
                        label="Address two"
                        placeholder="Address two"
                        value={shippingObj.addressTwo}
                        variant={"filled"}
                        minRows={1}
                        maxRows={3}
                        autosize
                        onChange={(e) => setShippingObj(
                            {
                                ...shippingObj,
                                addressTwo: e.target.value
                            })}/>
                </div>

                <div className="flex items-center space-x-4">
                    <TextInput
                        label="Zip Code"
                        placeholder="Zip Code"
                        value={shippingObj.zipCode}
                        variant={"filled"}
                        onChange={(e) => setShippingObj(
                            {
                                ...shippingObj,
                                zipCode: e.target.value
                            })}/>

                    <TextInput
                        label="Phone"
                        placeholder="phone"
                        value={shippingObj.phone}
                        variant={"filled"}
                        onChange={(e) => setShippingObj(
                            {
                                ...shippingObj,
                                phone: e.target.value
                            })}/>
                </div>

            </div>

        </BasicModalUtils>}


    </div>
}