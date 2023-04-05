import React, { useContext, useEffect, useState } from "react";
import Logo from "../../images/logo-main.svg";
import Profile from "../../images/profile.png";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Context from "../../contexts/context";

export default function Header(props) {
	const context = useContext(Context);
	const Navigate = useNavigate();
	const [userDetail, set_userDetail] = useState("");

	useEffect(() => {
		set_userDetail(context.userDetail);
	}, [context.userDetail]);

	useEffect(() => {
		document.getElementById("idarrow").onclick = function () {
			document.getElementById("root").classList.toggle("dash-main-class-add");
		};
	}, [props]);

	const openUserinfo = () => {
		document.getElementById("user-detail").classList.toggle("active-user-info");
	};

	return (
		<header className="header-fix-top-cust">
			<nav className="navbar fixed-top">
				<ul className="d-flex align-items-center mr-auto align-items-center hdr-top-box">
					<li>
						<div className="hdr-logo-top text-xl-center d-flex align-items-center">
							<div id="idarrow" className="arrw-left-icon me-2 d-xl-none d-flex align-items-center justify-content-center fw-bold  ">
								<i className="bi bi-chevron-left d-flex align-items-center justify-content-center fw-bold"></i>
							</div>
							<Link to="/dashboard">
								<img src={Logo} className="img-fluid" alt="Text A Buy" />
							</Link>
						</div>
					</li>
				</ul>
				<ul className="d-flex align-items-center hdr-rgt-part" id="user-detail">
					<li>
						<div className="hdr-top-box-inr d-md-none mx-2 ">
							<div className="hdr-top-box-inr-icon">
								<i className="bi bi-search"></i>
							</div>
							<input type="search" className="form-control" name="searchbar" placeholder="Search" />
						</div>
					</li>
					<li>
						<div className="hdr-rgt-line mx-3"></div>
					</li>
					<li>
						<div className="hdr-profile-box d-flex align-items-center justify-content-center" onClick={() => Navigate("/myprofile")}>
							<div className="profile-pic">
								<img src={userDetail?.profile_img ? userDetail.profile_img : Profile} alt="profile" />
							</div>
							<div className="profil-detail-section ms-2">
								<span>{userDetail?.fname ? userDetail?.fname : ""}</span>
							</div>
						</div>
					</li>
				</ul>
				<div className="d-md-none ms-auto">
					<button type="button" className="border-0 bg-transparent p-0" onClick={openUserinfo}>
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
							<path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
						</svg>
					</button>
				</div>
			</nav>
		</header>
	);
}
