import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Flex } from "antd";
import {
  getCategory,
  addCategory,
  deleteCategory,
  updateCategory,
} from "../api/category.api";
import { toast } from "react-toastify";

const Category = () => {
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [form.getFieldsValue("_id")]);

  const fetchCategories = async () => {
    try {
      const { response, err } = await getCategory(currentPage, pageSize);

      if (err) {
        toast.error("Error fetching categories!");
      } else {
        setCategories(response);
      }
    } catch (error) {
      toast.error("Error fetching categories!");
    }
  };

  const handleAddCategory = async (values) => {
    setLoading(true);

    try {
      const { response, err } = await addCategory(values);
      if (response) {
        toast.success("Category added successfully!");
      }

      if (err) {
        toast.error("Error adding category!");
      } else {
        setCategories([...categories, response]);
        setModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      toast.error("Error adding category!");
    }

    setLoading(false);
  };

  const handleUpdateCategory = async (categoryId, values) => {
    setLoading(true);

    try {
      const { response, err } = await updateCategory(categoryId, values);
      if (response) {
        toast.success("Category updated successfully!");
      }

      if (err) {
        toast.error("Error updating category!");
      } else {
        const updatedCategories = categories.map((category) =>
          category._id === categoryId ? { ...category, ...values } : category
        );
        setCategories(updatedCategories);
        setModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      toast.error("Error updating category!");
    }

    setLoading(false);
  };

  const handleDeleteCategory = async (categoryId) => {
    setLoading(true);

    try {
      const { response, err } = await deleteCategory(categoryId);
      if (response) {
        toast.success("Category deleted successfully!");
      }

      if (err) {
        toast.error("Error deleting category!");
      } else {
        setCategories(
          categories.filter((category) => category._id !== categoryId)
        );

        // Check if the current page becomes empty after deletion
        if (categories.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      toast.error("Error deleting category!");
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
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      align: "right",
      render: (_, category) => (
        <div className="actions-cell" style={{ textAlign: "right" }}>
          <Flex wrap="wrap" gap="small" justify="flex-end" align="center">
            <Button
              type="primary"
              onClick={() => handleEditButtonClick(category)}
            >
              Edit
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => handleDeleteCategory(category._id)}
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
        Add Category
      </Button>
      <Table
        dataSource={categories}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          total: categories.length,
          onChange: (page, pageSize) => setCurrentPage(page),
        }}
        scroll={{ x: 800, y: 600 }}
      />
      <Modal
        visible={modalVisible}
        title="Category"
        onCancel={handleModalCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  if (form.getFieldValue("_id")) {
                    handleUpdateCategory(form.getFieldValue("_id"), values);
                  } else {
                    handleAddCategory(values);
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
            label="Category Name"
            rules={[
              { required: true, message: "Please enter the category name" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
};

export default Category;
