import SideMenu from "../Helpers/SideMenu";
import PartialHeader from "../Helpers/PartialHeader";
import InventorySvg from "../Svgicons/InventorySvg";
import React, {useEffect, useState} from "react";
import {Tabs, TextInput, Select, Checkbox, Button, MantineProvider} from "@mantine/core";
import {
    StockStatus,
    newStockObj
} from "../Helpers/Constants";
import CediImg from '../images/ghana-cedis.png';
import AddStockUploadImageWidget from "../Widgets/AddStockUploadImageWidget";
import AddSingleStockImageListWidget from "../Widgets/AddSingleStockImageListWidget";
import {Info, Plus} from "react-feather";
import RichTextBoxHelper from "../Helpers/RichTextBoxHelper";
import {
    useFetchLovBrands,
    useFetchLovCategories,
    useFetchLovManufacturers,
    useFetchLovSuppliers
} from "../Hooks/SWRHooks/useLovHooks";
import {StocksListStore} from "../Store/Store";
import {useRecoilState} from "recoil";
import {
    CreateBrandWidget,
    CreateCategoryWidget,
    CreateManufacturerWidget, CreateSupplierWidget
} from "../Widgets/CreateCategoryAndOthersWidget";
import useAjaxError from "../Helpers/useAjaxError";
import useToasts from "../Helpers/MyToasts";
import {postAxios} from "../Helpers/API";
import {useHistory} from "react-router-dom";
import {AllInventoryUrl} from "../Helpers/UrlHelper";
import {DatePicker} from "@mantine/dates";
import moment from 'moment';

