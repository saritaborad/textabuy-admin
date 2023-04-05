import React, { useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import { API_Path } from "../const";
import { PostApi } from "../ApiService";
import { useLocation } from "react-router";

export default function SubAdminDetail() {
	const location = useLocation();
	const [AllSubAdminDataById, setAllSubAdminDataById] = useState([]);

	useEffect(() => {
		getSingleSubAdmin(location?.state?.id);
	}, []);

	const getSingleSubAdmin = (id) => {
		const getSingleSubAdmin = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getSingleSubAdmin, { id: id }));
		});
		getSingleSubAdmin.then((res) => {
			if (res) {
				if (res.data.success) {
					setAllSubAdminDataById(res.data.data);
				}
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
								<h1 className="mb-0">Sub Admins</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="detail-box-class">
								<div className="row">
									<div className="col-12">
										<div className="d-flex">
											<div className="sub-admin-photo">
												<span id="sub-admin-id">
													<img src={AllSubAdminDataById.profile_img} alt="Profile" className="img-fluid" />
												</span>
											</div>
										</div>
									</div>
									<div className="col-12 mt-5">
										<div className="personal-detail-section">
											<h5>Personal Detail</h5>
											<div className="mb-3 mt-4 row">
												<bdi className="col-xxl-2 col-sm-4">Name :</bdi>
												<span id="SA-email" className="col-xxl-10 col-sm-8">
													{AllSubAdminDataById.fname ? AllSubAdminDataById?.fname : ""} {AllSubAdminDataById.lname ? AllSubAdminDataById.lname :""}
												</span>
											</div>
											<div className="mb-3 mt-4 row">
												<bdi className="col-xxl-2 col-sm-4">Email Address :</bdi>
												<span id="SA-email" className="col-xxl-10 col-sm-8">
													{AllSubAdminDataById.email ? AllSubAdminDataById.email : "-"}
												</span>
											</div>
											<div className="mb-3 row">
												<bdi className="col-xxl-2 col-sm-4">Mobile Number :</bdi>
												<span className="col-xxl-10 col-sm-8" id="SA-phoneno">
													{AllSubAdminDataById.contact_no ? AllSubAdminDataById.contact_no : "-"}
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
