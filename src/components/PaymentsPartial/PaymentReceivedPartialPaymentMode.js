import React from 'react';
import { RingProgress, Text, SimpleGrid, Paper, Center, Group, Avatar } from '@mantine/core';
import { CreditCard, CashBanknote } from 'tabler-icons-react';
import AvatarImg from '../../images/avatar.png';


export default function PaymentReceivedPartialPaymentMode({ customerName, paymentMode, depositAccount }) {

    return (
        <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {/*customer name*/}
            <Paper withBorder radius="md" p="xs">
                <Group>
                   {/*<Avatar src={AvatarImg} size={"xl"}/>*/}
                    <div>
                        <Text color="dimmed" size="md" transform="uppercase" weight={700}>
                            Customer Name
                        </Text>
                        <Text weight={700} size="md">
                            {customerName}
                        </Text>
                    </div>
                </Group>
            </Paper>


        {/*    payment method*/}
            <Paper withBorder radius="md" p="xs">
                <Group>
                    <CreditCard size={50} className="text-blue-500"/>
                    <div>
                        <Text color="dimmed" size="md" transform="uppercase" weight={700}>
                            Payment Mode
                        </Text>
                        <Text weight={700} size="xl">
                            {paymentMode}
                        </Text>
                    </div>
                </Group>
            </Paper>


        {/*    deposit account*/}
            <Paper withBorder radius="md" p="xs">
                <Group>
                    <CashBanknote size={50} className="text-green-500"/>
                    <div>
                        <Text color="dimmed" size="md" transform="uppercase" weight={700}>
                            Deposit Account
                        </Text>
                        <Text weight={700} size="xl">
                            {depositAccount}
                        </Text>
                    </div>
                </Group>
            </Paper>

        </SimpleGrid>
    );
}