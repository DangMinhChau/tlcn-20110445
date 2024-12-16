// import React, { useContext, useEffect, useState } from "react";
// import { Chart } from "react-google-charts";
// import {
//   getBestSeller,
//   getOrderStats,
//   getProductStats,
// } from "../../api/staticsAPI";
// import AuthContext from "../../store/authCtx";
// import { Card, Col, Row, Statistic, Table } from "antd";
// const columns = [
//   {
//     title: "Mã sản phẩm",
//     dataIndex: "_id",
//     key: "_id",
//   },
//   {
//     title: "Tên sản phẩm",
//     dataIndex: "name",
//     key: "name",
//     render: (_, record) => <p>{record.product[0].name}</p>,
//   },
//   {
//     title: "Đã bán",
//     dataIndex: "sold",
//     key: "sold",
//   },
// ];
// const StatisticApp = () => {
//   const authCtx = useContext(AuthContext);
//   const [bestSeller, setBestSeller] = useState([]);
//   const [ordersStats, setOrdersStats] = useState({});
//   const [productStats, setProductStats] = useState([]);
//   useEffect(() => {
//     getOrderStats(authCtx.token)
//       .then(({ data }) => {
//         setOrdersStats(data);
//       })
//       .catch((err) => console.log(err));
//     getBestSeller()
//       .then(({ data }) => {
//         setBestSeller(data.stats);
//       })
//       .catch((err) => console.log(err));
//     getProductStats()
//       .then(({ data }) => {
//         setProductStats(data.stats);
//       })
//       .catch((err) => console.log(err));

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   return (
//     <section className="h-fit flex flex-col space-y-[16px]">
//       <h2 className="text-center py-5 font-bold text-[24px]">Thống kê</h2>

//       <Row gutter={[16, 16]} justify="center">
//         {ordersStats.orderStats && (
//           <>
//             <Col span={8}>
//               <Card bordered={false}>
//                 <Statistic
//                   title="Số người dùng"
//                   value={ordersStats.users ? ordersStats.users[0].numUsers : 0}
//                   valueStyle={{
//                     color: "#3f8600",
//                   }}
//                 />
//               </Card>
//             </Col>
//             <Col span={8}>
//               <Card bordered={false}>
//                 <Statistic
//                   title="Doanh thu"
//                   value={
//                     ordersStats.users &&
//                     ordersStats.orderStats.find(
//                       (order) => order.status === "done"
//                     ).sales
//                       ? ordersStats.orderStats.find(
//                           (order) => order.status === "done"
//                         ).sales
//                       : 0
//                   }
//                   valueStyle={{
//                     color: "#3f8600",
//                   }}
//                   suffix="VNĐ"
//                 />
//               </Card>
//             </Col>
//             <Col span={8}>
//               <Card bordered={false}>
//                 <Statistic
//                   title="Tổng sản phẩm"
//                   value={
//                     productStats.length > 0
//                       ? productStats.reduce(
//                           (total, item) => total + item.numProducts,
//                           0
//                         )
//                       : 0
//                   }
//                   valueStyle={{
//                     color: "#48cae4",
//                   }}
//                   suffix="Sản phẩm"
//                 />
//               </Card>
//             </Col>
//           </>
//         )}
//       </Row>
//       <Row gutter={[16, 16]} justify="center">
//         {ordersStats.orderStats &&
//           ordersStats.orderStats.map((item, i) => (
//             <Col span={4} key={i}>
//               <Card bordered={false}>
//                 <Statistic
//                   title={`Số đơn hàng ${
//                     item.status === "new"
//                       ? "Chờ duyệt"
//                       : item.status === "processing"
//                       ? "Đang xử lý"
//                       : item.status === "done"
//                       ? "Hoàn thành"
//                       : "Đã hủy"
//                   }`}
//                   value={item.numOrder}
//                   valueStyle={{
//                     color: `${
//                       item.status === "new"
//                         ? "#48cae4"
//                         : item.status === "processing"
//                         ? "#004e89"
//                         : item.status === "done"
//                         ? "#3f8600"
//                         : "#d00000"
//                     }`,
//                   }}
//                   suffix="Đơn"
//                 />
//               </Card>
//             </Col>
//           ))}
//       </Row>
//       {ordersStats.dailyOrders && (
//         <>
//           <div>
//             <h3 className="text-center py-2 font-bold text-[20px]">
//               Doanh thu
//             </h3>
//             {ordersStats.dailyOrders.length === 0 ? (
//               <div>Không có doanh thu</div>
//             ) : (
//               <Chart
//                 width="100%"
//                 height="400px"
//                 chartType="AreaChart"
//                 loader={<div>Loading Chart...</div>}
//                 data={[
//                   ["Date", "Sales"],
//                   ...ordersStats.dailyOrders.map((x) => [x.date, x.sales]),
//                 ]}
//               ></Chart>
//             )}
//           </div>
//         </>
//       )}
//       {productStats.length !== 0 && (
//         <>
//           <div>
//             <h3 className="text-center py-2 font-bold text-[20px]">
//               Loại sản phẩm
//             </h3>
//             {productStats.length === 0 ? (
//               <div>Không có doanh thu</div>
//             ) : (
//               <Chart
//                 width="100%"
//                 height="400px"
//                 chartType="PieChart"
//                 loader={<div>Loading Chart...</div>}
//                 data={[
//                   ["Loại sản phẩm", "Sản phẩm"],
//                   ...productStats.map((x) => [x.category.name, x.numProducts]),
//                 ]}
//               ></Chart>
//             )}
//           </div>
//         </>
//       )}
//       {bestSeller.length !== 0 && (
//         <div className="pb-4">
//           <h3 className="text-center py-2 font-bold text-[20px]">
//             Top 5 sản phẩm bán chạy nhất
//           </h3>
//           <Table columns={columns} dataSource={bestSeller} pagination={false} />
//         </div>
//       )}
//     </section>
//   );
// };

// export default StatisticApp;

import React, { useContext, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import {
  getBestSeller,
  getOrderStats,
  getProductStats,
} from "../../api/staticsAPI";
import AuthContext from "../../store/authCtx";
import { Card, Col, Row, Statistic, Table } from "antd";

const columns = [
  {
    title: "Mã sản phẩm",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    key: "name",
    render: (_, record) => <p>{record.product?.name ?? "Unknown Product"}</p>,
  },
  {
    title: "Đã bán",
    dataIndex: "sold",
    key: "sold",
  },
];

const StatisticApp = () => {
  const authCtx = useContext(AuthContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [ordersStats, setOrdersStats] = useState({});
  const [productStats, setProductStats] = useState([]);

  useEffect(() => {
    getOrderStats(authCtx.token)
      .then(({ data }) => {
        setOrdersStats(data);
      })
      .catch((err) => console.log(err));

    getBestSeller()
      .then(({ data }) => {
        setBestSeller(data.stats);
      })
      .catch((err) => console.log(err));

    getProductStats()
      .then(({ data }) => {
        setProductStats(data.stats);
      })
      .catch((err) => console.log(err));
  }, [authCtx.token]);

  return (
    <section className="h-fit flex flex-col space-y-[16px]">
      <h2 className="text-center py-5 font-bold text-[24px]">Thống kê</h2>

      <Row gutter={[16, 16]} justify="center">
        {ordersStats.orderStats && (
          <>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Số người dùng"
                  value={ordersStats.users ? ordersStats.users[0].numUsers : 0}
                  valueStyle={{
                    color: "#3f8600",
                  }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Doanh thu"
                  value={
                    (ordersStats.users &&
                      ordersStats.orderStats.find(
                        (order) => order.status === "done"
                      )?.sales) ??
                    0
                  }
                  valueStyle={{
                    color: "#3f8600",
                  }}
                  suffix="VNĐ"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Tổng sản phẩm"
                  value={
                    productStats.length > 0
                      ? productStats.reduce(
                          (total, item) => total + item.numProducts,
                          0
                        )
                      : 0
                  }
                  valueStyle={{
                    color: "#48cae4",
                  }}
                  suffix="Sản phẩm"
                />
              </Card>
            </Col>
          </>
        )}
      </Row>

      <Row gutter={[16, 16]} justify="center">
        {ordersStats.orderStats &&
          ordersStats.orderStats.map((item, i) => (
            <Col span={4} key={i}>
              <Card bordered={false}>
                <Statistic
                  title={`Số đơn hàng ${
                    item.status === "new"
                      ? "Chờ duyệt"
                      : item.status === "processing"
                      ? "Đang xử lý"
                      : item.status === "done"
                      ? "Hoàn thành"
                      : "Đã hủy"
                  }`}
                  value={item.numOrder}
                  valueStyle={{
                    color: `${
                      item.status === "new"
                        ? "#48cae4"
                        : item.status === "processing"
                        ? "#004e89"
                        : item.status === "done"
                        ? "#3f8600"
                        : "#d00000"
                    }`,
                  }}
                  suffix="Đơn"
                />
              </Card>
            </Col>
          ))}
      </Row>

      {ordersStats.dailyOrders && (
        <>
          <div>
            <h3 className="text-center py-2 font-bold text-[20px]">
              Doanh thu
            </h3>
            {ordersStats.dailyOrders.length === 0 ? (
              <div>Không có doanh thu</div>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ["Date", "Sales"],
                  ...ordersStats.dailyOrders.map((x) => [x.date, x.sales ?? 0]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}

      {productStats.length !== 0 && (
        <div>
          <h3 className="text-center py-2 font-bold text-[20px]">
            Loại sản phẩm
          </h3>
          {productStats.length === 0 ? (
            <div>Không có doanh thu</div>
          ) : (
            <Chart
              width="100%"
              height="400px"
              chartType="PieChart"
              loader={<div>Loading Chart...</div>}
              data={[
                ["Loại sản phẩm", "Sản phẩm"],
                ...productStats.map((x) => [
                  x.category?.name ?? "Unknown Category",
                  x.numProducts ?? 0,
                ]),
              ]}
            ></Chart>
          )}
        </div>
      )}

      {bestSeller.length !== 0 && (
        <div className="pb-4">
          <h3 className="text-center py-2 font-bold text-[20px]">
            Top 5 sản phẩm bán chạy nhất
          </h3>
          <Table columns={columns} dataSource={bestSeller} pagination={false} />
        </div>
      )}
    </section>
  );
};

export default StatisticApp;
