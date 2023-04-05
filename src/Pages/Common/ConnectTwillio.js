import React, { useState } from "react";
import Logo from "../../images/logo-main.svg";
import RightImage from "../../images/right-image-2.png";
import { Modal } from "react-bootstrap";
import Success from "../../images/success.png";

export default function ConnectTwillio() {
	const [success_modal_show, setsuccess_modal_show] = useState();

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
											<h1>Connect Twillio</h1>
											<p className="mt-2">Please connect your twillio account for sms send</p>
										</div>
										<form className="row mb-0 frm-logo-top">
											<div className="col-12 text-center">
												<button type="button" className="btn-comn-class w-100" onClick={() => setsuccess_modal_show(true)}>
													Connect a Twillio
												</button>
												<div className="pt-4">
													<button type="submit" className="border-0 bg-transparent p-0 skip-btn-text text-capitalize">
														Skip
													</button>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{success_modal_show && (
				<Modal show={success_modal_show} onHide={() => setsuccess_modal_show(false)} size="xl">
					<Modal.Header closeButton>
						<Modal.Title>View Product Image</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="text-center success-class p-2">
							<div className="p-3">
								<img className="img-fluid" src={Success} alt="Successful" />
							</div>
							<h2>Successfully Connected!</h2>
							<p>Your Account has been successfully Connected.</p>
						</div>
					</Modal.Body>
				</Modal>
			)}
		</div>
	);
}
