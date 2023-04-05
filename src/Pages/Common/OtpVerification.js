import React, { useState } from "react";
import Logo from "../../images/logo-main.svg";
import RightImage from "../../images/right-image-2.png";
import { useNavigate } from "react-router-dom";
import { API_Path } from "../../const";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import { PostApi } from "../../ApiService";

export default function OtpVerification() {
	const Navigate = useNavigate();
	const [email, setemail] = useState();
	const [otp, setotp] = useState();

	const verifyOtp = () => {
		let data = { email: email, otp: otp };
		const verifyOtpPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.verifyOtp, data));
		});
		verifyOtpPromise.then((res) => {
			if (res) {
				if (res.data.success) {
					toast.success(res.data.message);
					localStorage.removeItem("email");
					localStorage.setItem("token", res.data.token);
					if (localStorage.getItem("cartData")) {
						let data = { data: JSON.parse(localStorage.getItem("cartData")) };
					}
					Navigate("/");
				} else {
					toast.error(res.data.message);
				}
			}
		});
	};

	const handleChange = (value) => {
		setotp(value);
		if (value.length === 4) {
			verifyOtp();
		}
	};

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
										<div className="text-center pb-0">
											<h1>Phone Number Verification</h1>
											<p className="mt-2">Enter the code we just sent to the following number:</p>
										</div>
										<form className="row mb-0 frm-logo-top">
											<div className="col-12 mb-3">
												<label className="label-comn-text mb-2 d-block text-center">+1 405-229-3661</label>
												<div className="row">
													<div className="col-sm-6 mx-auto">
														<ul className="row pt-4 verify-input-box me-0">
															<li>
																<OtpInput value={otp} onChange={handleChange} numInputs={4} separator={<span style={{ width: "8px" }}></span>} isInputNum={true} shouldAutoFocus={true} inputStyle={{ border: "1px solid #605b6a4d", borderRadius: "8px", width: "54px", height: "54px", fontSize: "12px", color: "#000", fontWeight: "400", caretColor: "blue" }} containerStyle={{ justifyContent: "center" }} focusStyle={{ border: "1px solid #CFD3DB", outline: "none", boxShadow: "0 0 3px #1081e84d" }} />
															</li>
														</ul>
													</div>
												</div>
											</div>
											<div className="col-12 pt-4 text-center">
												<button type="submit" className="btn-comn-class w-100">
													SEND RESET LINK UP
												</button>
											</div>
										</form>
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
