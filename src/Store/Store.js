import { Recoil, atom, atomFamily, selectorFamily } from "recoil";

export const UserSocketStore = atom({
  key: "UserSocketStore",
  default: null,
  dangerouslyAllowMutability: true,
});

export const MyProfileStore = atom({
  key: "MyProfileStore",
  default: null,
  dangerouslyAllowMutability: true,
});

//stocks list
export const StocksListStore = atom({
  key: "StocksListStore",
  default: [],
  dangerouslyAllowMutability: true,
});

//orders list
export const OrdersListStore = atom({
  key: "ShopOrdersListStore",
  default: [],
  dangerouslyAllowMutability: true,
});

//customer list store
export const CustomersListStore = atom({
  key: "CustomersListStore",
  default: [],
  dangerouslyAllowMutability: true,
});

//sales orders list store
export const SalesOrdersListStore = atom({
  key: "SalesOrdersListStore",
  default: [],
  dangerouslyAllowMutability: true,
});

//proformas list store
export const ProformasListStore = atom({
  key: "ProformasListStore",
  default: [],
  dangerouslyAllowMutability: true,
});



export const MenuIndexStore = atom({
  key: "MenuIndexStore",
  default: null,
  dangerouslyAllowMutability: true,
});

//invoice list store
export const InvoiceListStore = atom({
  key: "InvoiceListStore",
  default: [],
  dangerouslyAllowMutability: true,
});


//users list store
export const UsersListStore = atom({
  key: "UsersListStore",
  default: [],
  dangerouslyAllowMutability: true,
});

//roles list store
export const RolesListStore = atom({
  key: "RolesListStore",
  default: [],
  dangerouslyAllowMutability: true,
});

export const ReceiptsStore = atom({
  key: "ReceiptsStore",
  default: [],
  dangerouslyAllowMutability: true
});

export const PaymentsReceivedStore = atom({
  key: "PaymentsReceivedStore",
  default: [],
  dangerouslyAllowMutability: true
});