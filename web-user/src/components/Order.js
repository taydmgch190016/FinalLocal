import React, { useEffect, useState } from "react";
import { Table, Button, Flex } from "antd";
import { getOrder, confirmDelivery } from "../api/order.api";
import { getCustomer } from "../api/customer.api";
import { getStore } from "../api/store.api";
import { toast } from "react-toastify";

const Order = () => {
  const [pageSize, setPageSize] = useState(5);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { response, err } = await getOrder(currentPage, pageSize);
      const storeResponse = await getStore();
      const storedStoreId = localStorage.getItem("storeId");

      if (err) {
        toast.error("Error fetching orders!");
      } else {
        const ordersWithDetails = await Promise.all(
          response.map(async (order) => {
            const customerResponse = await getCustomer(order.user);
            const customer = customerResponse.response;

            const store = storeResponse.response.find(
              (store) => store._id === order.storeId
            );

            return {
              ...order,
              user: customer
                ? `${customer.username}, ${customer.email}`
                : "N/A",
              storeName: store ? store.name : "N/A",
            };
          })
        );

        const filteredOrders = ordersWithDetails.filter(
          (order) => order.storeId === storedStoreId
        );

        setOrders(filteredOrders);
      }
    } catch (error) {
      toast.error("Error fetching orders!");
    }
  };

  const handleConfirmDelivery = async (orderId) => {
    try {
      const { response, err } = await confirmDelivery(orderId);

      if (err) {
        toast.error("Error confirming delivery!");
      } else {
        toast.success("Delivery confirmed!");
        fetchOrders();
      }
    } catch (error) {
      toast.error("Error confirming delivery!");
    }
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "user",
      key: "user",
      align: "center",
    },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      align: "center",
      render: (shippingAddress) => (
        <span>
          {`${shippingAddress.fullName}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.phone}`}
        </span>
      ),
    },
    {
      title: "Order Items",
      dataIndex: "orderItems",
      key: "orderItems",
      align: "center",
      render: (orderItems) => (
        <span>
          {orderItems
            .map((item) => `${item.name} x ${item.quanlity}`)
            .join(", ")}
        </span>
      ),
    },
    {
      title: "Order Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (totalPrice) => <span>${totalPrice}</span>,
    },
    {
      title: "Store",
      dataIndex: "storeName",
      key: "storeName",
      align: "center",
    },
    {
      title: "Payment method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "orderedAt",
      key: "orderedAt",
      align: "center",
      render: (orderedAt) => (
        <span>{new Date(orderedAt).toLocaleString()}</span>
      ),
    },
    {
      title: "Delivery status",
      dataIndex: "delivery",
      key: "delivery",
      render: (delivery) => (
        <span>{delivery ? "Delivered" : "Not delivered"}</span>
      ),
      align: "center",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      align: "right",
      render: (order) => (
        <div className="actions-cell" style={{ textAlign: "right" }}>
          <Flex wrap="wrap" gap="small" justify="flex-end" align="center">
            <Button
              type="primary"
              disabled={order.delivery}
              onClick={() => handleConfirmDelivery(order._id)}
            >
              Confirm
            </Button>
          </Flex>
        </div>
      ),
    },
  ];

  return (
    <Flex vertical gap={10} justify="end">
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          total: orders.length,
          onChange: (page, pageSize) => setCurrentPage(page),
        }}
        scroll={{ x: 800, y: 600 }}
      />
    </Flex>
  );
};

export default Order;
