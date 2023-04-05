import React, { useEffect, useRef, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import { API_Path, phoneRegExp } from "../const";
import loader from "../../src/images/loader1.gif"
import { PostApi } from "../ApiService";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import { useNavigate } from "react-router";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

var startdate = moment();
startdate = startdate.subtract(18, "years");
startdate = startdate.format("YYYY-MM-DD");

export default function SubAdmin() {
	const runforms = useRef();
	const Navigate = useNavigate();
	const [profile_img, setprofileImage] = useState('');
	const [status, setstatus] = useState();
	const [isloader, setIsloader] = useState(false);
	const [isloader2, setIsloade2] = useState(false);
	const [addSubadmin_modal_show, setaddSubadmin_modal_show] = useState(false);
	const [editSubadmin_modal_show, seteditSubadmin_modal_show] = useState(false);
	const [AllSubAdminData, setAllSubAdminData] = useState([]);
	const [SubadminData, setSubadminData] = useState('');
	const [DataInCSV, setDataInCSV] = useState('');
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 0, page: 0, sort: "id", order: "ASC" });
	const columns = [
		{
			value: "profile_img",
			label: "Photo",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (data, i) => {
					return <img src={(data[i].profile_img !== "" || data[i].profile_img !== undefined) ? data[i].profile_img : 'https://rentechtest112.s3.amazonaws.com/textABuy/Imagesundefined_OUM28q.webp'} className="table-profile-image rounded" alt="" width="60px" height="60px" />;
				},
			},
		},
		{
			value: "fname",
			label: "User’s Name",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (data, i) => {
					return <div>{data[i].fname ? data[i].fname : "-"}</div>
				},
			},
		},
		{
			value: "email",
			label: "Email",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (data, i) => {
					return <div>{data[i].email ? data[i].email : "-"}</div>
				},
			},
		},
		{
			value: "contact_no",
			label: "Phone",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (data, i) => {
					return <div>{data[i].contact_no ? data[i].contact_no : "-"}</div>
				},
			},
		},
		{
			value: "joiningdate",
			label: "Joining Date",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (data, i) => {
					return <span>{data[i].joiningdate ? moment(data[i].joiningdate).format("MM/DD/YYYY") : "-"}</span>
				},
			},
		},
		{
			value: "status",
			label: "Status",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (data, i) => {
					return (
						<div className="form-check form-switch d-inline-flex align-items-center justify-content-center">
							<input className="form-check-input" type="checkbox" id="ActiveStatus" checked={data[i].status} onChange={() => SubadminStatus(data[i]._id)} />
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
									<Dropdown.Item onClick={() => getSingleSubAdmin(data[i]._id)}>
										<bdi className="d-flex align-items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												fill="currentColor"
												className="bi bi-pencil"
												viewBox="0 0 16 16"
											>
												<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
											</svg>
											<span className="ms-2">Edit</span>
										</bdi>
									</Dropdown.Item>
									<Dropdown.Item onClick={() => Navigate("/sub-admin-detail/", { state: { id: data[i]._id } })}>
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
		getAllSubAdmin(option, status);
	}, []);

	const getAllSubAdmin = (option, status) => {
		let data = {
			option: option,
			status: status ? status : "all"
		}
		const getAllSubAdminPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getAllSubAdmin, data));
		});
		getAllSubAdminPromise.then((res) => {
			if (res.status === 200) {
				let tempArr = [];
				tempArr = res.data.data?.subadmin?.map((element) => {
					return element;
				});
				setAllSubAdminData(tempArr);
				setoption({ ...option, totalRecord: res.data.data.totalRecord });
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const addSubAdmin = (formData) => {
		setIsloade2(true)
		const addSubAdminPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.addSubAdmin, formData));
		});
		addSubAdminPromise
			.then((res) => {
				if (res.status === 200) {
					setIsloade2(false)
					toast.success(res.data.message);
					add_SubadminClose();
					getAllSubAdmin(option, status);
					setprofileImage("")
				} else {
					toast.error(res.data.message);
					setIsloade2(false)
				}
			})
			.catch((error) => {
				console.log(error);
				setIsloade2(false)
			});
	}

	const handleditSubAdmin = (formData, resetForm) => {
		setIsloade2(true)
		const editSubAdminPromis = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.editSubAdmin, formData));
		});
		editSubAdminPromis.then((res) => {
			if (res.status === 200) {
				setIsloade2(false)
				toast.success(res.data.message);
				getAllSubAdmin(option, status);
				setprofileImage("");
				edit_SubadminClose();
				resetForm(formData)
			} else {
				setIsloade2(false)
				toast.error(res.data.message);
			}
			setstatus(false);
			setIsloade2(false)
			setprofileImage("");
		});
	}

	const add_SubadminShow = () => {
		setaddSubadmin_modal_show(true);
	};
	const edit_SubadminShow = () => {
		seteditSubadmin_modal_show(true);
	};

	const add_SubadminClose = () => {
		setaddSubadmin_modal_show(false)
		setprofileImage("");
	};
	const edit_SubadminClose = () => {
		seteditSubadmin_modal_show(false)
		setprofileImage("");
	};

	const handleUploadImage = (e) => {
		setIsloader(true)
		let formData = new FormData();
		formData.append("images", e.target.files[0]);
		const addFilePromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.addFile, formData));
		});
		addFilePromise.then((res) => {
			if (res.status === 200) {
				setIsloader(false)
				setprofileImage(res.data.data.img[0])
				runforms.current.setFieldValue("profile_img", res.data.data.img[0])
			} else {
				setIsloader(false)
			}
			setIsloader(false)
		});
	};

	const SubadminStatus = (value) => {
		const vendorStatusPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.subadminStatus, { id: value }));
		});
		vendorStatusPromise.then((res) => {
			if (res.status === 200) {
				getAllSubAdmin(option, status);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const errorContainer = (form, field) => {
		return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
	};

	const formAttr = (form, field) => ({ onBlur: form.handleBlur, onChange: form.handleChange, value: form.values[field] });

	let tableCallBack = (option) => {
		setoption(option);
		getAllSubAdmin(option, status);
	};

	const handleStatusWise = (e) => {
		setstatus(e.target.value);
		getAllSubAdmin(option, e.target.value)
	}

	const PhonehandleOnChange = (value) => {
		let temp = "+" + value;
		runforms.current.setFieldValue("contact_no", temp);
	};

	const getSingleSubAdmin = (id) => {
		edit_SubadminShow()
		const getSingleSubAdmin = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getSingleSubAdmin, { id: id }));
		});
		getSingleSubAdmin.then((res) => {
			if (res.status === 200) {
				setSubadminData(res.data.data)
				setprofileImage(res.data.data.profile_img)
			}
		});
	};

	const getstatuswiseData = () => {
		const getstatuswiseDataPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.exportAdminSubadmin, { status: status === "inactive" ? 0 : status === "active" ? 1 : "all" }));
		});
		getstatuswiseDataPromise.then((res) => {
			if (res.status === 200) {
				setDataInCSV(`${res.data}`)
			} else {
				toast.error(res.data.message)
			}
		});
	};

	return (
		<UserLayout>
			<>
				<div className="content-wrapper-section">
					<div className="container-fluid">
						<div className="row align-items-center">
							<div className="col-md-4 col-sm-3">
								<div className="comn-title-main">
									<h1 className="mb-0">Sub Admins</h1>
								</div>
							</div>
							<div className="col-md-8 col-sm-9 text-camp-rgt">
								<div className="text-campaign-select my-2">
									<select className="form-select comn-input-style" name="customer-list" onChange={(e) => handleStatusWise(e)}>
										<option value={"all"}>All</option>
										<option value={"active"}>Active</option>
										<option value={"inactive"}>Inactive</option>
									</select>
								</div>
								<div className="crt-campaign-btn crt-in-btn  my-2">
									<button type="button" className="btn-comn-class w-100" onClick={add_SubadminShow}>
										Add Sub Admins
									</button>
								</div>
								<div className="crt-campaign-btn crt-in-btn  my-2" onClick={() => getstatuswiseData()}>
									<a className="btn-comn-class w-100" id="csv" href={AllSubAdminData !== undefined &&`data:text/csv;charset=utf-8,${escape(DataInCSV)}`} download="subadminList.csv">Export</a>
								</div>
							</div>
							<div className="col-12">
								<div className="comn-table-black-bg">
									<div>
										<RtdDatatable option={option} columns={columns} data={AllSubAdminData} tableCallBack={tableCallBack} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{addSubadmin_modal_show && (
					<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn modal-lg" show={addSubadmin_modal_show} onHide={add_SubadminClose} backdrop="static">
						<Modal.Header closeButton className="border-0">
							<Modal.Title className="w-100">
								<span className="modal-title">New Sub admin</span>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Formik
								innerRef={runforms}
								initialValues={{
									fname: "",
									lname: "",
									email: "",
									DOB: "",
									contact_no: "",
									profile_img: profile_img,
									status: true,
								}}
								validationSchema={Yup.object({
									fname: Yup.string().required("First name is required."),
									lname: Yup.string().required("Last name is required."),
									email: Yup.string().email("enter valid email address.").required("Email is required."),
									DOB: Yup.date().max(new Date(Date.now() - 567648000000), "You must be at least 18 years").required("Date Of Birth is required."),
									profile_img: Yup.string().required("Profile image is required."),
									contact_no: Yup.string().matches(phoneRegExp, "Mobile Number is not valid").required("Mobile Number is required."),
								})}
								onSubmit={(formData, { resetForm }) => {
									addSubAdmin(formData);
								}}
							>
								{(runform) => (
									<form onSubmit={runform.handleSubmit} className="row">
										<div className="mb-3 col-6">
											<label className="label-comn-text mb-2 d-block">First Name</label>
											<input type="text" name="fname" {...formAttr(runform, "fname")} className="form-control comn-input-style" placeholder="Enter Your First Name" />
											{errorContainer(runform, "fname")}
										</div>
										<div className="mb-3 col-6">
											<label className="label-comn-text mb-2 d-block">Last Name</label>
											<input type="text" name="lname" {...formAttr(runform, "lname")} className="form-control comn-input-style" placeholder="Enter Your Last Name" />
											{errorContainer(runform, "lname")}
										</div>
										<div className="mb-3 col-12">
											<label className="label-comn-text mb-2 d-block">Email Address</label>
											<input type="email" name="email" {...formAttr(runform, "email")} placeholder="Enter Your Email Address" className="form-control comn-input-style" />
											{errorContainer(runform, "email")}
										</div>
										<div className="mb-3 col-6">
											<label className="label-comn-text mb-2 d-block">Date Of Birth</label>
											<input type="date" name="DOB" {...formAttr(runform, "DOB")} className="form-control comn-input-style" placeholder="Enter Your Date Of Birth" max={startdate} />
											{errorContainer(runform, "DOB")}
										</div>
										<div className="col-md-6 mb-3">
											<label className="label-comn-text-1 mb-2 d-block">Mobile Number</label>
											<PhoneInput inputExtraProps={{ inputClass: "form-control style-input-class", name: "contact_no", required: true, autoFocus: true }} disableAreaCodes country={"us"} placeholder="Enter your phone number" onChange={PhonehandleOnChange} />
											{errorContainer(runform, "contact_no")}
										</div>
										<div className="mb-3 col-6">
											{isloader ?
												<button type="button" className="position-relative img-prev-section loader-btn-div">
													<img class="" src={loader} alt="Loader" />
												</button>
												:
												<div className="position-relative img-prev-section">
													<span id="member-photo">{<img src={profile_img} className="member-image img-fluid" alt="" />}</span>
													<div className="position-absolute bottom-0 end-0">
														<label htmlFor="profile-upload" className="upload-image-div">
															<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-camera" viewBox="0 0 16 16">
																<path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
																<path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
															</svg>
														</label>
														<input id="profile-upload" accept="image/*" name="profile_img" type="file" onChange={(e) => handleUploadImage(e)} hidden />
													</div>
												</div>
											}
											{errorContainer(runform, "profile_img")}
										</div>
										<div className="col-12">
											<div className="row me-0">
												<div className="col-6 pe-0">
													{
														isloader2 ?
															<button type="button" className="w-100 add-btns-new loader-btn-div">
																< img className="" src={loader} alt="Loader" />
															</button>
															:
															<button type="submit" id="addbtn-subAdmin" className="w-100 add-btns-new">
																Add
															</button>}
												</div>
												<div className="col-6 pe-0">
													<button type="button" className="w-100 cancel-btns-new" onClick={() => add_SubadminClose()}>
														<span>cancel</span>
													</button>
												</div>
											</div>
										</div>
									</form>
								)}
							</Formik>
						</Modal.Body>
					</Modal>
				)}

				{editSubadmin_modal_show &&
					(<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn modal-lg" show={editSubadmin_modal_show} onHide={edit_SubadminClose} backdrop="static">
						<Modal.Header closeButton className="border-0">
							<Modal.Title className="w-100">
								<span className="modal-title">Edit SubAdmin</span>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Formik
								innerRef={runforms}
								enableReinitialize={true}
								initialValues={{
									_id: SubadminData?._id,
									fname: SubadminData?.fname ? SubadminData.fname : "",
									lname: SubadminData?.lname ? SubadminData.lname : "",
									email: SubadminData?.email ? SubadminData.email : "",
									DOB: SubadminData?.DOB ? moment(SubadminData?.DOB).format("YYYY-MM-DD") : "",
									contact_no: SubadminData?.contact_no ? SubadminData.contact_no : "",
									password: "",
									profile_img: profile_img,
									status: SubadminData?.status ? SubadminData.status : false,
								}}
								validationSchema={Yup.object({
									fname: Yup.string().required("First name is required."),
									lname: Yup.string().required("Last name is required."),
									profile_img: Yup.string().required("Profile image is required."),
									email: Yup.string().email("enter valid email address.").required("Email is required."),
									DOB: Yup.date().max(new Date(Date.now() - 567648000000), "You must be at least 18 years").required("Date Of Birth is required."),
									contact_no: Yup.string().matches(phoneRegExp, "Mobile Number is not valid").required("Mobile Number is required."),
									password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),
								})}
								onSubmit={(formData, { resetForm }) => {
									handleditSubAdmin(formData, resetForm);
								}}
							>
								{(runform) => (
									<form onSubmit={runform.handleSubmit} className="row">
										<div className="mb-3 col-6">
											<label className="label-comn-text mb-2 d-block">First Name</label>
											<input type="text" name="fname" {...formAttr(runform, "fname")} className="form-control comn-input-style" placeholder="Enter Your First Name" />
											{errorContainer(runform, "fname")}
										</div>
										<div className="mb-3 col-6">
											<label className="label-comn-text mb-2 d-block">Last Name</label>
											<input type="text" name="lname" {...formAttr(runform, "lname")} className="form-control comn-input-style" placeholder="Enter Your Last Name" />
											{errorContainer(runform, "lname")}
										</div>
										<div className="mb-3 col-12">
											<label className="label-comn-text mb-2 d-block">Email Address</label>
											<input type="email" name="email" {...formAttr(runform, "email")} placeholder="Enter Your Email Address" className="form-control comn-input-style" />
											{errorContainer(runform, "email")}
										</div>
										<div className="mb-3 col-6">
											<label className="label-comn-text mb-2 d-block">Date Of Birth</label>
											<input type="date" className="form-control comn-input-style" {...formAttr(runform, "DOB")} name="DOB" />
											{errorContainer(runform, "DOB")}
										</div>
										<div className="col-md-6 mb-3">
											<label className="label-comn-text-1 mb-2 d-block">Mobile Number</label>
											<PhoneInput inputExtraProps={{ inputClass: "form-control-PhoneInput", name: "contact_no", required: true, autoFocus: true }} disableAreaCodes country={"us"} placeholder="Enter your phone number" value={SubadminData.contact_no} onChange={PhonehandleOnChange} />
											{errorContainer(runform, "contact_no")}
										</div>
										<div className="mb-3 col-12">
											<label className="label-comn-text mb-2 d-block">Password</label>
											<input type="text" name="password" {...formAttr(runform, "password")} placeholder="Enter Your Password" className="form-control comn-input-style" />
											{errorContainer(runform, "password")}
										</div>
										<div className="mb-3 col-6">
											{isloader ?
												<button type="button" className="position-relative img-prev-section loader-btn-div">
													<img class="" src={loader} alt="Loader" />
												</button>
												:
												<div className="position-relative img-prev-section">
													<span id="member-photo"><img src={profile_img} className="member-image img-fluid" alt="" /></span>
													<div className="position-absolute bottom-0 end-0">
														<label htmlFor="profile-upload" className="upload-image-div">
															<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-camera" viewBox="0 0 16 16">
																<path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
																<path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
															</svg>
														</label>
														<input id="profile-upload" accept="image/*" name="profile_img" type="file" onChange={(e) => handleUploadImage(e)} hidden />
													</div>
												</div>}
											{errorContainer(runform, "profile_img")}
										</div>
										<div className="col-12 d-flex">
											{isloader2 ?
												<button type="button" className="btn-comn-class w-100 loader-btn-div">
													< img className="" src={loader} alt="Loader" />
												</button>
												:
												<div className="col-6">
													<button type="submit" id="editbtn-subAdmin" className="btn-comn-class w-100">
														Update
													</button>
												</div>}
											<div className="col-6">
												<button type="button" className="btn-comn-class btn-dif-bg w-100" onClick={edit_SubadminClose}>
													<span>cancel</span>
												</button>
											</div>
										</div>
									</form>
								)}
							</Formik>
						</Modal.Body>
					</Modal>
					)}
			</>
		</UserLayout >
	);
}
