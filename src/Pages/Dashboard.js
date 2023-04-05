import React, { useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import Dash1 from "../images/dash-icon-1.svg";
import Dash2 from "../images/dash-icon-2.svg";
import Dash4 from "../images/dash-icon-4.svg";
import Dash5 from "../images/dash-icon-5.svg";
import Chart from "react-apexcharts";
import { API_Path } from "../const";
import moment from "moment";
import { GetApi, PostApi } from "../ApiService";
import RtdDatatable from "../Components/DataTable/RtdDatatable";

var totalsupportx = [];
var totalSupporty = [];
var totalcampaignx = [];
var totalcampaigny = [];

export default function Dashboard() {
	const [totalsupportX, settotalsupportX] = useState([]);
	const [totalSupportY, settotalSupportY] = useState([]);
	const [totalcampaignX, settotalcampaignX] = useState([]);
	const [totalcampaignY, settotalcampaignY] = useState([]);
	const [AllCustomersData, setAllCustomersData] = useState([]);
	const [homePage, sethomePage] = useState();
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 0, page: 0, sort: "id", order: "ASC" });
	const columns = [
		{
			label: "Name",
			value: "firstName",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return (
						<div>
							<p>
								{data[i].firstName} {data[i].lastName}
							</p>
						</div>
					);
				},
			},
		},
		{
			label: "Email",
			value: "email",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <div>{data[i].email ? data[i].email : "-"}</div>;
				},
			},
		},
		{
			label: "Phone Number",
			value: "phone",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <div>{data[i].phone ? data[i].phone : "-"}</div>;
				},
			},
		},
		{
			label: "Address",
			value: "addresses",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return (
						data[i].addresses?.length > 0 &&
						data[i].addresses[0]?.city &&
						data[i].addresses[0]?.country && (
							<div>
								{`${data[i].addresses[0].city} ,`} {data[i].addresses[0].country}
							</div>
						)
					);
				},
			},
		},
		{
			label: "Date",
			value: "createdAt",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].createdAt ? moment(data[i].createdAt).format("DD/MM/YYYY") : "-"}</span>;
				},
			},
		},
		{
			name: "Status",
			value: "status",
			options: {
				filter: true,
				customBodyRenderLite: (data) => {
					return (
						<div className="form-check form-switch d-inline-flex align-items-center justify-content-center">
							<input className="form-check-input" type="checkbox" id="Active1" />
						</div>
					);
				},
			},
		},
	];

	useEffect(() => {
		GetHomePage();
		getAllCustomers();
	}, []);

	const GetHomePage = () => {
		const gethomePagePromise = new Promise((resolve, reject) => {
			resolve(GetApi(API_Path.dashboard));
		});
		gethomePagePromise.then((response) => {
			if (response.status === 200) {
				sethomePage(response.data.data);
				totalsupportx = []
				totalSupporty = []
				let sortedArr1 = [];
				let count1 = 1;
				sortedArr1 = response.data.data.weeklySupport.map((item) => moment(item).format("DD-MM-YYYY")).sort();
				for (var i = 0; i < sortedArr1.length; i = i + count1) {
					count1 = 1;
					for (var j = i + 1; j < sortedArr1.length; j++) {
						if (sortedArr1[i] === sortedArr1[j]) count1++;
					}
					totalsupportx.push(sortedArr1[i]);
					totalSupporty.push(count1);
					settotalsupportX(totalsupportx);
					settotalSupportY(totalSupporty);
				}
				totalcampaignx = []
				totalcampaigny = []
				let sortedArr2 = [];
				let count2 = 1;
				sortedArr2 = response.data.data.weeklycampaign.map((item) => moment(item).format("DD-MM-YYYY")).sort();
				for (var i = 0; i < sortedArr2.length; i = i + count2) {
					count2 = 1;
					for (var j = i + 1; j < sortedArr2.length; j++) {
						if (sortedArr2[i] === sortedArr2[j]) count2++;
					}
					totalcampaignx.push(sortedArr2[i]);
					totalcampaigny.push(count2);
					settotalcampaignX(totalcampaignx);
					settotalcampaignY(totalcampaigny);
				}
			}
		});
	};

	const getAllCustomers = () => {
		const getAllCustomersPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getAllCustomers, option));
		});
		getAllCustomersPromise.then((res) => {
			if (res.status === 200) {
				setAllCustomersData(res.data.data);
				setoption({ ...option, totalRecord: res.data.data.totalRecord });
			}
		});
	};

	let tableCallBack = (option) => {
		setoption(option);
		getAllCustomers(option);
	};

	const handleSupportChangeData = (e) => {
		totalsupportx = [];
		totalSupporty = [];
		if (e.target.value === "0") {
			let sortedArr1 = [];
			let count1 = 1;
			sortedArr1 = homePage.weeklySupport.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			for (var i = 0; i < sortedArr1.length; i = i + count1) {
				count1 = 1;
				for (var j = i + 1; j < sortedArr1.length; j++) {
					if (sortedArr1[i] === sortedArr1[j]) count1++;
				}
				totalsupportx.push(sortedArr1[i]);
				totalSupporty.push(count1);
				settotalsupportX(totalsupportx);
				settotalSupportY(totalSupporty);
			}
		} else if (e.target.value === "1") {
			let sortedArr1 = [];
			let count1 = 1;
			sortedArr1 = homePage.monthlySupport.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			for (var i = 0; i < sortedArr1.length; i = i + count1) {
				count1 = 1;
				for (var j = i + 1; j < sortedArr1.length; j++) {
					if (sortedArr1[i] === sortedArr1[j]) count1++;
				}
				totalsupportx.push(sortedArr1[i]);
				totalSupporty.push(count1);
				settotalsupportX(totalsupportx);
				settotalSupportY(totalSupporty);
			}
		} else {
			let sortedArr1 = [];
			let count1 = 1;
			sortedArr1 = homePage.yearlySupport.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			for (var i = 0; i < sortedArr1.length; i = i + count1) {
				count1 = 1;
				for (var j = i + 1; j < sortedArr1.length; j++) {
					if (sortedArr1[i] === sortedArr1[j]) count1++;
				}
				totalsupportx.push(sortedArr1[i]);
				totalSupporty.push(count1);
				settotalsupportX(totalsupportx);
				settotalSupportY(totalSupporty);
			}
		}
	};

	const handleCampaignChangeData = (e) => {
		totalcampaignx = [];
		totalcampaigny = [];
		if (e.target.value === "0") {
			let sortedArr2 = [];
			let count2 = 1;
			sortedArr2 = homePage.weeklycampaign.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			for (var i = 0; i < sortedArr2.length; i = i + count2) {
				count2 = 1;
				for (var j = i + 1; j < sortedArr2.length; j++) {
					if (sortedArr2[i] === sortedArr2[j]) count2++;
				}
				totalcampaignx.push(sortedArr2[i]);
				totalcampaigny.push(count2);
				settotalcampaignX(totalcampaignx);
				settotalcampaignY(totalcampaigny);
			}
		} else if (e.target.value === "1") {
			let sortedArr2 = [];
			let count2 = 1;
			sortedArr2 = homePage.monthlycampaign.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			for (var i = 0; i < sortedArr2.length; i = i + count2) {
				count2 = 1;
				for (var j = i + 1; j < sortedArr2.length; j++) {
					if (sortedArr2[i] === sortedArr2[j]) count2++;
				}
				totalcampaignx.push(sortedArr2[i]);
				totalcampaigny.push(count2);
				settotalcampaignX(totalcampaignx);
				settotalcampaignY(totalcampaigny);
			}
		} else {
			let sortedArr2 = [];
			let count2 = 1;
			sortedArr2 = homePage.yearlycampaign.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			for (var i = 0; i < sortedArr2.length; i = i + count2) {
				count2 = 1;
				for (var j = i + 1; j < sortedArr2.length; j++) {
					if (sortedArr2[i] === sortedArr2[j]) count2++;
				}
				totalcampaignx.push(sortedArr2[i]);
				totalcampaigny.push(count2);
				settotalcampaignX(totalcampaignx);
				settotalcampaignY(totalcampaigny);
			}
		}
	};

	const chart1series = [{ name: "Revenue", data: totalSupportY }];
	const chart1options = { fill: { opacity: 1 }, chart: { height: 300, type: "line", fontFamily: "Poppins,sans-serif", zoom: { enabled: true }, toolbar: { show: false } }, dataLabels: { enabled: false }, colors: ["#1C1C1C"], stroke: { show: true, curve: "smooth", lineCap: "butt", width: 2, dashArray: 0 }, xaxis: { categories: totalsupportX } };
	const chart2series = [{ name: "Campaign", data: totalcampaignY }];
	const chart2options = { fill: { opacity: 1 }, chart: { height: 300, type: "area", fontFamily: "Poppins,sans-serif", zoom: { enabled: true }, toolbar: { show: false } }, dataLabels: { enabled: false }, colors: ["#489824"], stroke: { show: true, curve: "smooth", lineCap: "butt", width: 2, dashArray: 0 }, xaxis: { categories: totalcampaignX } };

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">Dashboard</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="row me-0 justify-content-center">
								<div className="col-xxl col-xl-3 col-md-4 col-6 pe-0 mb-3">
									<div className="dash-top-box">
										<span className="dash-span-1">
											<img src={Dash1} alt="1" />
										</span>
										<p>{homePage?.totalsupport}</p>
										<div className="dash-top-box-info d-flex align-items-center">
											<bdi>Inquiries</bdi>
										</div>
									</div>
								</div>
								<div className="col-xxl col-xl-3 col-md-4 col-6 pe-0 mb-3">
									<div className="dash-top-box">
										<span className="dash-span-2">
											<img src={Dash2} alt="2" />
										</span>
										<p>{homePage?.totalsubadmin}</p>
										<div className="dash-top-box-info d-flex align-items-center">
											<bdi>Sub Admins</bdi>
										</div>
									</div>
								</div>
								<div className="col-xxl col-xl-3 col-md-4 col-6 pe-0 mb-3">
									<div className="dash-top-box">
										<span className="dash-span-4">
											<img src={Dash4} alt="4" />
										</span>
										<p>{homePage?.totalcampaigns}</p>
										<div className="dash-top-box-info d-flex align-items-center">
											<bdi>Text Campaigns</bdi>
										</div>
									</div>
								</div>
								<div className="col-xxl col-xl-3 col-md-4 col-6 pe-0 mb-3">
									<div className="dash-top-box">
										<span className="dash-span-5">
											<img src={Dash5} alt="5" />
										</span>
										<p>{homePage?.totalcustomer}</p>
										<div className="dash-top-box-info d-flex align-items-center">
											<bdi>Customers</bdi>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12 height-col-main">
							<div className="row me-0">
								<div className="col-md-6 mb-3 pe-0">
									<div className="row">
										<div className="col-12">
											<div className="dash-hdr-body-box">
												<div className="dash-hdr-body-box-hdr d-flex align-items-center p-0">
													<span>Inquiries</span>
													<select className="form-select ms-auto" onClick={handleSupportChangeData}>
														<option defaultValue value="0">
															Weekly
														</option>
														<option value="1">Monthly</option>
														<option value="2">Yearly</option>
													</select>
												</div>
												<div className="dash-hdr-body-box-body">
													<div className="chart-section-main">
														<Chart options={chart1options} series={chart1series} height={300} type="line" />
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-6 mb-3 pe-0">
									<div className="row">
										<div className="col-12">
											<div className="dash-hdr-body-box">
												<div className="dash-hdr-body-box-hdr d-flex align-items-center p-0">
													<span>Campaign</span>
													<select className="form-select ms-auto" onClick={handleCampaignChangeData}>
														<option defaultValue value="0">
															Weekly
														</option>
														<option value="1">Monthly</option>
														<option value="2">Yearly</option>
													</select>
												</div>
												<div className="dash-hdr-body-box-body">
													<div className="chart-section-main">
														<Chart options={chart2options} series={chart2series} height={300} type="area" />
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="bx-white-main p-0 white-tbl-box">
								<div className="dash-hdr-body-box-hdr border-bottom">
									<span>Customers</span>
								</div>
								<div className="col-12">
									<div className="comn-table-black-bg">
										<div>
											<RtdDatatable option={option} columns={columns} data={AllCustomersData} tableCallBack={tableCallBack} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
