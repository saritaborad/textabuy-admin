import React, { useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import moment from "moment";
import { API_Path, LandingPageURL } from "../const";
import { PostApi } from "../ApiService";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import { useLocation, useNavigate } from "react-router";

export default function Customer(props) {
	const location = useLocation();
	const Navigate = useNavigate();
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 0, page: 0, sort: "id", order: "ASC" });
	const [AllCustomersData, setAllCustomersData] = useState([]);
	const [id, setid] = useState("");
	const [delete_modal_show, setdelete_modal_show] = useState(false);
	const columns = [
		{
			value: "photo",
			label: "Photo",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (data, i) => {
					return (
						<div className="member-pro-img h-auto">
							<img src={data[i].profile_img ? data[i].profile_img : "-"} alt="Profile" className="img-fluid" />
						</div>
					);
				},
			},
		},
		{
			label: "Name",
			value: "name",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].name ? data[i].name : "-"}</span>;
				},
			},
		},
		{
			label: "Email",
			value: "email",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].email ? data[i].email : "-"}</span>;
				},
			},
		},
		{
			label: "Age",
			value: "age",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].age ? data[i].age : "-"}</span>;
				},
			},
		},
		{
			label: "Date",
			value: "date",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].date ? moment(data[i].date).format("MM/DD/YYYY") : "-"}</span>;
				},
			},
		},
		{
			label: "Status",
			value: "status",
			options: {
				filter: true,
				customBodyRenderLite: (data, i) => {
					return (
						<div className="form-check form-switch d-inline-flex align-items-center justify-content-center">
							<input className="form-check-input" type="checkbox" id="Active1" />
							<label className="form-check-label ms-2 active-class" htmlFor="Active1">
								Active
							</label>
							<label className="form-check-label ms-2 inactive-class" htmlFor="Active1">
								Inactive
							</label>
						</div>
					);
				},
			},
		},
		{
			label: "Action",
			name: "_id",
			options: {
				filter: false,
				sort: false,
				empty: true,
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
									<Dropdown.Item onClick={() => Navigate(`/customer-detail/`, { state: { id: data[i]._id } })}>
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
		if (location?.state?.id !== undefined) {
			setid(location.state.id);
		} else {
			window.location.href = `${LandingPageURL}/dashboard`;
		}
	}, [location?.state?.id]);

	useEffect(() => {
		getAllCustomers(id, option);
	}, [id]);

	const getAllCustomers = (id, option) => {
		let data = { id: id, option: option };
		const getAllCustomersPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getVendorListById, data)));
		getAllCustomersPromise.then((res) => {
			if (res.status === 200) {
				setAllCustomersData(res.data.data.customer.map((element) => element));
			}
		});
	};

	const deleteCustomer = () => {};

	let tableCallBack = (option) => {
		setoption(option);
		getAllCustomers(id, option);
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row align-items-center">
						<div className="col-5">
							<div className="comn-title-main">
								<h1 className="mb-0">Customers</h1>
							</div>
						</div>
						<div className="col-7 text-camp-rgt">
							<div className="text-campaign-select my-2"></div>
						</div>
						<div className="col-12">
							<div className="comn-table-black-bg">
								<div>
									<RtdDatatable option={option} columns={columns} data={AllCustomersData} tableCallBack={tableCallBack} />
								</div>
							</div>
						</div>
					</div>

					{delete_modal_show && (
						<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn delted-modal" show={delete_modal_show} onHide={() => setdelete_modal_show(false)}>
							<Modal.Header closeButton className="border-0"></Modal.Header>
							<Modal.Body>
								<div className="text-center dltd-text-info">
									<svg width="62" height="78" viewBox="0 0 62 78" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M40.186 32.37L30.9993 41.5567L21.7694 32.37L15.6593 38.48L24.8894 47.6667L15.7027 56.8533L21.8127 62.9633L30.9993 53.7767L40.186 62.9633L46.296 56.8533L37.1093 47.6667L46.296 38.48L40.186 32.37ZM46.166 4.33333L41.8327 0H20.166L15.8327 4.33333H0.666016V13H61.3327V4.33333H46.166ZM4.99935 69.3333C4.99935 74.1 8.89935 78 13.666 78H48.3327C53.0993 78 56.9994 74.1 56.9994 69.3333V17.3333H4.99935V69.3333ZM13.666 26H48.3327V69.3333H13.666V26Z" fill="#EB5757" />
									</svg>
									<span className="modal-title d-block">Are you Sure?</span>
									<p>Do you really want to delete this List?</p>
									<div className="row">
										<div className="col-6">
											<button type="button" className="btn-comn-class w-100" onClick={deleteCustomer}>
												Yes
											</button>
										</div>
										<div className="col-6">
											<button type="button" className="btn-comn-class btn-red-bg w-100" onClick={() => setdelete_modal_show(false)}>
												No
											</button>
										</div>
									</div>
								</div>
							</Modal.Body>
						</Modal>
					)}
				</div>
			</div>
		</UserLayout>
	);
}
