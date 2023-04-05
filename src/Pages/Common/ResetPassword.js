import React, { useEffect, useRef, useState } from "react";
import Logo from "../../images/logo-main.svg";
import RightImage from "../../images/right-image-2.png";
import { Formik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router";
import { API_Path } from "../../const";
import { PostApi } from "../../ApiService";
import { toast } from "react-toastify";

export default function ResetPassword(props) {
	const runforms = useRef();
	const location = useLocation();
	const Navigate = useNavigate();
	const [reset_token, set_reset_token] = useState("")

	useEffect(() => {
		set_reset_token(location.search.slice(1))
	}, [location])

	const submitFormData = (formData, resetForm) => {
		const resetPasswordPromise = new Promise((resolve, reject) => {
			resolve(PostApi(`${API_Path.ResetSubAdminPassword}/${reset_token}`, { password: formData.password }));
		});
		resetPasswordPromise.then((response) => {
			if (response.data.success === true) {
				localStorage.removeItem('admin-token')
				toast.success("Change password Successful");
				Navigate("/login");
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
											<h1>Reset Password</h1>
											<p className="mt-2">Choose a new password for your store account and continue selling with us.</p>
										</div>
										<Formik
											innerRef={runforms}
											enableReinitialize
											initialValues={{
												password: "",
												confrim_password: "",
											}}
											validationSchema={Yup.object({
												password: Yup.string().required("Password is required."),
												confrim_password: Yup.string()
													.when("password", {
														is: (val) => (val && val.length > 0 ? true : false),
														then: Yup.string().oneOf([Yup.ref("password")], "Password must match."),
													})
													.required("Confirmation of Password is required."),
											})}
											onSubmit={(formData, { resetForm }) => submitFormData(formData, resetForm)}
										>
											{(runform) => (
												<form className="row mb-0 frm-logo-top" onSubmit={runform.handleSubmit}>
													<div className="col-12 mb-3">
														<label className="label-comn-text mb-2 d-block">Password</label>
														<input type="password" name="password" {...formAttr(runform, "password")} className="form-control comn-input-style" placeholder="Enter password" />
														{errorContainer(runform, "password")}
													</div>
													<div className="col-12 mb-3">
														<label className="label-comn-text mb-2 d-block">Confrim Password</label>
														<input type="password" name="confrim_password" {...formAttr(runform, "confrim_password")} className="form-control comn-input-style" placeholder="Enter confrim password" />
														{errorContainer(runform, "confrim_password")}
													</div>
													<div className="col-12 pt-4 text-center">
														<button type="submit" className="btn-comn-class w-100">
															RESET PASSWORD
														</button>
													</div>
												</form>
											)}
										</Formik>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
