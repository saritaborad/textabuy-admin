import React, { useContext, useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import Bluetick from "../images/blue-tick.svg";
import Send from "../images/Send Icon.svg";
import { ApiBaseUrl, API_Path, LandingPageURL } from "../const";
import { PostApi } from "../ApiService";
import Context from "../contexts/context";
import { io } from "socket.io-client";
import moment from "moment";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

let msgItems = [];

export default function InquiryDetail() {
	const context = useContext(Context);
	const Navigate = useNavigate();
	const location = useLocation();
	const [id, setid] = useState("");
	const [message, setmessage] = useState("");
	const [supportData, setsupportData] = useState("");
	const [senderid, setsenderid] = useState("");
	const [MessageArr, setMessageArr] = useState([]);
	const [status, setstatus] = useState([]);

	useEffect(() => {
		if (location?.state?.id !== undefined) {
			setid(location.state.id);
			setstatus(location.state.status);
		} else {
			window.location.href = `${LandingPageURL}/dashboard`;
		}
		setsenderid(context.login_user_id);
	}, [location?.state?.id, context.login_user_id]);

	useEffect(() => {
		getChatById(id);
		getSupportById(id);
	}, [id]);

	useEffect(() => {
		let socket = io(ApiBaseUrl);
		msgItems = [];
		setMessageArr([]);
		if (socket !== "") {
			context.socketConnection(socket);
			socket.emit("connect_user", { senderid: senderid, role: 1 });
			socket.on("getdata", (data) => {
				if (id === data.inquiryid) {
					let recievedData = { msg: data.msg, direction: "user", time: new Date() };
					msgItems.push(recievedData);
					loadMessages(msgItems);
				}
			});
		}
	}, []);

	const getChatById = (id) => {
		const getSupportByIdPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getChatById, { inquiryid: id }));
		});
		getSupportByIdPromise
			.then((res) => {
				if (res.status === 200) {
					res.data.data &&
						res.data.data.map((item) => {
							let sendData = { msg: item.msg, direction: item.direction, time: item.time };
							msgItems.push(sendData);
						});
					setMessageArr(msgItems);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const loadMessages = (message) => {
		setMessageArr(message);
	};

	const getSupportById = (id) => {
		const getSupportPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getSupportById, { id: id })));
		getSupportPromise.then((res) => {
			if (res.status === 200) {
				setsupportData(res.data.data);
				setstatus(res.data.data.status);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const handleStatusChange = (e) => {
		setstatus(e.target.value);
		updateSupport(e.target.value);
	};

	const updateSupport = (value) => {
		let data = { _id: id, status: value };
		const getSupportPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.updateSupport, data));
		});
		getSupportPromise
			.then((res) => {
				if (res.status === 200) {
					Navigate("/inquiry");
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleMessageChange = (e) => [setmessage(e.target.value)];

	const handleSendMessage = () => {
		let sendData = { msg: message, direction: "admin", time: new Date() };
		msgItems.push(sendData);
		setMessageArr(msgItems);
		setmessage("");
		context.socket && context.socket.emit("get_msg", { senderid: senderid, msg: message, role: 1, receiverid: supportData && supportData.userid, direction: "admin", inquiryid: id, time: new Date() });
	};

	const handleEnterSendMessages = (e) => {
		if (e.keyCode === 13) {
			handleSendMessage();
		}
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">Inquiry Details</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="set-chpwd-box p-0">
								<div className="message-top-part">
									<div className="d-md-flex d-block">
										<div className="msg-top-head">
											<h5>{supportData && supportData.subject}</h5>
											<span>{supportData.lastactivity ? moment(supportData.lastactivity).format("MM/DD/YYYY hh:mm A") : ""}</span>
										</div>
										<div className="ms-auto mt-2 mt-sm-0 d-flex status-select">
											<select className="form-select comn-input-style" name="status" value={status} onChange={handleStatusChange}>
												{status !== "close" && (
													<>
														<option value="open">Open</option>
														<option value="inprogress">In progress</option>
													</>
												)}
												<option value="close">Closed</option>
											</select>
										</div>
									</div>
								</div>
								<div className="chat-main-part p-3">
									{MessageArr &&
										MessageArr.map((item, i) => {
											return (
												<>
													{item.direction === "admin" && (
														<div className="chat-main-area py-3" key={i}>
															<div className="chat-box outbox-msg">
																<div className="chat-section">
																	<div className="message-part">
																		<p>{item.msg}</p>
																	</div>
																	<span>
																		<img src={Bluetick} className="me-2" alt="seen" />
																		{moment(item.time).format("hh:mm A")}
																	</span>
																</div>
															</div>
														</div>
													)}
													{item.direction === "user" && (
														<div className="chat-main-area py-3" key={i}>
															<div className="chat-box inbox-msg">
																<div className="chat-section">
																	<div className="message-part">
																		<p>{item.msg}</p>
																	</div>
																	<span>{moment(item.time).format("hh:mm A")}</span>
																</div>
															</div>
														</div>
													)}
												</>
											);
										})}
								</div>
								{status !== "close" && (
									<div className="p-3">
										<div className="chat-section-right-msg-box">
											<div className="input-group">
												<input type="text" className="form-control border-0" placeholder="Send a message..." onChange={handleMessageChange} onKeyDown={(e) => handleEnterSendMessages(e)} value={message} name="message" />
												<span className="input-group-text p-0 border-0">
													<button type="button" className="send-btn border-0" onClick={handleSendMessage}>
														<span className="pe-2">send</span>
														<img src={Send} alt=">>" />
													</button>
												</span>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
