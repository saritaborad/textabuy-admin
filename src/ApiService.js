import { LandingPageURL } from "./const";

const axios = require("axios");
export function GetApi(path) {
	let tokenData = localStorage.getItem("admin-token") ? "Bearer " + localStorage.getItem("admin-token") : "";
	let headers = { Authorization: tokenData, "Content-Type": "application/json" };
	const GetApiData = axios
		.get(path, { headers: headers })
		.then((response) => {
			return response;
		})
		.catch((err) => {
			if (err.response.status === 401) {
				localStorage.removeItem("admin-token");
				window.location.href = LandingPageURL;
			}
			return err;
		});
	return GetApiData;
}

export function PostApi(path, body) {
	let tokenData = localStorage.getItem("admin-token") ? "Bearer " + localStorage.getItem("admin-token") : "";
	let headers = { Authorization: tokenData, "Content-Type": "application/json" };
	const PostApiData = axios
		.post(path, body, { headers: headers })
		.then((response) => {
			return response;
		})
		.catch((err) => {
			if (err.response.status === 401) {
				localStorage.removeItem("admin-token");
				window.location.href = LandingPageURL;
			}
			return err;
		});
	return PostApiData;
}
