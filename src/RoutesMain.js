import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Logo from "./images/logo-main.svg";

const Login = lazy(() => import("./Pages/Common/Login"));
const ForgotPassword = lazy(() => import("./Pages/Common/ForgotPassword"));
const OtpVerification = lazy(() => import("./Pages/Common/OtpVerification"));
const ResetPassword = lazy(() => import("./Pages/Common/ResetPassword"));
const ConnectStore = lazy(() => import("./Pages/Common/ConnectStore"));
const ConnectTwillio = lazy(() => import("./Pages/Common/ConnectTwillio"));
const TextCampaign = lazy(() => import("./Pages/TextCampaign"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Billings = lazy(() => import("./Pages/Billings"));
const CustomerList = lazy(() => import("./Pages/CustomerList"));
const Inquiry = lazy(() => import("./Pages/Inquiry"));
const Customer = lazy(() => import("./Pages/Customer"));
const TextCampaignDetail = lazy(() => import("./Pages/TextCampaignDetail"));
const EmailCampaign = lazy(() => import("./Pages/EmailCampaign"));
const EmailCampaignDetail = lazy(() => import("./Pages/EmailCampaignDetail"));
const Settings = lazy(() => import("./Pages/Settings"));
const MyProfile = lazy(() => import("./Pages/MyProfile"));
const NewSubscription = lazy(() => import("./Pages/NewSubscription"));
const EditPlan = lazy(() => import("./Pages/EditPlan"));
const SubAdmin = lazy(() => import("./Pages/SubAdmin"));
const SubAdminDetail = lazy(() => import("./Pages/SubAdminDetail"));
const CustomerDetail = lazy(() => import("./Pages/CustomerDetail"));
const InquiryDetail = lazy(() => import("./Pages/InquiryDetail"));
const VendorList = lazy(() => import("./Pages/VendorList"));
const VendorDetail = lazy(() => import("./Pages/VendorDetail"));
const TextCampaignVendors = lazy(() => import("./Pages/TextCampaignVendors"));
const EmailCampaignVendors = lazy(() => import("./Pages/EmailCampaignVendors"));
const CustomerCampaignVendors = lazy(() => import("./Pages/CustomerCampaignVendors"));
const Notification = lazy(() => import("./Pages/Notification"));

function ProtectedRout() {
	let token = localStorage.getItem("admin-token");
	return token ? <Outlet /> : <Navigate to={"/login"} />;
}

export default function RoutesMain() {
	return (
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<Suspense
				fallback={
					<div>
						<div className="loading">
							<img src={Logo} className="img-fluid" alt="Text A Buy" />
						</div>
					</div>
				}
			>
				<Routes>
					<Route path="/" strict element={<Login />} />
					<Route path="/login" exact element={<Login />} />
					<Route path="/forgot-password" exact element={<ForgotPassword />} />
					<Route path="/otp-verification" exact element={<OtpVerification />} />
					<Route path="/reset-password" exact element={<ResetPassword />} />
					<Route element={<ProtectedRout />}>
						<Route path="/connect-store" exact element={<ConnectStore />} />
						<Route path="/connect-twillio" exact element={<ConnectTwillio />} />
						<Route path="/dashboard" exact element={<Dashboard />} />
						<Route path="/billings" exact element={<Billings />} />
						<Route path="/notification" exact element={<Notification />} />
						<Route path="/inquiry" exact element={<Inquiry />} />
						<Route path="/customer-detail" exact element={<CustomerDetail />} />
						<Route path="/settings" exact element={<Settings />} />
						<Route path="/myprofile" exact element={<MyProfile />} />
						<Route path="/edit-plan" exact element={<EditPlan />} />
						<Route path="/new-subscription" exact element={<NewSubscription />} />
						<Route path="/vendor-list" exact element={<VendorList />} />
						<Route path="/text-campaign-detail" exact element={<TextCampaignDetail />} />
						<Route path="/textCampaignVendors" exact element={<TextCampaignVendors />} />
						<Route path="/customer" exact element={<Customer />} />
						<Route path="/customer-list" exact element={<CustomerList />} />
						<Route path="/inquiry-detail" exact element={<InquiryDetail />} />
						<Route path="/sub-admin-detail" exact element={<SubAdminDetail />} />
						<Route path="/email-campaign-detail" exact element={<EmailCampaignDetail />} />
						<Route path="/email-campaign" exact element={<EmailCampaign />} />
						<Route path="/emailCampaignVendors" exact element={<EmailCampaignVendors />} />
						<Route path="/customerCampaignVendors" exact element={<CustomerCampaignVendors />} />
						<Route path="/sub-admin" exact element={<SubAdmin />} />
						<Route path="/vendor-detail" exact element={<VendorDetail />} />
						<Route path="/text-campaign" exact element={<TextCampaign />} />
					</Route>
					<Route path="*" element={<Navigate to={"/login"} />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}
