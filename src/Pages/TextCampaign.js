import React, { useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Dropdown } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { API_Path } from "../const";
import { PostApi } from "../ApiService";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import { toast } from "react-toastify";
export default function TextCampaign() {
	const location = useLocation();
	const Navigate = useNavigate();
	const [id, setid] = useState("");
	const [AllTextCampaignData, setAllTextCampaignData] = useState([]);
	const [status, setstatus] = useState("all");
	const [DataInCSV, setDataInCSV] = useState('');
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 0, page: 0, sort: "id", order: "ASC" });
	const [columns, setcolumns] = useState([
		{
			label: "Campaign Name",
			value: "campaignName",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return (<span>{data[i].campaignName ? data[i].campaignName : "-"}</span>)
				},
			},
		},
		{
			label: "Description",
			value: "description",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return (<span>{data[i].description ? data[i].description : "-"}</span>)
				},
			},
		},
		{
			label: "Customer List Name",
			value: "groupname",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return (<span>{data[i].groupname ? data[i].groupname : "-"}</span>)
				},
			},
		},
		{
			label: "No. Of Customers",
			value: "customergroup",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return data[i].customergroup !== undefined ? <div>{data[i]?.customergroup[0]?.no_of_customer ? data[i]?.customergroup[0]?.no_of_customer : "-"}</div> : <div></div>;
				},
			},
		},
		{
			label: "Status",
			value: "status",
			options: {
				filter: true,
				sort: false,
				customBodyRender: (data, i) => {
					return (<span>{data[i].status ? data[i].status : "-"}</span>)
				},
			},
		},
		{
			label: "Date",
			value: "date",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].date ? data[i].date : "-"}</span>;
				},

			},
		},
		{
			label: "Action",
			value: "_id",
			options: {
				filter: false,
				sort: false,
				empty: true,
				setCellHeaderProps: () => ({ className: "text-center" }),
				setCellProps: () => ({ className: "text-center" }),
				customBodyRender: (data, i) => {
					return (
						<div className="table-ed-drop">
							<Dropdown drop="left">
								<Dropdown.Toggle className="table-dropdown-btn" id="dropdown-basic">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
										<path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
									</svg>
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item onClick={() => Navigate("/text-campaign-detail/", { state: { id: data[i]._id } })}>
										<bdi className="d-flex align-items-center">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
												<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
												<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
											</svg>
											<span className="ms-2">View Details</span>
										</bdi>
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					);
				},
			},
		},
	]);

	useEffect(() => {
		setid(location?.state?.id);
		getAllTextCampaign(option, status, location?.state?.id);
	}, [location?.state?.id]);

	const getAllTextCampaign = (option, status, id) => {
		let data = { id: id, status: status, option: option };
		const getAllTextCampaignPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getTextCampaignVendorwise, data));
		});

		getAllTextCampaignPromise.then((res) => {
			if (res.status === 200) {
				setAllTextCampaignData(res.data.data.textcampign);
				setoption({ ...option, totalRecord: res.data.data.totalRecord });
			}
		});
	};

	const getstatuswiseData = () => {
		const getstatuswiseDataPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.export_textcampaign, { status: status === "inactive" ? 0 : status === "active" ? 1 : "all" }));
		});
		getstatuswiseDataPromise.then((res) => {
			if (res.status === 200) {
				setDataInCSV(`${res.data}`)
			} else {
				toast.error(res.data.message)
			}
		});
	};

	const handleStatusWise = (e) => {
		setstatus(e.target.value);
		getAllTextCampaign(option, e.target.value, id);
	};

	const tableCallBack = (option) => {
		setoption(option);
		getAllTextCampaign(option, status, id);
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row align-items-center">
						<div className="col-md-5 col-sm-4">
							<div className="comn-title-main">
								<h1 className="mb-0">Text Campaigns</h1>
							</div>
						</div>
						<div className="col-md-7 col-sm-8 text-camp-rgt">
							<div className="text-campaign-select my-2">
								<select className="form-select comn-input-style" name="" onChange={(e) => handleStatusWise(e)}>
									<option value={"all"}>All</option>
									<option value={"sent"}>Sent</option>
									<option value={"draft"}>Draft</option>
									<option value={"scheduled"}>Schedule</option>
								</select>
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2" onClick={() => getstatuswiseData()}>
								<a className="btn-comn-class w-100" id="csv" href={AllTextCampaignData !== undefined && `data:text/csv;charset=utf-8,${escape(DataInCSV)}`} download="TextCampaignList.csv">Export</a>
							</div>
						</div>
						<div className="col-12">
							<div className="comn-table-black-bg">
								<div>
									<RtdDatatable option={option} columns={columns} data={AllTextCampaignData} tableCallBack={tableCallBack} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
