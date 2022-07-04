import React, {useState} from 'react';
import {createStyles, Text} from '@mantine/core';
import {MoneyFormat, OrderStatus} from "../../Helpers/Constants";
import {Button, Popover, TextInput} from '@mantine/core';
import useToasts from "../../Helpers/MyToasts";
import useAjaxError from "../../Helpers/useAjaxError";
import {getAxios} from "../../Helpers/API";
import SettlePaymentInvoice from "./SettlePaymentInvoice";


const useStyles = createStyles((theme) => ({
    title: {
        color: theme.white,
        textTransform: 'uppercase',
        fontWeight: 700,
        fontSize: theme.fontSizes.sm,
    },

    count: {
        color: theme.white,
        fontSize: 32,
        lineHeight: 1,
        fontWeight: 700,
        marginBottom: theme.spacing.md,
    },

    description: {
        color: theme.colors[theme.primaryColor][0],
        fontSize: theme.fontSizes.sm,
        marginTop: 5,
    },

}));


export default function PaymentReceivedPartialAmountReceived({paymentAmount, amountReceived, change, outstanding, paymentId, paymentStatus, isInvoiceSettled = false, onDone}) {
    const {classes} = useStyles();
    const data = [
        {
            amount: paymentAmount,
            title: "Amount Due",
            desc: "Total invoice amount due."
        },
        {
            amount: amountReceived,
            title: "Amount Received",
            desc: "Amount received from customer."
        },
        {
            amount: outstanding,
            title: "Outstanding Balance",
            desc: "Amount left to be paid by customer."
        },
        {
            amount: change,
            title: "Amount in Excess",
            desc: "Difference in balance to be given to customer."
        },
    ];

    const stats = data.map((stat, i) => (
        <div key={stat.title} className={`flex flex-grow items-start p-4 w-full 
        ${i == 2 && parseFloat(outstanding) > 0 ? "bg-red-500" : i == 2 && parseFloat(outstanding) === 0 ? "bg-green-400" : i == 3 ? "bg-yellow-500 rounded-r-lg" : i === 0 ? "bg-blue-500 rounded-l-lg" : ""}`}>
            <div className="text-center flex flex-col items-center justify-center">
                <div className={classes.count}>{MoneyFormat(stat.amount)}</div>
                <div className={classes.title}>{stat.title}</div>
                <div className={classes.description}>{stat.desc}</div>
                {(i === 2 && parseFloat(outstanding) > 0) &&
                <CompletePayment paymentId={paymentId} amountReceived={amountReceived} outstanding={outstanding}
                                 onDone={onDone}/>}

                {(i === 1 && !isInvoiceSettled) && <SettlePaymentInvoice onDone={onDone} paymentId={paymentId} outstanding={outstanding}/>}
            </div>
        </div>
    ));
    return <div className="grid grid-cols-4 gap-0 bg-green-500 rounded-lg bg-green-500">{stats}</div>;
}


function CompletePayment({paymentId, amountReceived, outstanding, onDone}) {
    const [opened, setOpened] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [toast] = useToasts();
    const [ajaxError] = useAjaxError();
    const [amount, setAmount] = useState(0.00);


    return <Popover
        onClose={() => setOpened(false)}
        opened={opened}
        target={<Button
            onClick={() => setOpened((o) => !o)}
            className="mt-4 mx-auto"
            variant={"white"}
            size={"xs"}>Complete Payment</Button>}
        width={300}
        position="bottom"
        withArrow
        shadow={"lg"}
        radius={"md"}
    >
        <div className="w-full flex flex-col space-y-4">
            <div>
                <TextInput value={outstanding} size={"xl"} readOnly={true} variant={"filled"}
                           label={"Outstanding amount"}/>
            </div>
            <div>
                <TextInput
                    //value={outstanding}
                           size={"xl"}
                           value={amount}
                           onChange={(e) => setAmount(e.target.value)}
                    // variant={"filled"}
                           label={"Enter amount to pay"}/>
            </div>
            {/*<div>*/}
            {/*    <span>{MoneyFormat(outstanding - amount)}</span>*/}
            {/*</div>*/}
            <div className="w-full">
                <Button onClick={() => finishPayment()} loading={isWorking} size={"xl"} fullWidth={true}>Finish</Button>
            </div>
        </div>
    </Popover>

    async function finishPayment() {
        if (parseFloat(amount) < 1) return toast("Enter amount greater than 0");
        if (isNaN(amount)) return toast("Amount to pay must be a number");

        setIsWorking(true);
        const result = await getAxios(`payments/complete/payment?paymentId=${paymentId}&outstanding=${amount}`).catch(ajaxError).finally(() => setIsWorking(false));
        if (result) {
            toast("Payment updated", "success");
            onDone();
        }
    }
}