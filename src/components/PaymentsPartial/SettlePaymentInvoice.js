import React, {useState} from "react";
import useToasts from "../../Helpers/MyToasts";
import useAjaxError from "../../Helpers/useAjaxError";
import {Button, Popover, TextInput} from "@mantine/core";
import {getAxios} from "../../Helpers/API";

export default function SettlePaymentInvoice({paymentId, outstanding, onDone}) {
    const [opened, setOpened] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [toast] = useToasts();
    const [ajaxError] = useAjaxError();


    return <Popover
        onClose={() => setOpened(false)}
        opened={opened}
        target={<Button
            onClick={() => setOpened((o) => !o)}
            disabled={outstanding > 0}
            className="mt-4 mx-auto"
            variant={"white"}
            size={"xs"}>Settle Invoice</Button>}
        width={350}
        position="bottom"
        withArrow
        spacing={10}
        shadow={"lg"}
        radius={"md"}
    >
        <div className="w-full flex flex-col space-y-4">
            <div>
               <span className="text-sm text-gray-700">
                   You are about to mark this payment and any attached invoices and orders as complete. Do ensure that you have physically confirmed payments to this effect.
               </span>
            </div>

            <div className="w-full">
                <Button onClick={() => finishPayment()} loading={isWorking} size={"xl"} fullWidth={true} color={"teal"}>Confirm</Button>
            </div>
        </div>
    </Popover>

    async function finishPayment() {
        setIsWorking(true);
        const result = await getAxios(`payments/settle/invoice?paymentId=${paymentId}`).catch(ajaxError).finally(() => setIsWorking(false));
        if (result) {
            toast("Updated successfully", "success");
            onDone();
        }
    }
}