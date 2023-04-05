import React, { useEffect, useRef, useState, useContext } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { API_Path, phoneRegExp } from "../const";
import { PostApi } from "../ApiService";
import moment from "moment";
import { useNavigate } from "react-router";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import loader from "../images/loader1.gif"
import Context from "../contexts/context";

export default function MyProfile() {
	const context = useContext(Context);
	const runforms = useRef();
	const Navigate = useNavigate();
	const [profile_image, setprofile_image] = useState('');
	const [isloader, setIsloader] = useState(false);
	const [login_user_data, setlogin_user_data] = useState();

	useEffect(() => {
		GetProfile();
	}, []);

	const GetProfile = () => {
		const addFilePromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.myprofile));
		});
		addFilePromise.then((res) => {
			if (res.status === 200) {
				setlogin_user_data(res.data.data)
				context.setlogin_user_details(res.data.data?.admin ? res.data.data.admin : res.data.data?.subadmin);
				setprofile_image(res.data.data?.admin ? res.data.data?.admin?.profile_img : res.data.data?.subadmin?.profile_img);
			}
		});
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
				setprofile_image(res.data.data.img[0])
				setIsloader(false)
			} else {
				setIsloader(false)
			}
		});
	}

	const submitFormData = (formData) => {
		const addFilePromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.updateprofile, formData));
		});
		addFilePromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				Navigate("/");
			} else {
				toast.error(res.data.message);
			}
		});
	}

	const PhonehandleOnChange = (value) => {
		let temp = "+" + value;
		runforms.current.setFieldValue("contact_no", temp);
	};

	const Datechange = (e) => {
		const ageDifMs = new Date() - new Date(e.target.value);
		const ageDate = new Date(ageDifMs);
		let Age = Math.abs(ageDate.getUTCFullYear() - 1970);
		runforms.current.setFieldValue("age", Age);
	};

	const errorContainer = (form, field) => {
		return form.touched[field] && form.errors[field] ? <span className="error text-danger">{form.errors[field]}</span> : null;
	};

	const formAttr = (form, field) => ({ onBlur: form.handleBlur, onChange: form.handleChange, value: form.values[field] });

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">My Profile</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="detail-box-class">
								<Formik
									innerRef={runforms}
									enableReinitialize={true}
									initialValues={{
										fname: login_user_data?.admin ? login_user_data.admin?.fname : login_user_data?.subadmin ? login_user_data?.subadmin?.fname : "",
										lname: login_user_data?.admin ? login_user_data.admin?.lname : login_user_data?.subadmin ? login_user_data?.subadmin?.lname : "",
										email: login_user_data?.admin ? login_user_data.admin?.email : login_user_data?.subadmin ? login_user_data?.subadmin?.email : "",
										age: login_user_data?.admin ? login_user_data?.admin?.age : login_user_data?.subadmin ? login_user_data?.subadmin?.age : "",
										contact_no: login_user_data?.admin ? login_user_data?.admin?.contact_no : login_user_data?.subadmin ? login_user_data?.subadmin?.contact_no : "",
										DOB: login_user_data?.admin ? moment(login_user_data?.admin.DOB).format("YYYY-MM-DD") : login_user_data?.subadmin ? moment(login_user_data?.subadmin.DOB).format("YYYY-MM-DD") : "",
										profile_img: login_user_data?.admin ? login_user_data?.admin?.profile_img : login_user_data?.subadmin ? login_user_data?.subadmin?.profile_img : "",
										status: true ? 1 : 0
									}}
									validationSchema={Yup.object({
										fname: Yup.string().required("First name is required."),
										lname: Yup.string().required("Last name is required."),
										email: Yup.string().email("enter valid email address.").required("Email is required."),
										DOB: Yup.date().max(new Date(Date.now() - 567648000000), "You must be at least 18 years").required("Date Of Birth is required."),
										contact_no: Yup.string().matches(phoneRegExp, "Mobile Number is not valid").required("Mobile Number is required."),
										profile_img: Yup.string().required("Profile image is required."),
										age: Yup.number().min(18).required("age is required."),
									})}
									onSubmit={(formData, { resetForm }) => submitFormData(formData, resetForm)}
								>
									{(runform) => (
										<form className="row" onSubmit={runform.handleSubmit}>
											<div className="col-12 mb-4">
												<div className="edit-member-image position-relative h-auto">
													{isloader ?
														<button type="button" className="position-relative img-prev-section loader-btn-div">
															<img className="" src={loader} alt="Loader" />
														</button>
														:
														<span id="member-photo">
															<img id="profile-id" src={profile_image} className="member-image img-fluid w-auto" alt="profile" />
														</span>
													}
													<div className="position-absolute bottom-0 end-0">
														<label htmlFor="profile-upload" className="upload-image-div">
															<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-camera" viewBox="0 0 16 16">
																<path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
																<path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
															</svg>
														</label>
														<input id="profile-upload" accept="image/*" name="upload_cont_img" type="file" hidden onChange={handleUploadImage} />
													</div>
												</div>
											</div>
											<div className="col-md-6 mb-3">
												<label className="label-comn-text-1 mb-2 d-block">First Name</label>
												<input type="text" className="form-control comn-input-style" placeholder="John" name="fname" {...formAttr(runform, "fname")} />
												{errorContainer(runform, "fname")}
											</div>
											<div className="col-md-6 mb-3">
												<label className="label-comn-text-1 mb-2 d-block">Last Name</label>
												<input type="text" className="form-control comn-input-style" placeholder="Doe" name="lname" {...formAttr(runform, "lname")} />
												{errorContainer(runform, "lname")}
											</div>
											<div className="col-md-6 mb-3">
												<label className="label-comn-text-1 mb-2 d-block">Email Address</label>
												<input type="email" className="form-control comn-input-style" placeholder="johndoe@gmail.com" name="email" {...formAttr(runform, "email")} />
												{errorContainer(runform, "email")}
											</div>
											<div className="col-md-6 mb-3">
												<label className="label-comn-text-1 mb-2 d-block">Mobile Number</label>
												<PhoneInput inputExtraProps={{ inputClass: "form-control style-input-class", name: "contact_no", required: true, autoFocus: true }} disableAreaCodes country={"us"} placeholder="Enter your phone number" value={login_user_data?.admin ? login_user_data?.admin?.contact_no : login_user_data?.subadmin?.contact_no} onChange={PhonehandleOnChange} />
												{errorContainer(runform, "contact_no")}
											</div>
											<div className="col-md-6 mb-3">
												<label className="label-comn-text-1 mb-2 d-block">Date of Birth</label>
												<input type="date" className="form-control comn-input-style" {...formAttr(runform, "DOB")} name="DOB" onChangeCapture={(e) => Datechange(e)} />
												{errorContainer(runform, "DOB")}
											</div>
											<div className="col-md-6 mb-3">
												<label className="label-comn-text-1 mb-2 d-block">Age</label>
												<input className="form-control comn-input-style" name="age" readOnly {...formAttr(runform, "age")} placeholder="Please Enter your age" type="number" />
												{errorContainer(runform, "age")}
											</div>
											<div className="col-12 my-3 text-center">
												<div className="row">
													<div className="col-xxl-2 col-md-3 col-6">
														<button type="submit" className="btn-comn-class w-100">ADD</button>
													</div>
													<div className="col-xxl-2 col-md-3 col-6">
														<button type="button" className="btn-comn-class btn-dif-bg w-100" onClick={() => Navigate("/")}>
															<span>cancel</span>
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
		</UserLayout >
	);
}
