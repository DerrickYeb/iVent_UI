import PartialHeader from "../Helpers/PartialHeader";
import DashboardSvg from "../Svgicons/DashboardSvg";
import SideMenu from "../Helpers/SideMenu";
import React, {useState} from "react";
import SettingsSvg from "../Svgicons/SettingsSvg";
import {Button, TextInput, Select, Tabs} from '@mantine/core';
import {TextField} from "@material-ui/core";
import {StockExpiringTimeTrackingObj} from "../Helpers/Constants";
import {Info} from "react-feather";
import TabLabelWidget from "../Widgets/TabLabelWidget";
import StocksPriceFormulaSettingsWidget from "../Widgets/StocksPriceFormulaSettingsWidget";

export default function ViewGeneralSettings() {
    const [name, setName] = useState("");
    const [currencyMode, setCurrencyMode] = useState("");
    const [desc, setDesc] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [email, setEmail] = useState("");
    const [invoiceNote, setInvoiceNote] = useState("");
    const [expireTimeTracking, setExpireTimeTracking] = useState("");
    const [isWorking, setIsWorking] = useState(false);
    return <SideMenu>
        <PartialHeader title="Setups > General Settings" icon={<SettingsSvg/>}/>
        <Tabs variant="default">
            <Tabs.Tab  label={<TabLabelWidget title="Inventory Settings"/>}>
                <div className="p-4 bg-white shadow w-full mx-auto mb-4">
                    <div className="grid gap-4 grid-cols-2">
                        <div>
                            <TextInput placeholder="Inventory id" label="Inventory Id" value="23783U23D2" readOnly
                                       variant={"filled"}/>
                        </div>
                        <div>
                            <TextInput placeholder="Inventory Name" label={"Inventory Name"} value={name}
                                       onChange={(e) => setName(e.target.value)} variant={"filled"}/>
                        </div>
                    </div>
                    <div className={"mt-2"}>
                        <TextField fullWidth variant="filled" color="default" label="Inventory Description"
                                   placeholder={"Inventory description"} multiline={true}
                                   minRows={2}
                                   maxRows={5}
                                   value={desc}
                                   onChange={(e) => setDesc(e.target.value)}

                        />
                    </div>
                    <div className="grid gap-4 grid-cols-2">
                        <div>
                            <TextInput placeholder="Telephone no" label={"Telephone No"} value={phoneNo}
                                       onChange={(e) => setPhoneNo(e.target.value)} variant={"filled"}/>
                        </div>
                        <div>
                            <TextInput placeholder="Email address" label={"Email Address"} value={email}
                                       onChange={(e) => setEmail(e.target.value)} variant={"filled"}/>
                        </div>
                    </div>
                    <div className={"mt-2"}>
                        <TextField fullWidth variant="filled" color="default" label="Invoice note"
                                   placeholder={"Invoice note"} multiline={true}
                                   minRows={2}
                                   maxRows={5}
                                   value={invoiceNote}
                                   onChange={(e) => setInvoiceNote(e.target.value)}
                        />
                    </div>
                    <div className={"mt-2"}>
                        <Select data={StockExpiringTimeTrackingObj} value={expireTimeTracking}
                                onChange={(e) => setExpireTimeTracking(e)} clearable={true}
                                label="Set Store Expiring Time Tracking" placeholder="Set Store Expiring Time Tracking" variant={"filled"}/>

                    </div>
                    <div className={"mt-2 flex justify-end"}>
                        <Button loading={isWorking}>Update</Button>
                    </div>
                </div>
            </Tabs.Tab>

            <Tabs.Tab label={"Stocks Price Formula Settings"}>
              <StocksPriceFormulaSettingsWidget/>
            </Tabs.Tab>

        </Tabs>

    </SideMenu>
}