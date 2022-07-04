import useSWR from 'swr';
import {getAxios} from "../../Helpers/API";

export function useFetchLovCategories() {
    return useSWR("get/categories/lov", getAxios)
}

export function useFetchLovBrands() {
    return useSWR("get/brands/lov", getAxios)
}

export function useFetchLovManufacturers() {
    return useSWR("get/manufacturers/lov", getAxios)
}

export function useFetchLovSuppliers() {
    return useSWR("get/suppliers/lov", getAxios)
}

export function useFetchLovRolesList() {
    return useSWR("get/roles/list/lov", getAxios)
}

export function useFetchLovCustomersList() {
    return useSWR("get/customers/lov", getAxios)
}

export function useFetchLovStocksList() {
    return useSWR("get/products/lov", getAxios)
}

export function useFetchLovOrdersList() {
    return useSWR("get/orders/lov", getAxios)
}

export function useFetchLovDepartments() {
    return useSWR("get/depts/lov", getAxios)
}

export function useFetchLovDesignations() {
    return useSWR("get/designations/lov", getAxios)
}

export function useFetchLovPaymentMethods() {
    return useSWR("get/payment/methods/lov", getAxios)
}

export function useFetchLovPaymentAccounts() {
    let output = [];
    const {data, mutate, error} = useSWR("get/payment/accounts/lov", getAxios);
    if (data) {
        data.forEach((val, _) => {
            let obj = {
                value: val?.value,
                label: val?.label,
                group: val?.category
            }
            output.push(obj);
        })
    }
    return {
        data: output,
        mutate: mutate,
        error: error
    }
}