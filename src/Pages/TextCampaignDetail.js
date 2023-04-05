import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import { PostApi } from "../ApiService";
import UserLayout from "../Components/User/UserLayout";
import { API_Path } from "../const";

export default function TextCampaignDetail() {
	const location = useLocation();
	const [uploadImg, setuploadImg] = useState([]);
	const [textCampaign_details, settextCampaign_details] = useState("");

	useEffect(() => {
		let id = location?.state?.id
		if (id !== "" && id !== undefined) {
			get_textCampaign_details(id);
		}
	}, [location?.state?.id]);

	const get_textCampaign_details = (_id) => {
		const gettextCampaignDetailDataPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getTextcampaignById, { id: _id }));
		});
		gettextCampaignDetailDataPromise.then((res) => {
			if (res.status === 200) {
				let tempArr = [];
				tempArr = res.data.data?.uploadImg?.map((element) => {
					return element;
				});
				settextCampaign_details(res.data.data);
				setuploadImg(tempArr);
			} else {
				toast.error(res.data.message);
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
								<h1 className="mb-0">Campaign Details</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="detail-box-class">
								<div className="row">
									<div className="col-12 mb-3">
										<div className="label-comn-text-1">Campaign Name</div>
										<div className="form-detail-text">
											<span id="camp-name">{textCampaign_details.campaignName}</span>
										</div>
									</div>
									<div className="col-12 mb-3">
										<div className="label-comn-text-1">Description</div>
										<div className="form-detail-text">
											<span id="description">{textCampaign_details.description}</span>
										</div>
									</div>
									<div className="col-12 mb-3">
										<div className="label-comn-text-1">Select products</div>
										<div className="form-detail-text">
											<span id="description">{textCampaign_details.selectProduct}</span>
										</div>
									</div>
									<div className="col-12 mb-3">
										<label className="label-comn-text">Products Variants</label>
										<div className="d-sm-flex align-items-center">
											<div className="d-flex me-3">
												<div className="label-comn-text-1 me-1">Color:</div>
												<div className="form-detail-text">
													{textCampaign_details &&
														textCampaign_details.product_variant.map((item, i) => {
															return (
																<span key={i} id="description">
																	{item.color}
																</span>
															);
														})}
												</div>
											</div>
											<div className="d-flex me-3">
												<div className="label-comn-text-1 me-1">Quantity:</div>
												<div className="form-detail-text">
													<span id="description">{textCampaign_details.quantity}</span>
												</div>
											</div>
											<div className="d-flex">
												<div className="label-comn-text-1 me-1">Size:</div>
												<div className="form-detail-text">
													{textCampaign_details &&
														textCampaign_details.product_variant.map((item, i) => {
															return (
																<span key={i} id="description">
																	{item.size}
																</span>
															);
														})}
												</div>
											</div>
										</div>
									</div>
									<div className="col-12">
										<div className="label-comn-text-1 mb-2">Product Image</div>
										<div className="form-detail-text">
											<span id="Add-img">
												<div className="row">
													<div className="col-xxl-1 col-xl-2  col-md-3 col-sm-4 col-6 mb-3 ms-0">
														<div className="add-img-class">
															<img src={textCampaign_details.productImage} className="img-fluid position-relative" alt="Product Image" />
														</div>
													</div>
												</div>
											</span>
										</div>
									</div>
									<div className="col-md-8 mb-3">
										<div className="label-comn-text-1">Text Message</div>
										<div className="form-detail-text">
											<span id="message">{textCampaign_details.textMsg}</span>
										</div>
									</div>
									<div className="col-12">
										<div className="label-comn-text-1 mb-2">Upload products Image</div>
										<div className="form-detail-text">
											<span id="Add-img">
												<div className="row">
													{uploadImg.length > 0 &&
														uploadImg.map((value, i) => {
															return (
																<div key={i} className="col-xxl-1 col-xl-2  col-md-3 col-sm-4 col-6 mb-3 ms-0">
																	<div className="add-img-class">
																		<img src={value} className="img-fluid position-relative" alt="add-pic" />
																	</div>
																</div>
															);
														})}
												</div>
											</span>
										</div>
									</div>
									<div className="col-12 mb-md-5 mb-3">
										<div className="label-comn-text-1">Scheduled</div>
										<div className="form-detail-text">
											<div className="scheduled-data">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar4 me-2" viewBox="0 0 16 16">
													<path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z" />
												</svg>
												<span className="form-detail-text me-4" id="sch-date">
													{textCampaign_details.date}
												</span>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock me-2" viewBox="0 0 16 16">
													<path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
													<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
												</svg>
												<span className="form-detail-text" id="sch-time">
													{textCampaign_details.time}
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
