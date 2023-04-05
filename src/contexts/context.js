import React, { createContext, useEffect, useState } from "react";
import { PostApi } from "../ApiService";
import { API_Path } from "../const";
const Context = createContext("");

export const Rolecontext = ({ children }) => {
	const [socket, setsocket] = useState("");
	const [role, setrole] = useState(5);
	const [userDetail, setlogin_user_details] = useState([]);
	const [login_user_id, set_login_user_id] = useState("");

	const socketConnection = (socket) => {
		setsocket(socket);
	};

	useEffect(() => {
		let token = localStorage.getItem("admin-token");
		if (token !== null) {
			const objectLength = Object.keys(userDetail).length;
			if (objectLength === 0) {
				GetProfile();
			}
		}
	}, [userDetail]);

	const GetProfile = () => {
		const addFilePromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.myprofile)));
		addFilePromise.then((res) => {
			if (res.status === 200) {
				setlogin_user_details(res.data.data?.admin ? res.data.data.admin : res.data.data?.subadmin)
			}
		});
	};

	const handleRole = (role) => {
		setrole(role);
	};

	useEffect(() => {
		if (login_user_id === "") {
			login_id_change();
		}
	}, [login_user_id]);

	const login_id_change = async () => {
		let token = localStorage.getItem("admin-token");
		if (token !== null) {
			let login_id = await parseJwt(token);
			set_login_user_id(login_id.id);
		}
	};

	const parseJwt = (token) => {
		return new Promise((resolve, reject) => {
			var base64Url = token.split(".")[1];
			var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
			var jsonPayload = decodeURIComponent(
				window
					.atob(base64)
					.split("")
					.map(function (c) {
						return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
					})
					.join("")
			);
			resolve(JSON.parse(jsonPayload));
		});
	};

	return <Context.Provider value={{ ...{ socket, role, userDetail, login_user_id }, socketConnection, handleRole, setlogin_user_details, set_login_user_id }}>{children}</Context.Provider>;
};

export default Context;
