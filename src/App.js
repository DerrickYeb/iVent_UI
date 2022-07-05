import React, {useEffect, useState} from 'react';
import {BrowserRouter, Switch, Route, Redirect, useHistory} from 'react-router-dom';
import {createBrowserHistory} from "history";
import './App.css';
import Login from './views/Login';
import Dashboard from "./views/Dashboard";
import ViewGeneralSettings from "./views/ViewGeneralSettings";
import ViewUsersManagement from "./views/ViewUsersManagement";
import ViewChangePassword from "./views/ViewChangePassword";
import ViewRolesManagement from "./views/ViewRolesManagement";
import ViewNewInventory from "./views/ViewNewInventory";
import ViewAllInventory from "./views/ViewAllInventory";
import ViewAddSingleStock from "./views/ViewAddSingleStock";
import {CheckAuth} from "./Helpers/AuthService";
import {SnackbarProvider} from "notistack";
import Collapse from "@material-ui/core/Collapse";
import {MantineProvider, Button, useMantineTheme} from '@mantine/core';
import ViewEditSingleStock from "./views/ViewEditSingleStock";
import ViewCategoriesManagement from "./views/ViewCategoriesManagement";
import ViewAllCustomers from "./views/ViewAllCustomers";
import ViewNewSalesOrder from "./views/ViewNewSalesOrder";
import ViewSalesOrder from "./views/ViewSalesOrder";
import ViewBrandsManagement from "./views/ViewBrandsManagement";
import ViewInvoices from "./views/ViewInvoices";
import ViewProformas from "./views/ViewProformas";
import ViewSingleInvoice from "./views/ViewSingleInvoice";
import ViewInvoicesByOrder from "./views/ViewInvoicesByOrder";
import ViewNewInvoice from "./views/ViewNewInvoice";
import useGetMyProfile from "./Hooks/SWRHooks/useGetMyProfile";
import {RolesObject} from "./Helpers/RolesObject";
import AccessDeniedScreen from "./Widgets/AccessDeniedScreen";
import FirstTimeLoginPasswordChangeView from "./views/FirstTimeLoginPasswordChangeView";
import ViewMyProfile from "./views/ViewMyProfile";
import {useIdle} from '@mantine/hooks';
import ViewNewProforma from "./views/ViewNewProforma";
import ViewSingleProforma from "./views/ViewSingleProforma";
import ViewNewCustomer from "./views/ViewNewCustomer";
import ViewReceipts from "./views/ViewReceipts";
import ViewPaymentsReceived from "./views/ViewPaymentsReceived";
import ViewNewPaymentReceived from "./views/ViewNewPaymentReceived";

const customHistory = createBrowserHistory();

const SecureRoute = ({component: Component, roles = [], ...rest}) => {

    const getRoles = JSON.parse(localStorage.getItem("r"));
    const canAccess = getRoles && getRoles.some(userRole => roles.includes(userRole));
    return <Route
        {...rest}
        render={(props) =>
            !canAccess ? (<Redirect
                to={{
                    pathname: "/denied",
                }}
            />) : CheckAuth() && canAccess ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/",
                    }}
                />
            )
        }
    />
};

