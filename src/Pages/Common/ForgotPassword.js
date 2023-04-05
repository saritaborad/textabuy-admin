import React, { useRef, useState } from "react";
import Logo from "../../images/logo-main.svg";
import RightImage from "../../images/right-image-2.png";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PostApi } from "../../ApiService";
import { API_Path } from "../../const";

export default function ForgotPassword() {
	const Navigate = useNavigate();
	const runforms = useRef();
	const [contact_no, setcontact_no] = useState();

	const forgotPassword = (formData, resetForm) => {
		const LoginPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.forgotpassword, formData));
		});
		LoginPromise.then((response) => {
			if (response.data.success === true) {
				localStorage.setItem("login", JSON.stringify(response["data"]));
				resetForm(formData);
				toast.success(response.data.message);
				Navigate("/otp-verification");
			} else {
				toast.error(response.data.message);
			}
		});
	};

	const errorContainer = (form, field) => {
		return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
	};

	const formAttr = (form, field) => ({ onBlur: form.handleBlur, onChange: form.handleChange, value: form.values[field] });

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-lg p-0 d-lg-block d-none">
					<div className="right-sid-img-info">
						<img src={RightImage} className="w-100" alt="Text A Buy" />
					</div>
				</div>
				<div className="col-lg-7 log-rgt-part p-0">
					<div className="login-side-box">
						<div className="login-side-main-scroll">
							<div className="login-side-main-inner mx-auto">
								<div className="login-side-fix-width">
									<div className="login-side-main-logo text-center pb-5">
										<img src={Logo} className="img-fluid" alt="Text A Buy" />
									</div>
									<div className="login-side-main-inner-white">
										<div className="text-center pb-4">
											<h1>Forget Password</h1>
											<p className="mt-2">Enter your email address and we’ll send a link to reset your password.</p>
										</div>
										<Formik
											innerRef={runforms}
											enableReinitialize
											initialValues={{ contact_no: contact_no }}
											validationSchema={Yup.object({
												contact_no: Yup.string().required("Phone Number is required."),
											})}
											onSubmit={(formData, { resetForm }) => forgotPassword(formData, resetForm)}
										>
											{(runform) => (
												<form className="row mb-0 frm-logo-top" onSubmit={runform.handleSubmit}>
													<div className="col-12 mb-3">
														<label className="label-comn-text mb-2 d-block">Phone Number</label>
														<input type="tel" name="contact_no" {...formAttr(runform, "contact_no")} className="form-control comn-input-style" placeholder="Enter Your Phone Number" autoComplete="off" />
														{errorContainer(runform, "contact_no")}
													</div>
													<div className="col-12 pt-4 text-center">
														<button type="submit" className="btn-comn-class w-100">
															SEND RESET LINK UP
														</button>
													</div>
												</form>
											)}
										</Formik>
									</div>
								</div>
							</div>
							<div className="text-center pt-3">
								<p className="mb-0 btm-login-link">
									Remember password? <a onClick={() => Navigate("/login")}>Sign In</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
