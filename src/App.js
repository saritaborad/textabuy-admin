import React from "react";
import RoutesMain from "./RoutesMain";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../src/Components/style.scss";
import "../src/Components/style2.scss";
import { ToastContainer } from "react-toastify";
import { Rolecontext } from "./contexts/context";

export default function App() {
	return (
		<Rolecontext>
			<ToastContainer autoClose={1000} theme="dark" position="bottom-left" />
			<RoutesMain />
		</Rolecontext>
	);
}