function App() {
    const history = useHistory();
    const idle = useIdle(600000, { initialState: false });
    const theme = useMantineTheme();

    useEffect(() => {
        if (idle) window.location.href = "/"
    }, [idle])

    return (
        <SnackbarProvider
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            TransitionComponent={Collapse}
            hideIconVariant={false}
            //preventDuplicate
            maxSnack={1}
        >
            <MantineProvider

                styles={{
                    //button
                    Button: (theme) => ({
                        //root: {height: 35, padding: '0 15px', backgroundColor: theme.colors.teal[6]},
                        filled: {
                            //backgroundColor: theme.colors.teal[6],
                            backgroundColor:"#582A72",
                            '&:hover': {
                                // backgroundColor: theme.colors.teal[7],
                                backgroundColor:"#582A47"
                            },
                        },
                    }),
                    //badge
                    Badge: {
                        dot: {
                            borderWidth: 2,
                        },
                        filled: {
                            borderWidth: 2,
                        }
                    },
                }}
                theme={{
                    fontFamily: 'Poppins, sans-serif',
                    loader: 'dots',
                }}
            >
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Login}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/denied" component={AccessDeniedScreen}/>
                        <SecureRoute exact path="/dashboard" component={Dashboard}
                                     roles={[RolesObject.CanViewDashboard]}/>
                        <SecureRoute exact path="/general-settings" component={ViewGeneralSettings}
                                     roles={[RolesObject.CanManageSetups]}/>
                        <SecureRoute exact path="/users-management" component={ViewUsersManagement}
                                     roles={[RolesObject.CanManageSetups]}/>
                        <SecureRoute exact path="/change-password" component={ViewChangePassword}
                                     roles={[RolesObject.CanManageSetups]}/>
                        <SecureRoute exact path="/roles-management" component={ViewRolesManagement}
                                     roles={[RolesObject.CanManageSetups]}/>
                        <SecureRoute exact path="/new-inventory" component={ViewNewInventory}
                                     roles={[RolesObject.CanAddStocks]}/>
                        <SecureRoute exact path="/all-inventory" component={ViewAllInventory}
                                     roles={[RolesObject.CanViewStocks]}/>
                        <SecureRoute exact path="/add-single-stock" component={ViewAddSingleStock}
                                     roles={[RolesObject.CanAddStocks]}/>
                        <SecureRoute exact path="/edit-single-stock/:id" component={ViewEditSingleStock}
                                     roles={[RolesObject.CanEditStock]}/>
                        <SecureRoute exact path="/categories-management" component={ViewCategoriesManagement}
                                     roles={[RolesObject.CanManageSetups]}/>
                        <SecureRoute exact path="/brands-management" component={ViewBrandsManagement}
                                     roles={[RolesObject.CanManageSetups]}/>
                        <SecureRoute exact path="/all-customers" component={ViewAllCustomers}
                                     roles={[RolesObject.CanViewCustomer, RolesObject.CanManageSetups]}/>
                        <SecureRoute exact path="/new-sales-order" component={ViewNewSalesOrder}
                                     roles={[RolesObject.CanCreateSalesOrder]}/>
                        <SecureRoute exact path="/sales-orders" component={ViewSalesOrder}
                                     roles={[RolesObject.CanViewSalesOrders]}/>
                        <SecureRoute exact path="/invoices" component={ViewInvoices}
                                     roles={[RolesObject.CanViewInvoices]}/>
                        <SecureRoute exact path="/proformas" component={ViewProformas} roles={RolesObject.CanViewProforma}/>
                        <SecureRoute exact path="/new/proforma" component={ViewNewProforma} roles={RolesObject.CanIssueProfoma}/>
                        <SecureRoute exact path="/invoice/:id" component={ViewSingleInvoice}
                                     roles={[RolesObject.CanViewInvoices]}/>
                        <SecureRoute exact path="/proforma/:id" component={ViewSingleProforma}
                                     roles={[RolesObject.CanViewProforma]}/>
                        <SecureRoute exact path="/invoices/by/order/:id" component={ViewInvoicesByOrder}
                                     roles={[RolesObject.CanViewInvoices]}/>
                        <SecureRoute exact path="/new/invoice" component={ViewNewInvoice}
                                     roles={[RolesObject.CanIssueInvoice]}/>
                        <Route exact={true} path="/first/password/change" component={FirstTimeLoginPasswordChangeView}/>
                        <SecureRoute exact path="/me" component={ViewMyProfile} roles={[RolesObject.CanViewMyProfile]}/>
                        <SecureRoute exact path="/new/customer" component={ViewNewCustomer} roles={[RolesObject.CanAddCustomer]}/>
                        <SecureRoute exact={true} path={"/new/payment/received"} component={ViewNewPaymentReceived} roles={RolesObject.CanAddPayments}/>
                        <SecureRoute exact={true} path={"/payments-received"} component={ViewPaymentsReceived} roles={RolesObject.CanViewPayments}/>
                        <SecureRoute exact={true} path={"/receipts"} roles={RolesObject.CanViewReceipts} component={ViewReceipts}/>
                    </Switch>
                </BrowserRouter>
            </MantineProvider>
        </SnackbarProvider>
    );
}

export default App;
