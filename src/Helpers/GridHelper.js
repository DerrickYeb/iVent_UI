import {
    ColumnDirective,
    ColumnsDirective,
    GridComponent,
    Freeze,
    Sort,
    Resize,
    Inject,
    VirtualScroll,
    Search,
    Page,
    Toolbar,
    ColumnChooser,
    ColumnMenu,
    Filter,
    ExcelExport, PdfExport,
} from "@syncfusion/ej2-react-grids";
import {DataUtil} from '@syncfusion/ej2-data';
import React, {useRef} from "react";

export function GridHelper({data = [], width = '100%', height = 350, pageCount = 7, children, exportTplList = []}) {

    const gridRef = useRef(null);
    const toolbarOptions = ["Search", "ColumnChooser", 'ExcelExport', 'PdfExport', 'CsvExport'];
    const groupOptions = {showGroupedColumn: true};
    const filterSettings = {type: "CheckBox"};
//   const dataSourceSettings = {
//       formatSettings:[{
//           name:
//       }]
    // }


    function toolbarClick(args) {
        switch (args.item.text) {
            case 'PDF Export':
                gridRef.current.pdfExport();
                break;
            case 'Excel Export':
                gridRef.current.excelExport();
                break;
            case 'CSV Export':
                gridRef.current.csvExport();
                break;
        }
    }

    function exportQueryCellInfo(args) {
       //console.log(args)
        exportTplList.forEach((value, index) => {
            if(args.column.headerText === value.text) {
                args.spanText = {width:50, text :args.data[value.value].toString()
                }
            }
        });
        // if (args.column.headerText === 'Employee Image') {
        //     if (args.name === "excelQueryCellInfo") {
        //         args.image = {height: 75, base64: args.data["EmployeeImage"], width: 75};
        //     } else {
        //         args.image = {base64: args.data["EmployeeImage"]};
        //     }
        // }
        // if (args.column.headerText === 'Cost Price') {
        //     args.hyperLink = {
        //         target: 'mailto:' + args.data["ProductCostPrice"],
        //         displayText: args.data["ProductCostPrice"].toString()
        //     };
        // }
    }

    return <GridComponent
        //immediateRender="true"
        //delayUpdate='true'
        dataSource={DataUtil.parse.parseJson(data) || []}
        width={width}
        //height={height}
        allowSelection={false}
        enableHover={false}
        allowResizing={true}
        allowSorting={true}
        allowExcelExport={true}
        allowPdfExport={true}
        excelQueryCellInfo={exportQueryCellInfo}
        pdfQueryCellInfo={exportQueryCellInfo}
        toolbarClick={toolbarClick}
        //enableVirtualization
        allowPaging
        pageSettings={{
            pageSize: 7,
            pageCount: pageCount,
            pageSizes: true
        }}
        allowGrouping={false}
        toolbar={toolbarOptions}
        //frozenColumns={2}
        enableStickyHeader
        showColumnChooser
        //groupSettings={groupOptions}
        allowFiltering
        filterSettings={filterSettings}
        ref={gridRef}
    >
        {children}
        <Inject
            services={[
                Freeze,
                Resize,
                Sort,
                VirtualScroll,
                Search,
                Page,
                Toolbar,
                ColumnChooser,
                ColumnMenu,
                Filter,
                ExcelExport, PdfExport,

            ]}
        />
    </GridComponent>
}