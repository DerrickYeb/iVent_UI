import React, {useState} from 'react';
import {Button, Loader, TextInput, Select, Tabs, Textarea, Table, ActionIcon} from "@mantine/core";
import {OrderReminderPeriod, SalutationToArray} from "../../Helpers/Constants";
import TabLabelWidget from "../../Widgets/TabLabelWidget";
import {cloneDeep} from "lodash";
import {XCircle} from "react-feather";
import useAjaxError from "../../Helpers/useAjaxError";
import useToasts from "../../Helpers/MyToasts";
import {useRecoilState} from "recoil";
import {CustomersListStore} from "../../Store/Store";
import {useHistory} from "react-router-dom";
import {postAxios} from "../../Helpers/API";
import {AllCustomersUrl, AllInventoryUrl} from "../../Helpers/UrlHelper";

const contactObj = {
    salutation: "",
    fullname: "",
    email: "",
    phone: ""
}

export default function NewCustomer({open, onClose}) {
    const [data, setData] = useRecoilState(CustomersListStore);
    const [isWorking, setIsWorking] = useState(false);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();
    const history = useHistory();

    const [obj, setObj] = useState({
        salutation: "",
        name: "",
        email: "",
        phone: "",
        avatar: "",
        companyName: "",
        workPhone: "",
        designation: "",
        department: "",
        website: "",
        paymentTerms: ""
    });
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

    const [contactPersons, setContactPersons] = useState([]);
    const clonePersonsArr = cloneDeep(contactPersons);


    const rows = contactPersons.map((element, index) => (
        <tr>
            <td>{<Select
                data={SalutationToArray() || []}
                onChange={(e) => {
                    clonePersonsArr[index].salutation = e;
                    setContactPersons(clonePersonsArr);
                }} className="w-24" variant={"filled"}/>}</td>
            <td>{<TextInput
                value={element.fullname}
                onChange={(e) => {
                    clonePersonsArr[index].fullname = e.target.value;
                    setContactPersons(clonePersonsArr);
                }} variant={"filled"}/>}</td>
            <td>{<TextInput
                value={element.email}
                onChange={(e) => {
                    clonePersonsArr[index].email = e.target.value;
                    setContactPersons(clonePersonsArr);
                }} variant={"filled"}/>}</td>
            <td>{<TextInput
                value={element.phone}
                onChange={(e) => {
                    clonePersonsArr[index].phone = e.target.value;
                    setContactPersons(clonePersonsArr);
                }} variant={"filled"}/>}</td>
            <td>
                <ActionIcon
                    onClick={() => handleOnRemove(element.fullname, index)}
                    color={"red"} size={"xs"}
                    radius={"xl"}><XCircle/></ActionIcon>
            </td>
        </tr>
    ));

    function handleOnRemove(fullname, index) {
        const arr = clonePersonsArr.filter((x) => x.fullname !== fullname);
        if (arr) setContactPersons(arr);
    }

    async function saveData() {
        if (!obj.salutation) return toast("Salutation is required");
        if (!obj.name) return toast("Customer name is required");

        const output = [];
        contactPersons.forEach((value, _) => {
            let obj = {
                Salutation: value.salutation,
                Fullname: value.fullname,
                EmailAddress: value.email,
                PhoneNo: value.phone
            };
            output.push(obj);
        });

        let payload = {
            Customer: {
                Salutation: obj.salutation,
                CustomerName: obj.name,
                CustomerEmail: obj.email,
                CustomerPhone: obj.phone,
                CustomerWorkPhone: obj.workPhone,
                PaymentTerms: obj.paymentTerms,
                CustomerDepartment: obj.department,
                CustomerDesignation: obj.designation,
                CompanyName: obj.companyName
            },
            BillingAddress: {
                AddressOne: billingObj.addressOne,
                AddressTwo: billingObj.addressTwo,
                Country: billingObj.country,
                State: billingObj.state,
                ZipCode: billingObj.zipCode,
                Phone: billingObj.phone,
                City:billingObj.city
            },
            ShippingAddress: {
                AddressOne: shippingObj.addressOne,
                AddressTwo: shippingObj.addressTwo,
                Country: shippingObj.country,
                State: shippingObj.state,
                ZipCode: shippingObj.zipCode,
                Phone: shippingObj.phone,
                City:shippingObj.city
            },
            Contacts: output
        }

        setIsWorking(true);
        const result = await postAxios("customers/new/customer", payload).catch(ajaxError).finally(() => {
            setIsWorking(false);
        });
        if (result) {
            toast("New customer added successfully", "success");
            setData((prev) => [result, ...prev]);
            setTimeout(() => {
                history.replace(AllCustomersUrl);
            }, 1000);
        }
    }


    return <div>
        <div className="grid grid-cols-2 gap-3 mb-4">
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
                    label="Company Name"
                    placeholder="Company Name"
                    value={obj.companyName}
                    variant={"filled"}
                    onChange={(e) => setObj(
                        {
                            ...obj,
                            companyName: e.target.value
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
        </div>

        {/*tabs*/}
        <div>
            <Tabs>
                <Tabs.Tab label={<TabLabelWidget title="Other Details"/>}>

                    <div className="grid gap-4 grid-cols-3">
                        {/*<div>*/}
                        {/*    <TextInput*/}
                        {/*        label="Website"*/}
                        {/*        placeholder="Website"*/}
                        {/*        value={obj.website}*/}
                        {/*        variant={"filled"}*/}
                        {/*        onChange={(e) => setObj(*/}
                        {/*            {*/}
                        {/*                ...obj,*/}
                        {/*                website: e.target.value*/}
                        {/*            })}/>*/}
                        {/*</div>*/}
                        <div>
                            <TextInput
                                label="Designation"
                                placeholder="Designation"
                                value={obj.designation}
                                variant={"filled"}
                                onChange={(e) => setObj(
                                    {
                                        ...obj,
                                        designation: e.target.value
                                    })}/>
                        </div>
                        <div>
                            <TextInput
                                label="Department"
                                placeholder="Department"
                                value={obj.department}
                                variant={"filled"}
                                onChange={(e) => setObj(
                                    {
                                        ...obj,
                                        department: e.target.value
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


                </Tabs.Tab>
                <Tabs.Tab label={<TabLabelWidget title="Address"/>}>
                    <div className="grid gap-20 grid-cols-2 mb-2">
                        <div>
                            <span className="uppercase text-gray-700 font-semibold text-xs">Billing Address</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="uppercase text-gray-700 font-semibold text-xs">Shipping Address</span>
                            <Button leftIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                                   viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                            </svg>} variant={"white"} size={"xs"} onClick={() => setShippingObj(billingObj)}>Copy
                                Billing
                                Address</Button>
                        </div>
                    </div>
                    <div className="grid gap-20 grid-cols-2">

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


                        {/*    shipping adress*/}


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


                    </div>
                </Tabs.Tab>
                <Tabs.Tab label={<TabLabelWidget title="Contact Persons"/>}>

                    <Table>
                        <thead>
                        <tr>
                            <th>Salutation</th>
                            <th>Fullname</th>
                            <th>Email Address</th>
                            <th>Phone No</th>
                            <th>Remove</th>
                        </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table>
                    <div>
                        <Button leftIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                               viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>} variant={"white"} size={"xs"} onClick={() => handleAddContactPerson()}>Add Contact
                            Person</Button>
                    </div>

                </Tabs.Tab>
            </Tabs>
        </div>

        <div className="mt-20"/>
        {/*    save button*/}
        <div className="fixed left-0 bottom-0 w-full p-4 bg-green-200 flex items-center justify-end space-x-4">
            <Button variant={"white"} onClick={() => history.goBack()}>Cancel</Button>
            <Button color="teal" loading={isWorking} onClick={() => saveData()}>Save</Button>
        </div>

    </div>

    function handleAddContactPerson() {
        clonePersonsArr.push(contactObj);
        setContactPersons(clonePersonsArr);
    }
}