import {DataTable} from 'primereact/datatable';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import React, {useEffect, useState} from "react";
import {Button as Btn, TextInput} from '@mantine/core';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {Filter} from "react-feather";


export default function PrimeGridHelper({data = [],  dataKey = "", globalFilters = [], header = "", footer = "", size = "small", children}) {

    const [filters1, setFilters1] = useState(null);
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text"/>;
    const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text"/>;

    useEffect(()=>{
        initFilters1();
    }, [])

    const clearFilter1 = () => {
        initFilters1();
    }

    const onGlobalFilterChange1 = (e) => {
        const value = e.target.value;
        let _filters1 = {...filters1};
        _filters1['global'].value = value;

        setFilters1(_filters1);
        setGlobalFilterValue1(value);
    }

    const initFilters1 = () => {
        setFilters1({
            'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        });
        setGlobalFilterValue1('');
    }

    const renderHeader1 = () => {
        return (
            <div className="flex items-center justify-between">
                <span>{header}</span>
                <div className="flex space-x-4 items-center">
                    <Btn size="xs" leftIcon={<Filter size={20}/>} onClick={clearFilter1}>Clear</Btn>
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <TextInput size={"xs"} variant={"filled"} value={globalFilterValue1} onChange={onGlobalFilterChange1}
                               placeholder="Search..."/>
                </span>
                </div>
            </div>
        )
    }

    const header1 = renderHeader1();

    return <DataTable
        value={data}
        responsiveLayout="scroll"
        header={header}
        size={size}
        paginator
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
        dataKey={dataKey}
        filters={filters1}
        filterDisplay="menu"
        globalFilterFields={globalFilters}
        header={header1}
        emptyMessage="Empty data"
    >
        {children}
    </DataTable>
}