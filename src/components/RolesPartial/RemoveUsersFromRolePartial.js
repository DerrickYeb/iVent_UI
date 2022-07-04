import {Button, Collapse, TextInput} from '@mantine/core';
import React, {useEffect, useState} from 'react';
import {Check, ChevronDown, Search, CheckCircle, XCircle} from "react-feather";
import {IconButton} from '@material-ui/core';

const data = [
    {
        Username: "david2",
        Fullname: "Anjanette Cleworth",
        Avatar: "https://uifaces.co/our-content/donated/N5PLzyan.jpg"
    },
    {
        Username: "eb2en",
        Fullname: "Athene Cremen",
        Avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
]



export default function RemoveUsersFromRolePartial({roleData}){
    const [isWorking, setIsWorking] = useState(false);
    const [collapse, setCollapse] = useState(false);
    const [usersList, setUsersList] = useState([]);


    return <div>
        <div>
            <TextInput icon={<Search/>} placeholder={"Search users to add to role"}/>
        </div>
        <div className="flex flex-col space-y-2 mt-6">
            {data.map((v, i) => <div className="flex w-full justify-between border-b border-dotted border-gray-200">
                <div className="flex items-center space-x-2">
                    <img src={v?.Avatar} className="h-8 w-8 rounded-full"/>
                    <span className="flex items-center text-lg font-medium">
            {v?.Fullname}
            </span>
                </div>

                <IconButton color="secondary">
                    <XCircle/>
                </IconButton>
            </div>)}
        </div>
    </div>
}