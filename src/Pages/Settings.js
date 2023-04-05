import React, { useEffect, useRef, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import Success from "../images/success.png";
import { Dropdown } from "react-bootstrap";
import eyeCLose from "../../src/images/eye-close.svg";
import { Nav, Row, Col, Tab } from "react-bootstrap";
import { API_Path } from "../const";
import { PostApi } from "../ApiService";
import { useNavigate } from "react-router";

export default function Settings() {
	const runforms = useRef();
	const Navigate = useNavigate();
	const [delete_modal_show, setdelete_modal_show] = useState(false);
	const [pwd_success_modal_show, setpwd_success_modal_show] = useState(false);
	const [id, setid] = useState("");
	const [getAllPlan, setgetAllPlan] = useState([]);
	const [opass, setopass] = useState("password");
	const [npass, setnpass] = useState("password");
	const [cpass, setcpass] = useState("password");
	const [set_not1, setset_not1] = useState(false);
	const [set_not2, setset_not2] = useState(false);
	const [set_not3, setset_not3] = useState(false);

	useEffect(() => {
		getSubscriptionPlan();
		get_notification();
		if (document.getElementById("subscription")) {
			document.getElementById("addPlanButton").style.display = "block";
		} else {
			document.getElementById("addPlanButton").style.display = "none";
		}
	}, []);

	const errorContainer = (form, field) => {
		return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
	};

	const formAttr = (form, field) => ({ onBlur: form.handleBlur, onChange: form.handleChange, value: form.values[field] });

	const get_notification = () => {
		const getNotificationPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.get_notification));
		});
		getNotificationPromise.then((res) => {
			if (res.status === 200) {
				if (res.data.data.activity_notification.length > 0) {
					// setemail_remainder(res.data.data.activity_notification[0].email_remainder);
					// setpayment_decline(res.data.data.activity_notification[0].payment_decline);
					// setcustomerlist(res.data.data.activity_notification[0].change_customerlist);
					setset_not1(res.data.data?.activity_notification[0]?.email_remainder ?? false)
					setset_not2(res.data.data?.activity_notification[0]?.payment_decline ?? false)
					setset_not3(res.data.data?.activity_notification[0]?.change_customerlist ?? false)
				}
			}
		});
	};

	const submitPasswordData = (formData, resetForm) => {
		const changePasswordPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.changePassword, formData));
		});
		changePasswordPromise.then((res) => {
			if (res) {
				if (res.data.success) {
					toast.success(res.data.message);
					resetForm();
				} else {
					toast.error(res.data.message);
				}
			}
		});
	};

	const getSubscriptionPlan = () => {
		const getPlanPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getPlan, { type: "all" }));
		});
		getPlanPromise.then((res) => {
			if (res.status === 200) {
				let tempArr = [];
				tempArr = res.data.data?.newplan?.map((element) => {
					return element;
				});
				setgetAllPlan(tempArr);
			}
		});
	};

	const handledelete = (value) => {
		setid(value);
		setdelete_modal_show(true);
	};

	const deletePlan = () => {
		const deletePlanPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.deletePlan, { id: id }));
		});
		deletePlanPromise
			.then((res) => {
				if (res.status === 200) {
					toast.success(res.data.message);
					getSubscriptionPlan();
					setdelete_modal_show(false);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const PlanStatus = (value) => {
		const vendorStatusPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.planStatus, { id: value }));
		});
		vendorStatusPromise.then((res) => {
			if (res.status === 200) {
				getSubscriptionPlan();
			} else {
				toast.error(res.data.message);
			}
		});
	};

	// const change_email_remainder = (e) => {
	// 	if (e.target.checked) {
	// 		setemail_remainder(e.target.checked);
	// 		let data = { activity_notification: [{ email_remainder: email_remainder }] };
	// 		const activitynotificationPromise = new Promise((resolve, reject) => {
	// 			resolve(PostApi(API_Path.activity_update, data));
	// 		});
	// 		activitynotificationPromise.then((res) => {
	// 			if (res.status === 200) {
	// 				get_notification()
	// 			} else {
	// 				toast.error(res.data.message)
	// 			}
	// 		});
	// 	} else {
	// 		setemail_remainder(false);
	// 	}
	// };

	// const change_payment_decline = (e) => {
	// 	if (e.target.checked) {
	// 		setpayment_decline(e.target.checked);
	// 		let data = { activity_notification: [{ payment_decline: payment_decline }] };
	// 		const activitynotificationPromise = new Promise((resolve, reject) => {
	// 			resolve(PostApi(API_Path.activity_update, data));
	// 		});
	// 		activitynotificationPromise.then((res) => {
	// 			if (res.status === 200) {
	// 				get_notification()
	// 			} else {
	// 				toast.error(res.data.message)
	// 			}
	// 		});
	// 	} 
	// };

	// const change_customerlist = (e) => {
	// 	if (e.target.checked) {
	// 		setcustomerlist(e.target.checked);
	// 		let data = { activity_notification: [{  change_customerlist: customerlist }] };
	// 		const activitynotificationPromise = new Promise((resolve, reject) => {
	// 			resolve(PostApi(API_Path.activity_update, data));
	// 		});
	// 		activitynotificationPromise.then((res) => {
	// 			if (res.status === 200){
	// 				get_notification()
	// 			}else{
	// 				toast.error(res.data.message)
	// 			}
	// 		});
	// 	}
	// };

	const handleactivity = (e) => {
		if (e.target.name === "set_not1") {
			setset_not1(e.target.checked)
		} else if (e.target.name === "set_not2") {
			setset_not2(e.target.checked)
		} else if (e.target.name === "set_not3") {
			setset_not3(e.target.checked)
		}
		let data = {
			activity_notificatio: [{ email_remainder: e.target.name === "set_not1" ? e.target.checked : set_not1, payment_decline: e.target.name === "set_not2" ? e.target.checked : set_not2, change_customerlist: e.target.name === "set_not3" ? e.target.checked : set_not3 }]
		}
		const activitynotificationPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.activity_update, data));
		});
		activitynotificationPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message)
			} else {
				toast.error(res.data.message)
			}
		});
	}

	const handleSelect = (key) => {
		if (key === "subscription") {
			document.getElementById("addPlanButton").classList.add("btn-show-class");
			document.getElementById("addPlanButton").classList.remove("btn-hide-class");
		} else {
			document.getElementById("addPlanButton").classList.add("btn-hide-class");
			document.getElementById("addPlanButton").classList.remove("btn-show-class");
		}
	};

	const handleBasicPlan = () => { };

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row align-items-center justify-content-center">
						<div className="col-md-3">
							<div className="comn-title-main">
								<h1 className="mb-0">Settings</h1>
							</div>
						</div>
						<div className="col-md-9 text-camp-rgt">
							<div className="crt-campaign-btn crt-in-btn ms-auto my-2">
								<button type="button" className="btn-comn-class btn-show-class" id="addPlanButton" onClick={() => Navigate("/new-subscription")}>
									Add New Plan
								</button>
							</div>
						</div>
						<div className="col-12 settings-main-part text-center mt-3">
							<Tab.Container id="left-tabs-example" defaultActiveKey="subscription" onSelect={handleSelect}>
								<Row>
									<Col lg={3}>
										<Nav variant="pills" className="flex-lg-column mb-lg-0 mb-3 nav-tabs-custom-class">
											<Nav.Item id="subscription">
												<Nav.Link eventKey="subscription">Subscription</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey="change_password">Change Password</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey="notifications">Notifications</Nav.Link>
											</Nav.Item>
										</Nav>
									</Col>
									<Col lg={9}>
										<Tab.Content>
											{/* =================================================================== Subscription ===================================================== */}
											<Tab.Pane eventKey="subscription" id="subscription-tab">
												<div className="detail-box-class text-start p-md-4">
													<div>
														<div className="row justify-content-center">
															{getAllPlan.length > 0 &&
																getAllPlan.map((item, i) => {
																	return (
																		<div key={i} className="col-xxl-4 col-md-6 mt-4 mb-xl-0">
																			<div className="plan-box-list">
																				<div className="plan-box-list-top">
																					<div className="d-flex align-items-center">
																						<span className="d-block">{item.planName}</span>
																						<div className="form-check ms-auto form-switch set-net-width me-1">
																							<input className="form-check-input" type="checkbox" id="ActiveStatus" checked={item.status} onChange={() => PlanStatus(item._id)} />
																						</div>
																						<Dropdown drop="left" className="sub-admin-drop">
																							<Dropdown.Toggle className="table-dropdown-btn" id="dropdown-basic">
																								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
																									<path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
																								</svg>
																							</Dropdown.Toggle>
																							<Dropdown.Menu>
																								<Dropdown.Item>
																									<bdi className="d-flex align-items-center" onClick={() => Navigate("/edit-plan/", { state: { id: item._id } })}>
																										<bdi className="d-flex align-items-center">
																											<i className="bi bi-pencil"></i>
																											<span className="ms-2">Edit</span>
																										</bdi>
																									</bdi>
																								</Dropdown.Item>
																								<Dropdown.Item>
																									<bdi className="d-flex align-items-center" onClick={() => handledelete(item._id)}>
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
																					<bdi className="d-block">${item.monthprice}</bdi>
																					<p>Per month</p>
																					<p>{item.description}</p>
																				</div>
																				<div className="plan-box-list-ctr">
																					<ul>
																						{item.features &&
																							item.features.map((item, i) => {
																								return (
																									<li key={i}>
																										<span className="d-flex">
																											<i className="bi bi-check-lg me-2"></i>
																											{item}
																										</span>
																									</li>
																								);
																							})}
																					</ul>
																				</div>
																				<div className="plan-box-list-btm mt-auto pt-3">
																					<button type="button" className="w-100 d-block btn-comn-class">
																						Choose Plan
																					</button>
																				</div>
																			</div>
																		</div>
																	);
																})}
														</div>
													</div>
												</div>
											</Tab.Pane>
											{/* =================================================================== Change_password ===================================================== */}
											<Tab.Pane eventKey="change_password">
												<div className="login-side-main-inner-white set-chpwd-box">
													<div className="text-center pb-4">
														<h1>Change Password</h1>
													</div>
													<Formik
														innerRef={runforms}
														enableReinitialize={true}
														initialValues={{
															oldPassword: "",
															newPassword: "",
															retypepassword: "",
														}}
														validationSchema={Yup.object({
															oldPassword: Yup.string().required("Password is required."),
															newPassword: Yup.string()
																.when("oldPassword", {
																	is: (val) => (val && val.length > 0 ? true : false),
																	then: Yup.string().notOneOf([Yup.ref("oldPassword")], "Password must be different from old password."),
																})
																.required("Password is required."),
															retypepassword: Yup.string()
																.when("newPassword", {
																	is: (val) => (val && val.length > 0 ? true : false),
																	then: Yup.string().oneOf([Yup.ref("newPassword")], "Password must match."),
																})
																.required("Confirmation of Password is required."),
														})}
														onSubmit={(formData, { resetForm }) => submitPasswordData(formData, resetForm)}
													>
														{(runform) => (
															<form className="row frm-logo-top text-start" onSubmit={runform.handleSubmit}>
																<div className="col-12 form-group mb-3" id="passtoggler">
																	<label className="label-comn-text mb-2">Old Password</label>
																	<bdi className="d-block position-relative password-class">
																		<input type={opass} id="myInput" className="form-control comn-input-style" {...formAttr(runform, "oldPassword")} name="oldPassword" />
																		<div className="eye-icon" onClick={() => setopass(opass == "password" ? "text" : "password")}>
																			<i className={opass == "password" ? "bi bi-eye-slash" : "bi bi-eye"} />
																		</div>
																		{errorContainer(runform, "oldPassword")}
																	</bdi>
																</div>
																<div className="col-12 form-group mb-3" id="passtoggler2">
																	<label className="label-comn-text mb-2">New Password</label>
																	<bdi className="d-block position-relative password-class">
																		<input type={npass} className="form-control comn-input-style" {...formAttr(runform, "newPassword")} name="newPassword" id="myInput1" />
																		<div className="eye-icon" onClick={() => setnpass(npass == "password" ? "text" : "password")}>
																			<i className={npass == "password" ? "bi bi-eye-slash" : "bi bi-eye"} />
																		</div>
																		{errorContainer(runform, "newPassword")}
																	</bdi>
																</div>
																<div className="col-12 form-group mb-3" id="passtoggler3">
																	<label className="label-comn-text mb-2">Confirm Password</label>
																	<bdi className="d-block position-relative password-class">
																		<input type={cpass} id="myInput2" className="form-control comn-input-style" {...formAttr(runform, "retypepassword")} name="retypepassword" />
																		<div className="eye-icon" onClick={() => setcpass(cpass == "password" ? "text" : "password")}>
																			<i className={cpass == "password" ? "bi bi-eye-slash" : "bi bi-eye"} />
																		</div>
																		{errorContainer(runform, "retypepassword")}
																	</bdi>
																</div>
																<div className="col-12 form-group text-center">
																	<div className="row align-items-center justify-content-center">
																		<div className="col-xl-5 col-6">
																			<button type="submit" className="btn-comn-class w-100">
																				<span className="position-relative">SUBMIT</span>
																			</button>
																		</div>
																		<div className="col-xl-5 col-6">
																			<button type="button" className="btn-comn-class btn-dif-bg w-100">
																				CANCEL
																			</button>
																		</div>
																	</div>
																</div>
															</form>
														)}
													</Formik>
												</div>
											</Tab.Pane>
											{/* =================================================================== notifications ===================================================== */}
											<Tab.Pane eventKey="notifications">
												<div className="login-side-main-inner-white set-chpwd-box p-0 text-start">
													<div className="text-center p-4">
														<h1>Notifications</h1>
													</div>
													<form>
														<div className="notify-status pb-4">
															<div className="set-noti-part p-4">
																<h5>Activity</h5>
																<div className="row">
																	<div className="col-12 my-2">
																		<div className="form-check form-switch row align-items-center">
																			<input className="form-check-input col-1" name="set_not1" type="checkbox" checked={set_not1} id="set_not1" onChange={(e) => handleactivity(e)} />
																			<label className="form-check-label ms-2 col-11" htmlFor="set_not1">Email reminders for subscription updates</label>
																		</div>
																	</div>
																	<div className="col-12 my-2">
																		<div className="form-check form-switch row align-items-center">
																			<input className="form-check-input col-1" name="set_not2" type="checkbox" checked={set_not2} id="set_not2" onChange={(e) => handleactivity(e)} />
																			<label className="form-check-label ms-2 col-11" htmlFor="set_not2">When a payment is declined for the store owner and subscription</label>
																		</div>
																	</div>
																	<div className="col-12 my-2">
																		<div className="form-check form-switch row align-items-center">
																			<input className="form-check-input col-1" name="set_not3" type="checkbox" checked={set_not3} id="set_not3" onChange={(e) => handleactivity(e)} />
																			<label className="form-check-label ms-2 col-11" htmlFor="set_not3">When the customer list has changed</label>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</form>
												</div>
											</Tab.Pane>
										</Tab.Content>
									</Col>
								</Row>
							</Tab.Container>
						</div>
					</div>
					{pwd_success_modal_show && (
						<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn modal-md" show={pwd_success_modal_show} onHide={() => setpwd_success_modal_show(false)}>
							<Modal.Header closeButton className="border-0"></Modal.Header>
							<Modal.Body>
								<div className="text-center success-class p-2">
									<div className="p-3">
										<img className="img-fluid" src={Success} alt="Successful" />
									</div>
									<h2>Success!</h2>
									<p>Your password has been successfully updated.</p>
								</div>
							</Modal.Body>
						</Modal>
					)}

					{delete_modal_show && (
						<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn delted-modal" show={delete_modal_show} onHide={() => setdelete_modal_show(false)}>
							<Modal.Header closeButton className="border-0"></Modal.Header>
							<Modal.Body>
								<div className="text-center dltd-text-info">
									<svg width="62" height="78" viewBox="0 0 62 78" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M40.186 32.37L30.9993 41.5567L21.7694 32.37L15.6593 38.48L24.8894 47.6667L15.7027 56.8533L21.8127 62.9633L30.9993 53.7767L40.186 62.9633L46.296 56.8533L37.1093 47.6667L46.296 38.48L40.186 32.37ZM46.166 4.33333L41.8327 0H20.166L15.8327 4.33333H0.666016V13H61.3327V4.33333H46.166ZM4.99935 69.3333C4.99935 74.1 8.89935 78 13.666 78H48.3327C53.0993 78 56.9994 74.1 56.9994 69.3333V17.3333H4.99935V69.3333ZM13.666 26H48.3327V69.3333H13.666V26Z" fill="#EB5757" />
									</svg>
									<span className="modal-title d-block">Are you sure?</span>
									<p>Do you really want to delete this List?</p>
									<div className="row">
										<div className="col-6">
											<button type="button" className="btn-comn-class w-100" onClick={() => deletePlan()}>
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
