import {Button, Collapse, TextInput} from '@mantine/core';
import React, {useEffect, useState} from 'react';
import {Check, ChevronDown, Search, CheckCircle, XCircle} from "react-feather";
import {IconButton} from '@material-ui/core';



const data = [
    {
        Username: "david",
        Fullname: "David Asamoah",
        Avatar: "https://randomuser.me/api/portraits/men/76.jpg"
    },
    {
        Username: "eben",
        Fullname: "Ebenezer Amposah",
        Avatar: "https://pps.whatsapp.net/v/t61.24694-24/s96x96/211511851_371177451375014_4537802103780230589_n.jpg?ccb=11-4&oh=c6395a237fdb1f3c2d6a3cad0e8e736b&oe=61FD296D"
    },
    {
        Username: "osei",
        Fullname: "Rebecca Oteng",
        Avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
]

export default function AddUsersToRolePartial({roleData}) {
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

            <IconButton color="primary">
                <CheckCircle/>
            </IconButton>
        </div>)}
        </div>
    </div>
}