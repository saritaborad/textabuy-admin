import React, { useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import moment from "moment";
import { API_Path } from "../const";
import { PostApi } from "../ApiService";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router";

export default function VendorList() {
	const Navigate = useNavigate();
	const [id, setid] = useState("");
	const [vendorList, setvendorList] = useState([]);
	const [status, setstatus] = useState("all");
	const [delete_modal_show, setdelete_modal_show] = useState(false);
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 0, page: 0, sort: "id", order: "ASC" });
	const [size_per_page, setsize_per_page] = useState([5, 10, 25, 50, 100]);
	const [DataInCSV, setDataInCSV] = useState('');

	useEffect(() => {
		getVendorListData(status, option);
	}, []);

	const getVendorListData = (status, option) => {
		let data = {
			status: status ? status : "all",
			option: option,
		};
		const addFilePromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.vendorlist, data));
		});
		addFilePromise.then((res) => {
			if (res.status === 200) {
				setvendorList(res.data.data.vendors);
				setoption({
					...option,
					totalRecord: res.data.data.totalRecord,
				});
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
		getVendorListData(e.target.value, option);
	};

	const vendorStatus = (value) => {
		const vendorStatusPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.vendorStatus, { vendorid: value }));
		});
		vendorStatusPromise.then((res) => {
			if (res) {
				if (res.data.success) {
					getVendorListData(status, option);
				} else {
					toast.error(res.data.message);
				}
			}
		});
	};

	const searchvendor = (value) => {
		const vendorStatusPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.searchvendor, { name: value }));
		});
		vendorStatusPromise.then((res) => {
			if (res) {
				if (res.status === 200) {
					setvendorList(res.data.data);
				} else {
					toast.error(res.data.message);
				}
			}
		});
	};

	const delete_handleClose = () => {
		setdelete_modal_show(false);
	};

	const delete_handleShow = () => {
		setdelete_modal_show(true);
	};

	const onDeleteSelect = (value) => {
		setid(value);
		delete_handleShow(status, option);
	};

	const deleteVendorList = () => {
		const deleteVendorListPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.deleteVendorList, { vendorid: id }));
		});
		deleteVendorListPromise.then((res) => {
			if (res) {
				if (res.data.success) {
					toast.success(res.data.message);
					delete_handleClose();
					getVendorListData(status, option);
				} else {
					delete_handleClose();
					toast.error(res.data.message);
				}
			}
		});
	};

	const handlePageChange = (pageNumber) => {
		let tmp_option = option;
		tmp_option["page"] = pageNumber["selected"];
		setoption(tmp_option);
		getVendorListData(status, tmp_option);
	};

	const tableCall = (e) => {
		let value = e.target.value;
		let name = e.target.name;
		let tmp_option = option;
		if (name === "search") {
			if (value !== "" && value.length > 2) {
				tmp_option[name] = value;
			} else {
				tmp_option[name] = "";
			}
			setoption(tmp_option);
			searchvendor(e.target.value)
		} else {
			if (value !== "") {
				tmp_option[name] = parseInt(value);
				tmp_option["page"] = 0;
				setoption(tmp_option);
				searchvendor(e.target.name)
				getVendorListData(status, option);
			}
		}
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row align-items-center">
						<div className="col-sm-5">
							<div className="comn-title-main">
								<h1 className="mb-0">Vendor List</h1>
							</div>
						</div>
						<div className="col-md-7 col-sm-8 text-camp-rgt">
							<div className="text-campaign-select my-2">
								<select className="form-select comn-input-style" name="customer-list" onChange={(e) => handleStatusWise(e)}>
									<option value={"all"}>All</option>
									<option value={"active"}>Active</option>
									<option value={"inactive"}>Inactive</option>
								</select>
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2" onClick={() => getstatuswiseData()}>
								<a className="btn-comn-class w-100" id="csv" href={vendorList !== undefined && `data:text/csv;charset=utf-8,${escape(DataInCSV)}`} download="vendorList.csv">Export</a>
							</div>
						</div>
						<div className="d-flex mb-2">
							<div className="ms-auto position-relative rtd-table-search-btn">
								<input type="search" name="search" className="form-control" onChange={tableCall} placeholder="Search ..." />
								<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M7.95473 1C6.57921 1 5.23459 1.40787 4.09089 2.17204C2.94719 2.93622 2.05579 4.02236 1.5294 5.29313C1.00301 6.5639 0.865287 7.96222 1.13364 9.31126C1.40199 10.6603 2.06436 11.8995 3.03699 12.8721C4.00963 13.8447 5.24884 14.507 6.59793 14.7754C7.94701 15.0437 9.34538 14.906 10.6162 14.3796C11.887 13.8533 12.9732 12.9619 13.7374 11.8182C14.5016 10.6746 14.9095 9.32997 14.9095 7.9545C14.9093 6.11009 14.1766 4.34125 12.8723 3.03706C11.5681 1.73286 9.7992 1.00012 7.95473 1V1Z" stroke="#5e5873" strokeWidth="1.875" strokeMiterlimit="10" />
									<path d="M13.143 13.1431L18.0001 18" stroke="#5e5873" strokeWidth="1.875" strokeMiterlimit="10" strokeLinecap="round" />
								</svg>
							</div>
						</div>
						<div className="col-12">
							<div className="detail-box-class vendor-detail-main">
								<div className="row">
									{vendorList &&
										vendorList.map((item, i) => {
											return (
												<div className="col-xxl-3 col-lg-4 col-sm-6 mb-3" key={i}>
													<div className="vendor-info-box">
														<div className="d-flex align-items-center mb-2">
															<span>Vendor Name:</span>
															<bdi className="ms-auto">
																{(item.fname || item.lname) ? `${item.fname + " " + item.lname}` : "-"}
															</bdi>
														</div>
														<div className="d-flex align-items-center mb-2">
															<span>No. of Customers:</span>
															<bdi className="ms-auto">{item.customer ? item.customer : "0"}</bdi>
														</div>
														<div className="d-flex align-items-center mb-2">
															<span>Last Reached:</span>
															<bdi className="ms-auto">{item.updatedAt ? moment(item.updatedAt).format("MM/DD/YYYY hh:mm a") : "-"}</bdi>
														</div>
														<div className="d-flex align-items-center mb-2">
															<span>Profile Created:</span>
															<bdi className="ms-auto">{item.createdAt ? moment(item.createdAt).format("MM/DD/YYYY hh:mm a") : "-"}</bdi>
														</div>
														<div className="form-check form-switch d-inline-flex align-items-center justify-content-center mb-2">
															<input className="form-check-input" type="checkbox" id="Active1" checked={item.status} onChange={() => vendorStatus(item._id)} />
														</div>
														<div className="d-flex align-items-center">
															<a className="view-detail-link" onClick={() => Navigate("/vendor-detail/", { state: { id: item._id } })}>
																View Details
															</a>
															<div className="table-ed-drop ms-auto">
																<Dropdown drop="left">
																	<Dropdown.Toggle className="table-dropdown-btn" id="dropdown-basic">
																		<svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
																			<path d="M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM14 0C12.9 0 12 0.9 12 2C12 3.1 12.9 4 14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 0 14 0ZM8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0Z" fill="#323232" />
																		</svg>
																	</Dropdown.Toggle>
																	<Dropdown.Menu>
																		<Dropdown.Item>
																			<bdi className="d-flex align-items-center" onClick={() => onDeleteSelect(item._id)}>
																				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
																					<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
																					<path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
																				</svg>
																				<span className="ms-2">Delete</span>
																			</bdi>
																		</Dropdown.Item>
																	</Dropdown.Menu>
																</Dropdown>
															</div>
														</div>
													</div>
												</div>
											);
										})}
								</div>
								<div className="row">
									<div className="col-12  d-md-flex align-items-center">
										<div className="custom-table-page text-start">
											Showing {parseInt(option.page * option.sizePerPage + 1)} to {parseInt(option.page * option.sizePerPage + option.sizePerPage) > option.totalRecord ? option.totalRecord : parseInt(option.page * option.sizePerPage + option.sizePerPage)} of {option.totalRecord} entries
										</div>

										<div className="ms-auto d-sm-flex align-items-center mt-3 mt-md-0">
											<div className="me-3 pegination-show-class">
												<label className="d-flex align-items-center custom-select-label">
													<span> Show</span>
													<select name="sizePerPage" className="form-select mx-2" defaultValue={option.sizePerPage} onChange={tableCall}>
														{size_per_page.map((val, i) => {
															return (
																<option key={i} value={val}>
																	{val}
																</option>
															);
														})}
													</select>
													<span>Entries</span>
												</label>
											</div>
											<div className="pagination-custom-info mt-3 mt-sm-0 d-flex align-items-center">
												<ReactPaginate
													className="pagination"
													pageClassName="page-item"
													activeClassName="active"
													breakLabel="..."
													breakLinkClassName="page-link"
													breakClassName="page-item"
													previousLabel={
														<span aria-hidden="true">
															<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left me-2">
																<polyline points="15 18 9 12 15 6"></polyline>
															</svg>
														</span>
													}
													previousClassName="page-item"
													nextLabel={
														<span aria-hidden="true">
															<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right ms-2">
																<polyline points="9 18 15 12 9 6"></polyline>
															</svg>
														</span>
													}
													nextClassName="page-item"
													pageLinkClassName="page-link"
													pageRangeDisplayed={4}
													onPageActive={option.page}
													pageCount={option.totalRecord / option.sizePerPage}
													renderOnZeroPageCount={null}
													onPageChange={handlePageChange.bind()}
													forcePage={option.page}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{delete_modal_show && (
							<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn delted-modal" show={delete_modal_show} onHide={delete_handleClose}>
								<Modal.Header closeButton className="border-0"></Modal.Header>
								<Modal.Body>
									<div className="text-center dltd-text-info">
										<svg width="62" height="78" viewBox="0 0 62 78" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M40.186 32.37L30.9993 41.5567L21.7694 32.37L15.6593 38.48L24.8894 47.6667L15.7027 56.8533L21.8127 62.9633L30.9993 53.7767L40.186 62.9633L46.296 56.8533L37.1093 47.6667L46.296 38.48L40.186 32.37ZM46.166 4.33333L41.8327 0H20.166L15.8327 4.33333H0.666016V13H61.3327V4.33333H46.166ZM4.99935 69.3333C4.99935 74.1 8.89935 78 13.666 78H48.3327C53.0993 78 56.9994 74.1 56.9994 69.3333V17.3333H4.99935V69.3333ZM13.666 26H48.3327V69.3333H13.666V26Z" fill="#EB5757" />
										</svg>
										<span className="modal-title d-block">Are You Sure?</span>
										<p>Do you really want to delete this List?</p>
										<div className="row">
											<div className="col-6">
												<button type="button" className="btn-comn-class w-100" onClick={deleteVendorList}>
													Yes
												</button>
											</div>
											<div className="col-6">
												<button type="button" className="btn-comn-class btn-red-bg w-100" onClick={delete_handleClose}>
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
			</div>
		</UserLayout>
	);
}
