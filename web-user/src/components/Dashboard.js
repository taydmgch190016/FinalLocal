import React, { useEffect, useState } from "react";
import { Table, Flex } from "antd";
import { revenueStatistics, getTopProducts } from "../api/order.api";
import { toast } from "react-toastify";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchRevenueStatistics = async () => {
      try {
        const { response, err } = await revenueStatistics();
        if (response) {
          setStatistics(response);
        } else {
          toast.error("Failed to fetch revenue statistics");
        }
      } catch (error) {
        toast.error("Failed to fetch revenue statistics");
      }
    };

    const fetchTopProducts = async () => {
      try {
        const { response, err } = await getTopProducts();
        if (response) {
          setTopProducts(response);
        } else {
          toast.error("Failed to fetch top products");
        }
      } catch (error) {
        toast.error("Failed to fetch top products");
      }
    };

    fetchRevenueStatistics();
    fetchTopProducts();
  }, []);

  return (
    <Flex vertical gap={10} justify="end">
      <Table
        dataSource={[statistics]}
        pagination={false}
        columns={[
          {
            title: "Total Orders",
            dataIndex: "totalOrders",
            key: "totalOrders",
            align: "center",
          },
          {
            title: "Total Revenue",
            dataIndex: "totalRevenue",
            key: "totalRevenue",
            align: "center",
            render: (text) => `$${text}`,
          },
          {
            title: "Total Delivered Orders",
            dataIndex: "totalDeliveredOrders",
            key: "totalDeliveredOrders",
            align: "center",
          },
        ]}
      />
      <Flex gap={10} justify="center">
        <div style={{ height: "400px", width: "600px" }}>
          <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
            <VictoryAxis
              tickValues={[1, 2, 3]}
              tickFormat={[
                "Total Orders",
                "Total Delivered Orders",
                "Total Revenue",
              ]}
            />
            <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />
            <VictoryBar
              data={[
                { x: 1, y: statistics?.totalOrders || 0 },
                { x: 2, y: statistics?.totalDeliveredOrders || 0 },
                { x: 3, y: statistics?.totalRevenue || 0 },
              ]}
            />
          </VictoryChart>
          <div style={{ textAlign: "center" }}>
            <p>Revenue Statistics</p>
          </div>
        </div>
        <div style={{ height: "400px", width: "600px" }}>
          <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
            <VictoryAxis tickFormat={(x) => `${x}`} />
            <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />
            <VictoryBar
              data={topProducts.map((product, index) => ({
                x: product.product,
                y: product.totalQuantity,
              }))}
            />
          </VictoryChart>
          <div style={{ textAlign: "center" }}>
            <p>Best-selling Products and Number Sold</p>
          </div>
        </div>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
