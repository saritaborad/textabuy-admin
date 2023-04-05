let LIVE = Number(process.env.REACT_APP_LIVE);
let api_base_url, ladning_url;
if (LIVE == 1) {
	api_base_url = process.env.REACT_APP_LIVE_API_URL;
	ladning_url = process.env.REACT_APP_LIVE_DOMAIN;
} else {
	api_base_url = process.env.REACT_APP_LOCAL_API_URL;
	ladning_url = process.env.REACT_APP_LOCAL_DOMAIN;
}
export const ApiBaseUrl = api_base_url;
export const LandingPageURL = ladning_url;

export const API_Path = {
	login: ApiBaseUrl + "/api/adminlogin",
	forgotpassword: ApiBaseUrl + "/api/forgotpassword",
	otpVerification: ApiBaseUrl + "/api/forgotpassword",
	resetPassword: ApiBaseUrl + "/api/forgotpassword",

	dashboard: ApiBaseUrl + "/api/admin/dashboard",
	myprofile: ApiBaseUrl + "/api/admin/adminprofile",

	addSubAdmin: ApiBaseUrl + "/subadmin",
	getAllSubAdmin: ApiBaseUrl + "/subadmin/getSubadmins",
	deleteSubAdmin: ApiBaseUrl + "/subadmin/delete",
	editSubAdmin: ApiBaseUrl + "/subadmin/updateSubadmin",
	getSingleSubAdmin: ApiBaseUrl + "/subadmin/getSubadmin",

	getEmailcampaignById: ApiBaseUrl + "/admin/emailcampaign/getEmailcampign",
	getEmailCampaignVendorwise: ApiBaseUrl + "/admin/emailcampaign/vendorwise",
	vendorStatusWiseData: ApiBaseUrl + "",

	getTextcampaignById: ApiBaseUrl + "/admin/textcampaign/getTextcampign",
	getTextCampaignVendorwise: ApiBaseUrl + "/admin/textcampaign/vendorwise",

	createInquiry: ApiBaseUrl + "/admin/support",
	getInquiry: ApiBaseUrl + "/admin/support/getSupports",
	getInquiryById: ApiBaseUrl + "/admin/support/getSupport",
	deleteInquiry: ApiBaseUrl + "/admin/support/delete",
	getChatById: ApiBaseUrl + "/admin/support/socketmsg",
	updateSupport: ApiBaseUrl + "/admin/support/updateSupport",

	addFile: ApiBaseUrl + "/img/addimg",
	updateprofile: ApiBaseUrl + "/api/admin/updateprofile",

	getCustomerById: ApiBaseUrl + "/admin/customer/getsinglecustomer",

	createPlan: ApiBaseUrl + "/admin/newplan",
	getPlan: ApiBaseUrl + "/admin/newplan/getplan",
	deletePlan: ApiBaseUrl + "/admin/newplan/delete",
	editplan: ApiBaseUrl + "/admin/newplan/updateNewplan",
	getByIdPlan: ApiBaseUrl + "/admin/newplan/singleplan",

	getBilling: ApiBaseUrl + "/admin/billing/admintransection",
	getBillingById: ApiBaseUrl + "/admin/billing/getbill",
	deleteBilling: ApiBaseUrl + "/admin/billing/delete",

	vendorlist: ApiBaseUrl + "/api/admin/vendor",

	getVendorListById: ApiBaseUrl + "/api/getVendorWithCustomer",
	deleteVendorList: ApiBaseUrl + "/api/admin/deletevendor",

	getVendorWithdetails: ApiBaseUrl + "/api/admin/getVendorWithdetails",

	getSupportById: ApiBaseUrl + "/admin/support/getSupport",

	changePassword: ApiBaseUrl + "/api/changepassword",
	getCustomerList: ApiBaseUrl + "/admin/customer/getallcustomer",

	subadminStatus: ApiBaseUrl + "/subadmin/changestatus",
	vendorStatus: ApiBaseUrl + "/api/admin/changestatus",
	planStatus: ApiBaseUrl + "/admin/newplan/changestatus",

	activity_notification: ApiBaseUrl + "/api/admin/activity_notification",
	activity_update: ApiBaseUrl + "/api/admin/activity_update",
	get_notification: ApiBaseUrl + "/api/admin/get_notification",

	getAllCustomers: ApiBaseUrl + "/admin/customer/getallcustomers",

	allNotify: ApiBaseUrl + "/api/all_notification",
	searchvendor: ApiBaseUrl + "/api/searchvendor",

	ResetSubAdminPassword: ApiBaseUrl + "/subadmin/resetPassword",
	
	export_textcampaign: ApiBaseUrl + "/admin/textcampaign/exportAdminTextcampaign",
	export_emailcampaign: ApiBaseUrl + "/admin/emailcampaign/exportAdminEmailcampaign",
	export_user: ApiBaseUrl + "/api/export_user",
	exportAdminSubadmin: ApiBaseUrl + "/subadmin/exportAdminSubadmin",
	exportAdminCustomer: ApiBaseUrl + "/admin/customer/exportAdminCustomer",
	exportAdminSupport: ApiBaseUrl + "/admin/support/exportAdminSupport",
	exportUserCustomer: ApiBaseUrl + "/customer/exportUserCustomer",
	

};

export const phoneRegExp = /^[+]?[(]?[ 0-9]{3}[)]?[- s. ]?[0-9]{3}[-s. ]?[0-9]{4,6}$/;

export const errorContainer = (form, field) => {
	return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
};

export const formAttr = (form, field) => ({ onBlur: form.handleBlur, onChange: form.handleChange, value: form.values[field] });
