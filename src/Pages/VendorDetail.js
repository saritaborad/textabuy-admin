import React, { useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
import { toast } from "react-toastify";
import moment from "moment";
import { useLocation, useNavigate } from "react-router";
import RtdDatatable from "../Components/DataTable/RtdDatatable";

export default function VendorDetail() {
	const location = useLocation();
	const Navigate = useNavigate();
	const [vendorList_details, setvendorList_details] = useState("");
	const [TransectionDetails, settransectionDetails] = useState("");
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 0, page: 0, sort: "id", order: "ASC" });
	const [columns, setcolumns] = useState([
		{
			label: "ID",
			value: "invoice_id",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return (<span>{data[i].invoice_id ? data[i].invoice_id : "-"}</span>)
				},
			},
		},
		{
			label: "Date",
			value: "createdAt",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].createdAt ? moment(data[i].createdAt).format("MM/DD/YYYY") : "-"}</span>
				},
			},
		},
		{
			label: "Amount",
			value: "amount",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return (<span>{data[i].amount ? "$"+data[i].amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : "-"}</span>)
				},
			},
		},
		{
			label: "Status",
			value: "status",
			options: {
				filter: true,
				sort: false,
				empty: true,
				customBodyRender: (data, i) => {
					return <span className={"staus-span-tag-new status-"}>{data[i].status ? data[i].status : "-"}</span>;
				},
			},
		},
	]);

	useEffect(() => {
		let id = location?.state?.id
		if (id !== undefined) {
			get_vendorList_details(location?.state?.id);
		}
	}, [location?.state?.id]);

	const get_vendorList_details = (_id) => {
		const getvendorListDetailDataPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getVendorWithdetails, { vendorid: _id }));
		});
		getvendorListDetailDataPromise.then((res) => {
			if (res.status === 200) {
				setvendorList_details(res.data.data.vendor);
				settransectionDetails(res.data.data.transection);
				if (vendorList_details.status) {
					document.getElementById("Active1").setAttribute("checked", true);
				}
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const tableCallBack = (option) => {
		setoption(option);
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row align-items-center">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="m-0">Vendor Details</h1>
							</div>
						</div>
						<div className="col-12 ">
							<div className="detail-box-class">
								<div className="vendor-detail-main">
									<div className="d-md-flex d-block align-items-center">
										<div>
											<div className="d-flex align-items-center mb-2">
												<span>Vendor Name:</span>
												<bdi>
													{/* {vendorList_details.fname} {vendorList_details.lname} */}
													{(vendorList_details.fname || vendorList_details.lname) ? `${vendorList_details.fname + " " + vendorList_details.lname}` : "-"}
												</bdi>
											</div>
											<div className="d-flex align-items-center mb-2">
												<span>Created At:</span>
												<bdi>{moment(vendorList_details.createdAt).format("DD/MM/YYYY hh:mm a")}</bdi>
											</div>
										</div>
										<div className="ms-auto">
											<div className="d-sm-flex d-block align-items-center">
												<div className="me-2">
													<button type="button" className="btn-comn-class mb-2 w-100" onClick={() => Navigate("/textCampaignVendors")}>
														Text Campaigns
													</button>
												</div>
												<div>
													<button type="button" className="btn-comn-class mb-2 w-100" onClick={() => Navigate("/emailCampaignVendors")}>
														Email Campaigns
													</button>
												</div>
											</div>
										</div>
									</div>
									<div className="d-flex align-items-center mb-2">
										<span>Last Reached:</span>
										<bdi>{moment(vendorList_details.updatedAt).format("DD/MM/YYYY hh:mm a")}</bdi>
									</div>
									<div className="d-flex align-items-center mb-2">
										<span>Status:</span>
										<div className="form-check form-switch d-inline-flex align-items-center justify-content-center">
											<input className="form-check-input" type="checkbox" id="Active1" value={vendorList_details.status === 1 ? true : false} />
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12 mt-3">
							<div className="comn-title-main">
								<h1 className="mb-0">Payment History</h1>
							</div>
							<div className="col-12">
								<div className="comn-table-black-bg">
									<div>
										<RtdDatatable option={option} columns={columns} data={TransectionDetails} tableCallBack={tableCallBack} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
