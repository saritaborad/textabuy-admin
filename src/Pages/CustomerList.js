import React, { useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import moment from "moment";
import { API_Path } from "../const";
import { PostApi } from "../ApiService";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import { useLocation } from "react-router";
import { toast } from "react-toastify";

export default function CustomerList() {
	const location = useLocation();
	const [id, setid] = useState();
	const [AllCustomersListData, setAllCustomersListData] = useState([]);
	const [DataInCSV, setDataInCSV] = useState('');
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 0, page: 0, sort: "id", order: "ASC" });
	const columns = [
		{
			label: "Customer Name",
			value: "firstName",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return (<span>{data[i].firstName ? data[i].firstName : "-"}</span>)
				},
			},
		},
		{
			label: "Email",
			value: "email",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return (<span>{data[i].email ? data[i].email : "-"}</span>)
				},
			},
		},
		{
			label: "City",
			value: "city",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return (<span>{data[i].city ? data[i].city : "-"}</span>)
				},
			},
		},
		{
			label: "State",
			value: "state",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return (<span>{data[i].state ? data[i].state : "-"}</span>)
				},
			},
		},
		{
			label: "Created At",
			value: "createdAt",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].createdAt ? moment(data[i].createdAt).format("DD/MM/YYYY") : "-"}</span>;
				},
			},
		},
		{
			label: "Last Campaign",
			value: "updatedAt",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].updatedAt ? moment(data[i].updatedAt).format("DD/MM/YYYY") : "-"}</span>;
				},
			},
		},
	];
	useEffect(() => {
		setid(location?.state?.id);
		getCustomerList(location?.state?.id, option);
	}, []);

	const getCustomerList = (id, option) => {
		let data = { id: id, option: option };
		const getAllCustomersListPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getCustomerList, data));
		});
		getAllCustomersListPromise.then((response) => {
			if (response.status === 200) {
				let tempArr = [];
				tempArr = response.data?.data?.map((element) => {
					return element;
				});
				setAllCustomersListData(tempArr);
				setoption({ ...option, totalRecord: response.data.data.totalcustomer });
			}
		});
	};

	const getstatuswiseData = () => {
		const getstatuswiseDataPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.exportAdminCustomer, { status: "all", userid: id }));
		});
		getstatuswiseDataPromise.then((res) => {
			if (res.status === 200) {
				setDataInCSV(`${res.data}`)
			} else {
				toast.error(res.data.message)
			}
		});
	};

	let tableCallBack = (option) => {
		setoption(option);
		getCustomerList(id, option);
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row align-items-center">
						<div className="col-sm-5">
							<div className="comn-title-main">
								<h1 className="mb-0">Customers List</h1>
							</div>
						</div>
						<div className="col-md-7 col-sm-8 text-camp-rgt">
							<div className="text-campaign-select my-2">
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2" onClick={() => getstatuswiseData()}>
								<a className="btn-comn-class w-100" id="csv" href={AllCustomersListData !== undefined &&`data:text/csv;charset=utf-8,${escape(DataInCSV)}`} download="CustomerList.csv">Export</a>
							</div>
						</div>
						<div className="col-12">
							<div className="comn-table-black-bg">
								<div>
									<RtdDatatable option={option} columns={columns} data={AllCustomersListData} tableCallBack={tableCallBack} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
