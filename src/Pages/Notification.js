import React, { useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import Email from "../images/email-notification.png";
import moment from "moment";
import { API_Path } from "../const";
import { PostApi } from "../ApiService";

export default function Notification() {
	const [allNotify, setallNotify] = useState([]);

	useEffect(() => {
		changeallNotify();
	}, []);

	const changeallNotify = () => {
		let data = { type: "admin", adminid: localStorage.getItem("id").toString() };
		const getAllCustomersPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.allNotify, data));
		});
		getAllCustomersPromise.then((res) => {
			if (res.status === 200) {
				setallNotify(res.data.data);
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
								<h1 className="mb-0">Notifications</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="set-chpwd-box">
								{allNotify.length > 0 &&
									allNotify.map((data, i) => {
										return (
											<div className="notification-comn-box">
												<div className="position-relative p-md-3 p-0 unseen-notification">
													<img src={Email} alt="Email notification" />
													<span className="active-notify"></span>
												</div>
												<div className="py-3">
													<h5>{data.subject}</h5>
													<span>{data.email}</span>
													<p>{data.description}</p>
												</div>
												<div className="ms-auto notify-rgt-side">
													<div className="notify-date px-2">
														<span>{moment(data.date).format("MM/DD/YYYY")}</span>
													</div>
												</div>
											</div>
										);
									})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
