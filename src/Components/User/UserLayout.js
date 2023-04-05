import React from "react";
import Header from "./Header";
import NavSidebar from "./NavSidebar";
import Footer from "./Footer";

const removeLayer = () => {
	document.getElementById("root").classList.remove("dash-main-class-add");
};

export default function UserLayout(props) {
	return (
		<>
			<Header />
			<NavSidebar />
			{props.children}
			<Footer />
			<div className="overlay toggle-icon-main" onClick={removeLayer}></div>
		</>
	);
}
