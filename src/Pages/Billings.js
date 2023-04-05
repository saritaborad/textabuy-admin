import React, { useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import { API_Path } from "../const";
import { PostApi } from "../ApiService";
import { CSVLink } from "react-csv";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import { toast } from "react-toastify";

export default function Billings() {
	const [lastId, setlastId] = useState("");
	const [firstId, setfirstId] = useState("");
	const [billings, setbillings] = useState([]);
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 0, page: 0, sort: "id", order: "ASC" });
	const columns = [
		{
			label: "ID",
			value: "created",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].created ? data[i].created : "-"}</span>;
				},
			},
		},
		{
			label: "Date",
			value: "date",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].date ? data[i].date : "-"}</span>;
				},
			},
		},
		{
			label: "Invoice",
			value: "invoice",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].invoice ? data[i].invoice : "-"}</span>;
				},
			},
		},
		{
			label: "Amount",
			value: "amount",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <div>${parseFloat(data[i].amount).toLocaleString()}</div>;
				},
			},
		},
		{
			label: "Status",
			value: "status",
			options: {
				filter: true,
				sort: false,
				empty: true,
				customBodyRender: (data, i) => {
					return <div className={`status-col status-` + data[i].status === "succeeded" ? "active" : "pending"}>{data[i].status === "succeeded" ? "Paid" : "Pending"}</div>;
				},
			},
		},
	];

	useEffect(() => {
		getAllbillings(option);
	}, []);

	const getAllbillings = (option) => {
		let formdata = { option: option, Last_ID: lastId, First_ID: firstId };
		const getAllbillingsPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getBilling, formdata)));
		getAllbillingsPromise.then((res) => {
			if (res.status === 200) {
				setbillings(res.data.data.obj.data);
				setlastId(res.data.data.obj.Last_ID);
				setfirstId(res.data.data.obj.data[0].id);
				toast.success(res.data.message);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const tableCallBack = (option) => {
		setoption(option);
		getAllbillings(option);
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-sm-5">
							<div className="comn-title-main">
								<h1 className="mb-0">Customer Billings</h1>
							</div>
						</div>
						<div className="col-md-7 col-sm-8 text-camp-rgt">
							<div className="crt-campaign-btn crt-in-btn  ms-auto my-2">
								{billings && (
									<CSVLink className="btn-comn-class  w-100" data={billings} filename={"AllbillingsList.csv"}>
										Export
									</CSVLink>
								)}
							</div>
						</div>
						<div className="col-12 mt-3">
							<div className="bx-white-main">
								<RtdDatatable option={option} columns={columns} data={billings} tableCallBack={tableCallBack} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
