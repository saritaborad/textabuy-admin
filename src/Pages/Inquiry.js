import React, { useContext, useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import moment from "moment";
import { API_Path } from "../const";
import { PostApi } from "../ApiService";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function Inquiry() {
	const Navigate = useNavigate();
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 0, page: 0, sort: "_id", order: "DSC" });
	const [AllInquiryData, setAllInquiryData] = useState([]);
	const [status, setstatus] = useState("all");
	const [DataInCSV, setDataInCSV] = useState('');
	const columns = [
		{
			label: "Store Name",
			value: "store_name",
			options: {
				display: false,
				filter: true,
				customBodyRender: (data, i) => {
					return <div onClick={() => Navigate("/inquiry-detail/", { state: { id: data[i]._id, status: data[i].status } })}>{data[i]?.user[0]?.store_name ? data[i]?.user[0]?.store_name : "-"}</div>;
				},
			},
		},
		{
			label: "Ticket id",
			value: "ticket_id",
			options: {
				display: false,
				filter: true,
				customBodyRender: (data, i) => {
					return <div onClick={() => Navigate("/inquiry-detail/", { state: { id: data[i]._id, status: data[i].status } })}>{data[i].ticket_id ? data[i].ticket_id : "-"}</div>;
				},
			},
		},
		{
			label: "Subject",
			value: "subject",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <div onClick={() => Navigate("/inquiry-detail/", { state: { id: data[i]._id, status: data[i].status } })}>{data[i].subject ? data[i].subject : "-"}</div>;
				},
			},
		},
		{
			label: "Description",
			value: "description",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <div onClick={() => Navigate("/inquiry-detail/", { state: { id: data[i]._id, status: data[i].status } })}>{data[i].description ? data[i].description : "-"}</div>;
				},
			},
		},
		{
			label: "Status",
			value: "status",
			options: {
				filter: false,
				sort: false,
				empty: true,
				customBodyRender: (data, i) => {
					return (
						<div className={`text-capitalize status-col status-` + data[i].status} onClick={() => Navigate("/inquiry-detail/", { state: { id: data[i]._id, status: data[i].status } })}>
							{data[i].status === "inprogress" ? "In progress" : data[i].status === "close" ? "closed" : data[i].status}
						</div>
					);
				},
			},
		},
		{
			label: "Last Activity",
			value: "createdAt",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <div onClick={() => Navigate("/inquiry-detail/", { state: { id: data[i]._id, status: data[i].status } })}>{moment(data[i].createdAt).format("MM/DD/YYYY")}</div>;
				},
			},
		},
	];

	useEffect(() => {
		getAllInquiry(option, status);
	}, []);

	const getAllInquiry = (option, status) => {
		let data = { option: option, status: status ? status : "all" };
		const getAllInquiryPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getInquiry, data)));
		getAllInquiryPromise.then((res) => {
			if (res.status === 200) {
				setAllInquiryData(res.data.data.support);
				setoption({ ...option, totalRecord: res.data.data.totalRecord });
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const getstatuswiseData = () => {
		const getstatuswiseDataPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.exportAdminSupport, { status: status }));
		});
		getstatuswiseDataPromise.then((res) => {
			if (res.status === 200) {
				setDataInCSV(`${res.data}`)
			} else {
				toast.error(res.data.message)
			}
		});
	};

	const handleStatusWise = (e) => {
		setstatus(e.target.value);
		getAllInquiry(option, e.target.value);
	};

	let tableCallBack = (option) => {
		setoption(option);
		getAllInquiry(option, status);
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-5">
							<div className="comn-title-main">
								<h1 className="mb-0">Support</h1>
							</div>
						</div>
						<div className="col-md-7 text-camp-rgt justify-content-end">
							<div className="text-campaign-select my-2">
								<select className="form-select comn-input-style" name="" onChange={(e) => handleStatusWise(e)}>
									<option value={"all"}>All</option>
									<option value={"open"}>Open</option>
									<option value={"close"}>Closed</option>
									<option value={"inprogress"}>In progress</option>
								</select>
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2" onClick={() => getstatuswiseData()}>
								<a className="btn-comn-class w-100" id="csv" href={AllInquiryData !== undefined && `data:text/csv;charset=utf-8,${escape(DataInCSV)}`} download="InquiryList.csv">Export</a>
							</div>
						</div>
						<div className="col-12">
							<div className="comn-table-black-bg">
								<div>
									<RtdDatatable option={option} columns={columns} data={AllInquiryData} tableCallBack={tableCallBack} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
