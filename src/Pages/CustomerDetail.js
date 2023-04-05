import React, { useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import moment from "moment";
import { API_Path } from "../const";
import { PostApi } from "../ApiService";
import { toast } from "react-toastify";
import { useLocation } from "react-router";

export default function CustomerDetail() {
	const location = useLocation();
	const [AllCustomerDataById, setAllCustomerDataById] = useState("");

	useEffect(() => {
		get_customer_details(location?.state?.id);
	}, []);

	const get_customer_details = (id) => {
		const getcustomerDetailDataPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getCustomerById, { customerId: id }));
		});
		getcustomerDetailDataPromise.then((res) => {
			if (res.data.success) {
				setAllCustomerDataById(res.data.data);
			} else {
				toast.error(res.message);
			}
		});
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">Customer Details</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="detail-box-class">
								<div className="row">
									<div className="col-12">
										<div className="d-flex">
											<div className="sub-admin-photo">
												<span id="sub-admin-id">
													<img src={AllCustomerDataById.profile_img} alt="Profile" className="img-fluid" />
												</span>
											</div>
											<div className="ms-3 sub-admin-detail">
												<h3>{AllCustomerDataById.name}</h3>
												<div className="form-check form-switch d-inline-flex align-items-center justify-content-center">
													<input className="form-check-input" type="checkbox" id="Active1" />
												</div>
											</div>
										</div>
									</div>
									<div className="col-12 mt-5">
										<div className="personal-detail-section">
											<h5>Personal Detail</h5>
											<div className="mb-3 mt-4 row">
												<bdi className="col-xxl-2 col-sm-4">Email Address :</bdi>
												<span id="SA-email" className="col-xxl-10 col-sm-8">
													{AllCustomerDataById.email}
												</span>
											</div>
											<div className="mb-3 row">
												<bdi className="col-xxl-2 col-sm-4">Mobile Number :</bdi>
												<span className="col-xxl-10 col-sm-8" id="SA-phoneno">
													{AllCustomerDataById.contact_no}
												</span>
											</div>
											<div className="mb-3 row">
												<bdi className="col-xxl-2 col-sm-4">Date Of Birth :</bdi>
												<span className="col-xxl-10 col-sm-8" id="SA-dob">
													{moment(AllCustomerDataById.date).format("MM/DD/YYYY")}
												</span>
											</div>
											<div className="mb-3 row">
												<bdi className="col-xxl-2 col-sm-4">Age :</bdi>
												<span className="col-xxl-10 col-sm-8" id="SA-age">
													{AllCustomerDataById.age}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
