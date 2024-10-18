import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Flex } from "antd";
import { getStore, addStore, updateStore, deleteStore } from "../api/store.api";
import { toast } from "react-toastify";

const Store = () => {
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchStories();
  }, [form.getFieldsValue("_id")]);

  const fetchStories = async () => {
    try {
      const { response, err } = await getStore(currentPage, pageSize);

      if (err) {
        toast.error("Error fetching stories!");
      } else {
        setStories(response);
      }
    } catch (error) {
      toast.error("Error fetching stories!");
    }
  };

  const handleAddStore = async (values) => {
    setLoading(true);

    try {
      const { response, err } = await addStore(values);
      if (response) {
        toast.success("Store added successfully!");
      }

      if (err) {
        toast.error("Error adding store!");
      } else {
        setStories([...stories, response]);
        setModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      toast.error("Error adding store!");
    }

    setLoading(false);
  };

  const handleUpdateStore = async (storeId, values) => {
    setLoading(true);

    try {
      const { response, err } = await updateStore(storeId, values);
      if (response) {
        toast.success("Store updated successfully!");
      }

      if (err) {
        toast.error("Error updating store!");
      } else {
        const updatedStories = stories.map((store) =>
          store._id === storeId ? { ...store, ...values } : store
        );
        setStories(updatedStories);
        setModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      toast.error("Error updating store!");
    }

    setLoading(false);
  };

  const handleDeleteStore = async (storeId) => {
    setLoading(true);

    try {
      const { response, err } = await deleteStore(storeId);
      if (response) {
        toast.success("Store deleted successfully!");
      }

      if (err) {
        toast.error("Error deleting store!");
      } else {
        setStories(stories.filter((store) => store._id !== storeId));

        if (stories.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      toast.error("Error deleting store!");
    }

    setLoading(false);
  };

  const handleEditButtonClick = (category) => {
    form.setFieldsValue(category);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Store Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Store Address",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      align: "right",
      render: (_, store) => (
        <div className="actions-cell" style={{ textAlign: "right" }}>
          <Flex wrap="wrap" gap="small" justify="flex-end" align="center">
            <Button type="primary" onClick={() => handleEditButtonClick(store)}>
              Edit
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => handleDeleteStore(store._id)}
            >
              Delete
            </Button>
          </Flex>
        </div>
      ),
    },
  ];

  return (
    <Flex vertical gap={10} justify="end">
      <Button
        type="primary"
        onClick={() => setModalVisible(true)}
        style={{ maxWidth: "250px" }}
      >
        Add Store
      </Button>
      <Table
        dataSource={stories}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          total: stories.length,
          onChange: (page, pageSize) => setCurrentPage(page),
        }}
        scroll={{ x: 800, y: 600 }}
      />
      <Modal
        visible={modalVisible}
        title="Store"
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => {
              form.validateFields().then((values) => {
                if (form.getFieldValue("_id")) {
                  handleUpdateStore(form.getFieldValue("_id"), values);
                } else {
                  handleAddStore(values);
                }
              })
              .catch((error) => {
                toast.error("Please fill in all information!");
              });
            }}
          >
            {form.getFieldValue("_id") ? "Save" : "Add"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="_id" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Store Name"
            rules={[{ required: true, message: "Please enter the store name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Store Adress"
            rules={[
              { required: true, message: "Please enter the store address" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
};

export default Store;
