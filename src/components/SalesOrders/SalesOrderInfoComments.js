import {Textarea, TextInput, Button, Avatar, ScrollArea, ActionIcon} from '@mantine/core';
import {Send, Search, Filter} from 'react-feather';
import React, {useCallback, useEffect, useState} from "react";
import useAjaxError from "../../Helpers/useAjaxError";
import useToasts from "../../Helpers/MyToasts";
import {getAxios, postAxios} from "../../Helpers/API";
import DOMPurify from 'dompurify';
import moment from 'moment';
import {debounce} from 'lodash';
import {GetUsername} from "../../Helpers/AuthService";

export default function SalesOrderInfoComments({orderId}) {
    const [data, setData] = useState([]);
    const [text, setText] = useState("");
    const [isWorking, setIsWorking] = useState(false);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();

    async function fetchComments() {
        const result = await getAxios(`get/order/comments?query=&orderId=${orderId}&skipAmt=${data.length}`).catch(ajaxError);
        if (result) setData(result);
    }

    useEffect(() => {
        fetchComments();
    }, []);


    async function addComment() {
        if (!text) return toast("Nothing to post");
        if (text && text.length > 1000) return toast("Max 1000 characters exceeded");

        setIsWorking(true);
        let payload = {
            Comment: DOMPurify.sanitize(text),
            OrderId: orderId
        };
        const result = await postAxios("new/order/comment", payload).catch(ajaxError).finally(() => {
            setIsWorking(false);
        });
        if (result) {
            setData((prev) => [result, ...prev]);
            toast("Comment posted successfully", "success");
            setText("");
        }
    }

    const searchFn = useCallback(debounce(async (val) => {
        const result = await getAxios(`get/order/comments?query=${val}&orderId=${orderId}&skipAmt=${data.length}`).catch(ajaxError);
        if (result) setData(result);
    }, 500), [])

    function handleSearch(val) {
        searchFn(val);
    }


    return <div className="bg-gray-200 p-2">
        <div className="flex flex-col justify-between bg-white w-3/5 mx-auto p-0 rounded">
            {/*    search bar*/}
            <div className="pl-4 pr-4 pt-4">
                <TextInput onChange={(e) => handleSearch(e.target.value)} icon={<Search size={16}/>}
                           placeholder="Search..." variant={"filled"} radius={100} size="xs"/>
            </div>
            {/*    comments list*/}
            <div className="flex-grow pl-4 pr-0 pt-4 pb-0">
                <ScrollArea
                    offsetScrollbars={true}
                    style={{
                        height: window.innerHeight - 280
                    }}>
                    {data && data.map((v, i) => <ChatCard index={i} key={v?.CommentId} data={v}/>)}
                </ScrollArea>
            </div>

            {/*add new comments*/}
            <div className="flex space-x-2 p-4 items-center w-full">
                <div className="flex-grow">
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.currentTarget.value)}
                        placeholder="Type your comment... (Max 1000 chars)"
                        minRows={1}
                        maxRows={2}
                        autosize
                        //radius={100}
                        variant={"filled"}
                    />
                </div>
                <div>
                    <ActionIcon
                        onClick={() => addComment()}
                        loading={isWorking}
                    ><Send/></ActionIcon>
                </div>
            </div>
        </div>
    </div>
}

function ChatCard({data: v, index}) {
    const getUsername = GetUsername();
    return <div className={`flex pr-4 space-x-2 ${index !== 0 && "mt-3"}`}>
        <div>
            <Avatar src={v?.UserInfo?.Avatar}/>
        </div>
        {/*    msg*/}
        <div className={`p-2 rounded flex flex-col ${v?.Username === getUsername ? "bg-blue-200" : "bg-green-200"} `}>
            <span className="font-semibold">{v?.UserInfo?.Fullname}</span>
            <span className="text-sm text-black">{v?.Comment}</span>
            <div className="pt-2 text-gray-500 text-xs">{moment(v?.Dated).fromNow()}</div>
        </div>
    </div>
}