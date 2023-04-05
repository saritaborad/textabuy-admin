import React, { useRef, useState } from "react";
import Logo from "../../images/logo-main.svg";
import RightImage from "../../images/right-image-2.png";
import { Formik } from "formik";
import * as Yup from "yup";

export default function ConnectStore() {
	const runforms = useRef();
	const [url, seturl] = useState();

	const submitFormData = (formData, resetForm) => {};

	let errorContainer = (form, field) => {
		return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
	};

	let formAttr = (form, field) => ({ onBlur: form.handleBlur, onChange: form.handleChange, value: form.values[field] });

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
											<h1>Connect your store</h1>
											<p className="mt-2">Please follow this step to sync your store</p>
										</div>
										<Formik
											innerRef={runforms}
											enableReinitialize
											initialValues={{
												url: url,
											}}
											validationSchema={Yup.object({
												url: Yup.string().url().required("Url is required."),
											})}
											onSubmit={(formData, { resetForm }) => submitFormData(formData, resetForm)}
										>
											{(runform) => (
												<form className="row mb-0 frm-logo-top" onSubmit={runform.handleSubmit}>
													<div className="col-12 mb-3">
														<label className="label-comn-text mb-2 d-block">Store URL</label>
														<input type="url" name="url" {...formAttr(runform, "url")} className="form-control comn-input-style" placeholder="Enter your store URL" />
														{errorContainer(runform, "url")}
													</div>
													<div className="col-12 pt-4 text-center">
														<button type="submit" className="btn-comn-class w-100">
															CONNECT
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
