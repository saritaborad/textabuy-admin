import React, { useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Dropdown } from "react-bootstrap";
import moment from "moment";
import { API_Path } from "../const";
import { PostApi } from "../ApiService";
import { toast } from "react-toastify";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import { useNavigate } from "react-router";

export default function CustomerCampaignVendors() {
	const Navigate = useNavigate();
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 0, page: 0, sort: "id", order: "ASC" });
	const [status, setstatus] = useState("all");
	const [DataInCSV, setDataInCSV] = useState('');
	const [vendorListData, setvendorListData] = useState([]);
	const columns = [
		{
			label: "Store Name",
			value: "store_name",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <div>{data[i].store_name ? data[i].store_name : "-"}</div>;
				},
			},
		},
		{
			label: "No. of Customers",
			value: "customer",
			options: {
				filter: true,
				sort: false,
				customBodyRender: (data, i) => {
					return <div>{data[i].customer ? data[i].customer : "-"}</div>;
				},
			},
		},
		{
			label: "Last Updated",
			value: "updatedAt",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].updatedAt ? moment(data[i].updatedAt).format("MM/DD/YYYY") : "-"}</span>;
				},
			},
		},
		{
			label: "Profile Created",
			value: "createdAt",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].createdAt ? moment(data[i].createdAt).format("MM/DD/YYYY") : "-"}</span>;
				},
			},
		},
		{
			label: "Status",
			value: "status",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].status === 1 ? "Active" : data[i].status === 0 ? "Inactive" : "-"}</span>;
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
									<Dropdown.Item onClick={() => Navigate(`/customer-list/`, { state: { id: data[i]._id } })}>
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
	];

	useEffect(() => {
		getVendorListData(option, status);
	}, []);

	const getVendorListData = (option, status) => {
		let data = {
			option: option,
			status: status ? status : "all"
		}
		const addFilePromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.vendorlist, data));
		});
		addFilePromise.then((res) => {
			if (res.data.success === true) {
				let tempArr = [];
				tempArr = res.data.data?.vendors?.map((element) => {
					return element;
				});
				setvendorListData(tempArr);
				setoption({ ...option, totalRecord: res.data.data.totalRecord });
			}
		});
	};

	const getstatuswiseData = () => {
		const getstatuswiseDataPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.export_user, { status: status === "inactive" ? 0 : status === "active" ? 1 : "all" }));
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
		getVendorListData(option, e.target.value)
	}

	let tableCallBack = (option) => {
		setoption(option);
		getVendorListData(option, status);
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-5">
							<div className="comn-title-main">
								<h1 className="mb-0">Customers</h1>
							</div>
						</div>
						<div className="col-md-7 col-sm-8 text-camp-rgt">
							<div className="text-campaign-select my-2">
								<select className="form-select comn-input-style" name="" onChange={(e) => handleStatusWise(e)}>
									<option value={"all"}>All</option>
									<option value={"active"}>Active</option>
									<option value={"inactive"}>Inactive</option>
								</select>
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2" onClick={() => getstatuswiseData()}>
								<a className="btn-comn-class w-100" id="csv" href={vendorListData !== undefined && `data:text/csv;charset=utf-8,${escape(DataInCSV)}`} download="CustomerCampaignVendorList.csv">Export</a>
							</div>
						</div>
						<div className="col-12">
							<div className="comn-table-black-bg">
								<div>
									<RtdDatatable option={option} columns={columns} data={vendorListData} tableCallBack={tableCallBack} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
