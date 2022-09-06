import moment from "moment";
import * as htmlToImage from "html-to-image";
import {jsPDF} from "jspdf";

export const StockStatus = [
    {
        value: "",
        label: "All"
    },
    {
        value: "Active",
        label: "Active"
    },
    {
        value: "Inactive",
        label: "Inactive"
    },
    {
        value: "Expired",
        label: "Expired"
    }]

export const SalesOrdersStatus = [
    {
        value: "Pending",
        label: "Pending"
    },
    {
        value: "Refunded",
        label: "Refunded"
    },
    {
        value: "InProgress",
        label: "InProgress"
    },
    {
        value: "Shipping",
        label: "Shipping"
    },
    {
        value: "Completed",
        label: "Completed"
    }, {
        value: "Cancelled",
        label: "Cancelled"
    },
    {
        value: "Authorized",
        label: "Authorized"
    },
    {
        value: "PaymentDeclined",
        label: "PaymentDeclined"
    },
]

export const newStockObj = {
    itemId: "",
    itemName: "",
    itemDescription: "",
    itemCategoryId: "",
    sku: "",
    weight: "",
    length: 0,
    width: 0,
    height: 0,
    itemExpire: new Date(),
    brandId: "",
    manufacturerId: "",
    sellingPrice: 0,
    costPrice: 0,
    taxId: "",
    openingStock: 0,
    reorderPoint: 0,
    supplierId: "",
    itemImages: [],
    itemVisibility: true,
    itemStatus: StockStatus[0].label,
    itemManufactureDate: new Date(),
    itemStrength: "",
    itemVolume: ""
}

export const StockExpiringTimeTrackingObj = [
    {
        value: "One Month",
        label: "One Month"
    },
    {
        value: "Three Months",
        label: "Three Months"
    },
    {
        value: "Six Months",
        label: "Six Months"
    }
]

export const OrderReminderPeriod = [
    {
        value: "Net15",
        label: "Net 15"
    },
    {
        value: "Net30",
        label: "Net 30"
    },
    {
        value: "Net60",
        label: "Net 60"
    }
]

export const OrderPaymentPeriod = [
    {
        value: "Net15",
        label: "Net 15"
    },
    {
        value: "Net30",
        label: "Net 30"
    },
    {
        value: "Net60",
        label: "Net 60"
    }
]

export const OrderStatus = {
    Pending: "Pending",
    Refunded: "Refunded",
    InProgress: "InProgress",
    Shipping: "Shipping",
    Completed: "Completed",
    Cancelled: "Cancelled",
    Authorized: "Authorized",
    PaymentDeclined: "PaymentDeclined"
}

export const Prefix = "SO";
export const RefPrefix = "REF";
export const InvPrefix = "INV";
export const PaymentPrefix = "PMT";

export function MoneyFormat(amt) {
    return new Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "GHS",
    }).format(amt);
}

export function formatDate(date) {
    return moment(date).format("ll");
}

export const Salutation = {
    "Mr.": "Mr.",
    "Mrs.": "Mrs.",
    "Ms.": "Ms.",
    "Miss.": "Miss.",
    "Dr.": "Dr."
}

export function SalutationToArray() {
    let output = [];
    for (const [key, value] of Object.entries(Salutation)) {
        let obj = {
            value: key,
            label: value
        };
        output.push(obj);
    }
    return output;
}

export const CustomersType = {
    All: "All Customers",
    Active: "Active Customers",
    Inactive: "Inactive Customers",
    // Overdue: "Overdue Customers",
    // Unpaid: "Unpaid Customers"
}

export function CustomersTypeToArray() {
    let output = [];
    for (const [key, value] of Object.entries(CustomersType)) {
        let obj = {
            value: key,
            label: value
        };
        output.push(obj);
    }
    return output;
}

export function renderAmount(sellingPrice, quantity, discountRate) {
    if (isNaN(quantity)) quantity = 1;
    if (parseFloat(quantity) < 1) quantity = 1;
    if (isNaN(discountRate)) discountRate = parseFloat(0.00);
    if (parseFloat(discountRate) > 100) discountRate = parseFloat(0.00);
    let discount = (sellingPrice * quantity) * discountRate / 100;
    return MoneyFormat((sellingPrice * quantity) - discount);
}

export const InvoiceStatus = {
    // All: "All Invoice",
    Sent: "Sent",
    Pending: "Pending",
    Unsent: "Unsent",
    Failed: "Failed",
    Completed: "Completed",
    Cancelled: "Cancelled"
}

export function InvoiceStatusArr() {
    let output = [];
    for (const [key, value] of Object.entries(InvoiceStatus)) {
        let obj = {
            value: key,
            label: value
        };
        output.push(obj);
    }
    return output;
}

export async function downloadAsPdf(element, fileName = "pdf export") {
    htmlToImage.toPng(element, {quality: 0.95}).then((canvasResult) => {
        const doc = new jsPDF('p', 'pt', 'a4', false);
        doc.addImage(canvasResult, 'PNG', 10, 10);
        doc.save(`${fileName}.pdf`);
    });

}

export const UsersTypeArr = [
    {
        value: "Staff",
        label: "Staff"
    },
    {
        value: "Customer",
        label: "Customer"
    }
]