export default function ViewAddSingleStock() {
    const [itemObj, setItemObj] = useState({
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
        itemShelfLife: null,
        itemStrength: "",
        itemVolume: ""
    })
    const [isWorking, setIsWorking] = useState(false);
    const [stocksList, setStocksList] = useRecoilState(StocksListStore)
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();
    const history = useHistory();
    const [usingPriceFormula, setUsingPriceFormula] = useState(true);

    //swr hooks
    const {data: categoriesList} = useFetchLovCategories();
    const {data: brandsList} = useFetchLovBrands();
    const {data: manufacturersList} = useFetchLovManufacturers();
    const {data: suppliersList} = useFetchLovSuppliers();


    useEffect(() => {
        if (usingPriceFormula) {
            let getSellingPrice = itemObj.costPrice * 0.12;
            let finalPrice = parseFloat(getSellingPrice) + parseFloat(itemObj.costPrice);
            setItemObj({
                ...itemObj,
                sellingPrice: finalPrice
            })
        }
    }, [itemObj.costPrice, usingPriceFormula])

    useEffect(() => {
        if (moment(itemObj.itemExpire).isBefore(itemObj.itemManufactureDate)) return toast("Expiring date cannot be before manufacturing date", "warning");
        const getDiff = moment(itemObj.itemExpire).diff(moment(itemObj.itemManufactureDate), 'M');
        setItemObj({
            ...itemObj,
            itemShelfLife: getDiff + ' months'
        })
    }, [itemObj.itemManufactureDate, itemObj.itemExpire])

    function handleOnRemove(index) {
        const getLocation = itemObj.itemImages[index];
        const returnDiffArray = itemObj.itemImages.filter((x) => x.ImageUrl !== getLocation.ImageUrl);

        setItemObj({
            ...itemObj,
            itemImages: returnDiffArray
        })
    }

    function handleOnFileUploadDone(file) {
        const obj = {
            ImageUrl: file,
            Featured: false
        }
        const itm = itemObj.itemImages;
        itm.push(obj);

        setItemObj({
            ...itemObj,
            itemImages: itm
        })
    }

    async function handleOnSaveStock() {

        //validations start
        if (!itemObj.itemName) return toast("Stock name is required", "info");
        if (!itemObj.sku) return toast("Stock batch no is required", "info");
        if (!itemObj.itemStrength) return toast("Stock strength is required", "info");
        if (!itemObj.itemCategoryId) return toast("Stock category is required", "info");
        if (!itemObj.costPrice) return toast("Stock cost price no is required", "info");
        if (isNaN(itemObj.costPrice)) return toast("Stock cost price must be a number");
        if (!itemObj.sellingPrice) return toast("Stock batch no is required", "info");
        if (isNaN(itemObj.sellingPrice)) return toast("Stock selling price must be a number");

        if (!itemObj.openingStock) return toast("Stock opening qty is required", "info");
        if (isNaN(itemObj.openingStock)) return toast("Stock opening qty must be a number");
        if (isNaN(itemObj.reorderPoint)) return toast("Stock reorder point must be a number");
        if (moment(itemObj.itemManufactureDate).isAfter(moment(new Date()))) return toast("Stock manufacturing date cannot after today");
        if (moment(itemObj.itemExpire).isBefore(moment(new Date()))) return toast("Stock expiring date cannot before today");

        //validations end
        setIsWorking(true);
        let payload = {
            ProductName: itemObj.itemName,
            ProductDesc: itemObj.itemDescription,
            ProductSKU: itemObj.sku,
            ProductWeight: itemObj.weight,
            ProductCategoryId: itemObj.itemCategoryId,
            ProductSellingPrice: itemObj.sellingPrice,
            ProductCostPrice: itemObj.costPrice,
            ProductVisibility: itemObj.itemVisibility,
            ProductStatus: itemObj.itemStatus,
            ProductOpeningStockQty: itemObj.openingStock,
            ProductReorderPoint: itemObj.reorderPoint,
            ProductBrandId: itemObj.brandId,
            ProductManufacturerId: itemObj.manufacturerId,
            ProductSupplierId: itemObj.supplierId,
            ProductLength: itemObj.length,
            ProductWidth: itemObj.width,
            ProductHeight: itemObj.height,
            ProductImages: itemObj.itemImages,
            ProductExpireDate: itemObj.itemExpire,
            ProductShelfLife: itemObj.itemShelfLife,
            ProductManufactureDate: itemObj.itemManufactureDate,
            Strength: itemObj.itemStrength,
            Volume: itemObj.itemVolume
        }

        const result = await postAxios("stocks/new/stock", payload).catch((err) => {
            setIsWorking(false);
            ajaxError(err);
        });
        if (result) {
            //setItemObj(newStockObj);
            setIsWorking(false);
            setStocksList((prev) => [result, ...prev]);
            toast("New stock added successfully", "success");
            setTimeout(()=>{
                history.replace(AllInventoryUrl);
            }, 2500);

        }
    }

    return <SideMenu>
        <PartialHeader title="Stocks > Add Single Stock" icon={<InventorySvg/>}/>
        <div className="p-4 second-bg mb-12">
            <h2 className="font-bold text-2xl pb-2 capitalize">{itemObj.itemName}</h2>
            {/*    tabs*/}
            <Tabs variant="default">
                <Tabs.Tab label={<TabLabel title="General"/>}>
                    <div className="w-full flex space-x-4">
                        {/*left flex section*/}
                        <div className="flex-grow w-96">

                            {/* stock images start*/}
                            <div className="p-4 bg-white shadow-lg justify-between rounded-lg">
                                <div
                                    className={`flex space-x-2 flex-wrap`}>
                                    <AddSingleStockImageListWidget onRemove={(index) => handleOnRemove(index)}
                                                                   images={itemObj.itemImages}/>
                                    <AddStockUploadImageWidget onDone={(file) => handleOnFileUploadDone(file)}/>
                                </div>
                            </div>

                            {/*stock images end*/}

                            {/*    title section start*/}
                            <div className="p-4 bg-white shadow-lg justify-between rounded-lg mt-4">
                                <div className="w-full space-y-2">
                                    <TextInput required label="Name" placeholder="Name" variant="filled"
                                               value={itemObj.itemName} onChange={(e) => setItemObj({
                                        ...itemObj,
                                        itemName: e.target.value
                                    })}/>

                                    <div className="flex space-x-4 w-full">
                                        <div className="flex-grow">
                                            <TextInput required label="Batch No" placeholder="Batch no" variant="filled"
                                                       value={itemObj.sku} onChange={(e) => setItemObj({
                                                ...itemObj,
                                                sku: e.target.value
                                            })}/>
                                        </div>
                                        <div className="flex-grow">
                                            <TextInput required label="Strength" placeholder="Strength"
                                                       variant="filled" value={itemObj.itemStrength}
                                                       onChange={(e) => setItemObj({
                                                           ...itemObj,
                                                           itemStrength: e.target.value
                                                       })}/>
                                        </div>
                                        <div className="flex-grow">
                                            <TextInput label="Volume" placeholder="Volume"
                                                       variant="filled" value={itemObj.itemVolume}
                                                       onChange={(e) => setItemObj({
                                                           ...itemObj,
                                                           itemVolume: e.target.value
                                                       })}/>
                                        </div>
                                        <div className="flex-grow">
                                            <Select
                                                label="Category"
                                                required
                                                placeholder="Category"
                                                data={categoriesList || []}
                                                value={itemObj.itemCategoryId}
                                                onChange={(e) => setItemObj({
                                                    ...itemObj,
                                                    itemCategoryId: e
                                                })}
                                                variant={"filled"}
                                                clearable
                                                rightSection={<div
                                                    className="border-l border-gray-300 h-8 flex items-center pr-2">
                                                    <CreateCategoryWidget/></div>}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/*    item description */}
                                <div className="mt-4">
                                    <span>Description</span>
                                    <RichTextBoxHelper value={itemObj.itemDescription} onChange={(value) => setItemObj({
                                        ...itemObj,
                                        itemDescription: value
                                    })}/>
                                </div>


                            </div>
                            {/*    title section end*/}


                            {/*    qty, reorder unit supplier selection start*/}
                            <div className="p-4 bg-white shadow-lg justify-between rounded-lg mt-4">
                                <div className={`flex space-x-2 `}>
                                    <div className="flex-grow">
                                        <TextInput required label="Opening Stock Qty" placeholder="Opening Stock Qty"
                                                   variant="filled" value={itemObj.openingStock}
                                                   onChange={(e) => setItemObj({
                                                       ...itemObj,
                                                       openingStock: e.target.value
                                                   })}/>
                                    </div>
                                    <div className="flex-grow">
                                        <TextInput required label="Stock Reorder Point"
                                                   placeholder="Stock Reorder Point"
                                                   variant="filled" value={itemObj.reorderPoint}
                                                   onChange={(e) => setItemObj({
                                                       ...itemObj,
                                                       reorderPoint: e.target.value
                                                   })}/>
                                    </div>
                                    <div className="flex-grow">
                                        <Select
                                            label="Select Supplier"
                                            placeholder="Select Supplier"
                                            data={suppliersList || []}
                                            value={itemObj.supplierId}
                                            onChange={(e) => setItemObj({
                                                ...itemObj,
                                                supplierId: e
                                            })}
                                            variant={"filled"}
                                            clearable
                                            rightSection={<div
                                                className="border-l border-gray-300 h-8 flex items-center pr-2">
                                                <CreateSupplierWidget/></div>}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/*    qty, reorder unit supplier selection start*/}


                        </div>

                        {/*right flex section*/}
                        <div className="flex-none">
                            {/*    pricing section */}
                            <div className="p-4 bg-white shadow-lg rounded-lg flex flex-col space-y-6">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-xl pb-2">Cost price</h3>
                                        <Checkbox checked={usingPriceFormula} label={"Toggle pricing formula"}
                                                  onChange={(e) => setUsingPriceFormula(e.currentTarget.checked)}/>
                                    </div>

                                    <TextInput
                                        required
                                        icon={<div className="border-r border-gray-400 h-10 flex items-center pr-2"><img
                                            src={CediImg} className="h-4 w-4"/></div>}
                                        iconWidth={50}
                                        placeholder="Cost Price" size={"xl"} variant={"filled"}
                                        value={itemObj.costPrice} onChange={(e) => setItemObj({
                                        ...itemObj,
                                        costPrice: e.target.value
                                    })}/>
                                </div>

                                <div>
                                    <h3 className="font-bold text-xl pb-2">Selling price</h3>
                                    <TextInput
                                        required
                                        icon={<div className="border-r border-gray-400 h-10 flex items-center pr-2"><img
                                            src={CediImg} className="h-4 w-4"/></div>}
                                        iconWidth={50}
                                        placeholder="Selling Price" size={"xl"} variant={"filled"}
                                        value={itemObj.sellingPrice} onChange={(e) => setItemObj({
                                        ...itemObj,
                                        sellingPrice: e.target.value
                                    })}/>
                                </div>

                            </div>

                            {/*    item visibility section */}
                            <div className="p-4 bg-white shadow-lg rounded-lg flex flex-col space-y-6 mt-4">
                                <div>
                                    <h3 className="font-bold text-base pb-2">Stock Visibility</h3>
                                    <Checkbox
                                        label={<span
                                            className="text-gray-500 font-semibold">Toggle stock visibility</span>}
                                        checked={itemObj.itemVisibility}
                                        onChange={(event) => setItemObj({
                                            ...itemObj,
                                            itemVisibility: event.currentTarget.checked
                                        })}/>
                                </div>
                            </div>

                            {/*    item status section */}
                            <div className="p-4 bg-white shadow-lg rounded-lg flex flex-col space-y-6 mt-4">
                                <div>
                                    <h3 className="font-bold text-base pb-2">Stock Status</h3>
                                    <Select data={StockStatus}
                                            value={itemObj.itemStatus}
                                            onChange={(e) => setItemObj({
                                                ...itemObj,
                                                itemStatus: e
                                            })}
                                            variant={"filled"}
                                    />
                                </div>
                            </div>

                            {/*    item expire date section */}
                            <div className="p-4 bg-white shadow-lg rounded-lg flex flex-col space-y-4 mt-4">

                                <div>
                                    <h3 className="font-bold text-base pb-2">Stock Manufacture Date</h3>
                                    <DatePicker
                                        value={itemObj.itemManufactureDate}
                                        onChange={(e) => setItemObj({
                                            ...itemObj,
                                            itemManufactureDate: e
                                        })}
                                        variant="filled"
                                        required
                                    />
                                </div>

                                <div>
                                    <h3 className="font-bold text-base pb-2">Stock Expiration Date</h3>
                                    <DatePicker
                                        value={itemObj.itemExpire}
                                        onChange={(e) => setItemObj({
                                            ...itemObj,
                                            itemExpire: e
                                        })}
                                        variant="filled"
                                        required
                                    />
                                </div>

                                <div className="flex-grow">
                                    <h3 className="font-bold text-base pb-2">Stock Shelf Life <em>(calc. in months)</em></h3>
                                    <TextInput
                                        variant="filled" value={itemObj.itemShelfLife}
                                        readOnly={true}
                                        required
                                        // onChange={(e) => setItemObj({
                                        //     ...itemObj,
                                        //     reorderPoint: e.target.value
                                        // })}
                                    />
                                </div>
                            </div>

                            {/*    item brand section */}
                            <div className="p-4 bg-white shadow-lg rounded-lg flex flex-col space-y-6 mt-4">
                                <div>
                                    <h3 className="font-bold text-base pb-2">Brand</h3>
                                    <Select
                                        placeholder="Select Brand"
                                        data={brandsList || []}
                                        value={itemObj.brandId}
                                        onChange={(e) => setItemObj({
                                            ...itemObj,
                                            brandId: e
                                        })}
                                        variant={"filled"}
                                        clearable
                                        rightSection={<div
                                            className="border-l border-gray-300 h-8 flex items-center pr-2">
                                            <CreateBrandWidget/></div>}
                                    />
                                </div>
                            </div>


                            {/*    item manufacturer section */}
                            <div className="p-4 bg-white shadow-lg rounded-lg flex flex-col space-y-6 mt-4">
                                <div>
                                    <h3 className="font-bold text-base pb-2">Manufacturer</h3>
                                    <Select
                                        placeholder="Select Manufacturer"
                                        data={manufacturersList || []}
                                        value={itemObj.manufacturerId}
                                        onChange={(e) => setItemObj({
                                            ...itemObj,
                                            manufacturerId: e
                                        })}
                                        variant={"filled"}
                                        clearable
                                        rightSection={<div
                                            className="border-l border-gray-300 h-8 flex items-center pr-2">
                                            <CreateManufacturerWidget/></div>}
                                    />
                                </div>
                            </div>


                        </div>
                    </div>
                </Tabs.Tab>
                {/*<Tabs.Tab label={<TabLabel title="Options"/>}>*/}

                {/*</Tabs.Tab>*/}
                {/*<Tabs.Tab label={<TabLabel title="Files"/>}>*/}

                {/*</Tabs.Tab>*/}
                <Tabs.Tab icon={<Info color="red"/>} label={<TabLabel title="Taxes"/>}>
                    <TaxNotice/>
                </Tabs.Tab>
            </Tabs>
        </div>
        <div className="p-1 flex justify-end items-center w-full bg-green-50 fixed bottom-0 right-0 shadow-lg">
            <Button size="md" loading={isWorking} onClick={() => handleOnSaveStock()}>Save</Button>
        </div>
    </SideMenu>
}


function TabLabel({title}) {
    return <span className="font-medium text-base">{title}</span>
}

function TaxNotice() {
    return <div className="flex flex-col space-y-4 w-2/4 mx-auto bg-white rounded p-4 mt-8 items-center justify-center">
        <div>
            <Info size={60} color="red"/>
        </div>
        <div className="text-center flex items-center justify-center">
            <span className="text-center">It seems a tax policy is not setup for this inventory to use. Please contact the accountant to setup a tax policy. </span>
        </div>
        <div className="text-center flex items-center justify-center">
            <b className="text-center">Note: If a tax policy is not setup, the stock will be sold without tax cost
                added.</b>
        </div>
    </div>
}