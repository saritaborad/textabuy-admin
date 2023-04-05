import React, { useRef, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Formik } from "formik";
import * as Yup from "yup";
import Add from "../images/add.svg";
import Remove from "../images/minus.svg";
import { toast } from "react-toastify";
import { API_Path } from "../const";
import { PostApi } from "../ApiService";
import { useNavigate } from "react-router";

let FeatureFilterArray = [];

export default function NewSubscription() {
	const runforms = useRef();
	const Navigate = useNavigate();

	const [inputListUpdate, setinputListUpdate] = useState([]);
	const [inputList, setinputList] = useState([{ feature: "" }]);

	const addPlan = (formData, resetForm) => {
		const addPlanPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.createPlan, formData));
		});
		addPlanPromise.then((res) => {
			if (res.status === 200) {
				resetForm()
				Navigate("/settings");
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const errorContainer = (form, field) => {
		return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
	};

	const formAttr = (form, field) => ({ onBlur: form.handleBlur, onChange: form.handleChange, value: form.values[field] });

	const handleRemoveFeature = (id) => {
		const filteredFeature = FeatureFilterArray.filter((item) => item.id !== id);
		FeatureFilterArray = filteredFeature;
	};

	const handleInputChange = (e, index) => {
		const list = [...inputList];
		list[index][e.target.name] = e.target.value;
		setinputList(list);
		let result = list.map(({ feature }) => feature);
		setinputListUpdate(result);
	};

	const handleRemoveClick = (index) => {
		const list = [...inputList];
		list.splice(index, 1);
		setinputList(list);
	};

	const handleAddClick = () => {
		setinputList([...inputList, { feature: "" }]);
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">Add New Plan</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="detail-box-class">
								<Formik
									innerRef={runforms}
									enableReinitialize={true}
									initialValues={{
										planName: "",
										monthprice: "",
										description: "",
										mostpopular: "",
										features: inputListUpdate,
										status: true,
									}}
									validationSchema={Yup.object({
										planName: Yup.string().required("Subject is required."),
										monthprice: Yup.number("write should be digit").required("Monthly Price is required."),
										description: Yup.string().required("Description is required."),
									})}
									onSubmit={(formData, { resetForm }) => addPlan(formData, resetForm)}
								>
									{(runform) => (
										<form onSubmit={runform.handleSubmit} className="row">
											<div className="mb-3 col-lg-4">
												<label className="label-comn-text mb-2 d-block">Plan Name</label>
												<input type="text" name="planName" {...formAttr(runform, "planName")} className="form-control comn-input-style" placeholder="Enter the Plan name." />
												{errorContainer(runform, "planName")}
											</div>
											<div className="mb-3 col-lg-4">
												<label className="label-comn-text mb-2 d-block">Price per month</label>
												<input type="number" name="monthprice" {...formAttr(runform, "monthprice")} className="form-control comn-input-style" placeholder="Enter Monthly price." />
												{errorContainer(runform, "monthprice")}
											</div>
											<div className="mb-3 col-12">
												<label className="label-comn-text mb-2">Description</label>
												<textarea rows="5" name="description" {...formAttr(runform, "description")} className="form-control h-auto comn-input-style" placeholder="Enter Your Description"></textarea>
												{errorContainer(runform, "description")}
											</div>
											<div className="mb-3 col-12">
												<label className="label-comn-text mb-2">Features</label>
												<div className="App">
													{inputList.length > 0 && inputList.map((x, i) => {
														return (
															<div className="d-flex">
																<input className="form-control comn-input-style mb-2" name="feature" placeholder="Enter the feature" value={x.feature} onChange={(e) => handleInputChange(e, i)} />
																<div className="btn-box d-flex">
																	{inputList.length !== 1 && (
																		<button className="border-0 bg-transparent" type="button" onClick={() => handleRemoveClick(i)}>
																			<img src={Remove} alt="" />
																		</button>
																	)}
																	{inputList.length - 1 === i && (
																		<button className="border-0 bg-transparent" type="button" onClick={handleAddClick}>
																			<img src={Add} alt="" onClick={handleRemoveFeature} />
																		</button>
																	)}
																</div>
																{errorContainer(runform, "feature")}
															</div>
														);
													})}
												</div>
											</div>
											<div className="mb-3 col-12">
												<label className="label-comn-text mb-2">Most Popular Plan</label>
												<div className="form-check ms-auto form-switch me-1">
													<input className="form-check-input" type="checkbox" id="ActiveStatus" name="mostpopular" {...formAttr(runform, "mostpopular")} />
												</div>
											</div>
											<div className="col-md-6">
												<div className="row align-items-center">
													<div className="col-xl-4 col-6">
														<button type="submit" id="btn-plan" className="btn-comn-class w-100">
															<span className="position-relative">ADD</span>
														</button>
													</div>
													<div className="col-xl-4 col-6">
														<button className="btn-comn-class btn-dif-bg w-100" type="reset" onClick={() => Navigate("/settings")}>
															CANCEL
														</button>
													</div>
												</div>
											</div>
										</form>
									)}
								</Formik>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
