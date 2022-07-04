import React, {useState} from "react";
import {TextInput, Button, Alert} from '@mantine/core';
import {Percent, Info} from "react-feather";


export default function StocksPriceFormulaSettingsWidget() {
    const [name, setName] = useState("DemoForumla");
    const [percentage, setPercentage] = useState(12);
    const [isWorking, setIsWorking] = useState(false);

    return <div className="p-4 bg-white shadow rounded w-2/5 mx-auto mt-4 mb-4">
        <div className="mb-6">
            <Alert title="Info" icon={<Info/>} variant="filled" color={"yellow"}>Changing the percentage will apply to
                all stocks. Except those in pending or completed sales order.</Alert>
        </div>
        <div className="grid gap-4 grid-cols-1">
            <TextInput label={"Formula name"} placeholder="Formula name" variant="filled" value={name}
                       onChange={(e) => setName(e.target.value)}/>

            <TextInput label={"Formula percentage"} placeholder="Formula percentage" variant="filled" value={percentage}
                       onChange={(e) => setPercentage(e.target.value)}
                       icon={<Percent/>}/>

            <div className="flex justify-end">
                <Button loading={isWorking}>Save</Button>
            </div>
        </div>
    </div>
}