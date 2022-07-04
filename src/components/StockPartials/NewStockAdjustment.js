import {BasicRightDrawerUtils} from "../../modals/ModalUtils";
import {ActionIcon, TextInput, Textarea, Button} from "@mantine/core";
import {XCircle} from "react-feather";
import React, {useState} from "react";
import useAjaxError from "../../Helpers/useAjaxError";
import {useHistory} from "react-router-dom";
import useToasts from "../../Helpers/MyToasts";
import useSWR, {useSWRConfig} from 'swr';
import {postAxios} from "../../Helpers/API";
import {useRecoilState} from "recoil";
import {StocksListStore} from "../../Store/Store";
import MEventEmitter from "../../Helpers/MEventEmitter";

export default function NewStockAdjustment({data: v, open, onClose, onDone}) {
    const [ajaxError] = useAjaxError();
    const history = useHistory();
    const [toast] = useToasts();
    const [stocks, setStocks] = useRecoilState(StocksListStore);
    const [isWorking, setIsWorking] = useState(false);

    const {mutate} = useSWRConfig();

    const [obj, setObj] = useState({
        ProductId: v?.ProductId,
        PreviousQty: v?.ProductQuantityAtHand,
        AddedQty: 0,
        Comment: ""
    });

    if (obj.ProductId !== v?.ProductId) {
        setObj({
            ...obj,
            ProductId: v?.ProductId
        })
    }

    if (obj.PreviousQty !== v?.ProductQuantityAtHand) {
        setObj({
            ...obj,
            PreviousQty: v?.ProductQuantityAtHand
        })
    }


    return <BasicRightDrawerUtils open={open} onClose={onClose}>
        {/*    top */}
        <div className="flex bg-white items-center w-full justify-between p-4 border-b">
            <span>New Stock Adjustment</span>
            {/*close button*/}
            <div>
                <ActionIcon variant="hover" onClick={onClose} size={"sm"}><XCircle/></ActionIcon>
            </div>
        </div>

        {/*    body*/}
        <div className="grid gap-6 grid-cols-1 p-4 bg-white">
            <div>
                <TextInput label="Previous quantity" placeholder="Current quantity" readOnly={true}
                           value={obj.PreviousQty} variant="headless" size="xl"/>
            </div>

            <div>
                <TextInput label="Enter new quantity" placeholder="Enter new quantity" value={obj.AddedQty}
                           onChange={(e) => setObj({
                               ...obj,
                               AddedQty: e.target.value
                           })} variant="filled" required={true}/>
            </div>

            <div>
                <Textarea
                    placeholder="Enter note/comment"
                    label="Enter note/comment (optional. 500 max)"
                    value={obj.Comment}
                    autosize
                    minRows={2}
                    maxRows={4}
                    variant={"filled"}
                    onChange={(e) => setObj({
                        ...obj,
                        Comment: e.currentTarget.value
                    })}
                />
            </div>
            <div>
                <Button loading={isWorking} onClick={() => handleSave()}>Save</Button>
            </div>
        </div>
    </BasicRightDrawerUtils>

    async function handleSave() {
        if (!obj.AddedQty) return toast("Additional quantity is required", "info");
        if (isNaN(obj.AddedQty)) return toast("Additional quantity must be a number", "info");
        if (obj.AddedQty === 0) return toast("Additional quantity must be more than one", "info");
        const payload = obj;
        setIsWorking(true);
        const result = await postAxios("stock/new/adjustment", payload).catch(ajaxError).finally(() => setIsWorking(false));
        if (result) {
            toast("Stock adjusted successfully", "success");
            const findStockToUpdate = stocks.find((x) => x.ProductId === obj.ProductId);
            if (findStockToUpdate) {
                let newObj = {...findStockToUpdate}
                newObj.ProductQuantityAtHand += result?.AddedQty;
                MEventEmitter.emit('stockUpdated', newObj);
            }
            await mutate(`stock/get/adjustments/h?productId=${obj.ProductId}`, true);
            await  mutate(`stocks/get/stock?stockId=${obj?.ProductId}`, true)
            onClose();
        }
    }
}