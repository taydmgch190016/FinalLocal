import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Flex, Select } from "antd";
import {
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api/employee.api";
import { getStore } from "../api/store.api";
import { toast } from "react-toastify";

const Employee = () => {
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const { response: employeeResponse, err: employeeErr } =
        await getEmployee(currentPage, pageSize);
      const { response: storeResponse, err: storeErr } = await getStore();

      if (employeeErr || storeErr) {
        toast.error("Error fetching employee or store!");
      } else {
        const updatedEmployee = employeeResponse.map((emp) => {
          const store = storeResponse.find(
            (store) => store._id === emp.storeId
          );
          const storeName = store ? store.name : "N/A";
          return { ...emp, storeName, storeOptions: storeResponse };
        });

        setEmployee(updatedEmployee);
      }
    } catch (error) {
      toast.error("Error fetching employee or store!");
    }
  };

  const handleAddEmployeee = async (values) => {
    setLoading(true);

    try {
      const { response, err } = await addEmployee(values);
      if (response) {
        toast.success("Employee added successfully!");
      }

      if (err) {
        toast.error("Error adding employee!");
      } else {
        setEmployee([...employee, response]);
        setModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      toast.error("Error adding employee!");
    }

    setLoading(false);
  };

  const handleUpdateEmployee = async (employeeId, values) => {
    setLoading(true);

    try {
      const { response, err } = await updateEmployee(employeeId, values);
      if (response) {
        toast.success("Employee updated successfully!");
        const updatedEmployee = employee.map((emp) =>
          emp._id === employeeId ? { ...emp, ...values } : emp
        );
        setEmployee(updatedEmployee);
        setModalVisible(false);
        form.resetFields();
      }

      if (err) {
        toast.error("Error updating employee!");
      }
    } catch (error) {
      toast.error("Error updating employee!");
    }

    setLoading(false);
  };

  const handleDeleteEmployeee = async (employeeId) => {
    setLoading(true);

    try {
      const { response, err } = await deleteEmployee(employeeId);
      if (response) {
        toast.success("Store deleted successfully!");
      }

      if (err) {
        toast.error("Error deleting store!");
      } else {
        setEmployee(employee.filter((employee) => employee._id !== employeeId));

        if (employee.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      toast.error("Error deleting store!");
    }

    setLoading(false);
  };

  const handleEditButtonClick = (employee) => {
    form.setFieldsValue(employee);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Employee Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Employee Password",
      dataIndex: "password",
      key: "password",
      align: "center",
      render: (_, employee) => (
        <div className="password-cell" style={{ textAlign: "center" }}>
          {"•".repeat(8)}
        </div>
      ),
    },
    {
      title: "Store",
      dataIndex: "storeName",
      key: "storeName",
      align: "center",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      align: "right",
      render: (_, employee) => (
        <div className="actions-cell" style={{ textAlign: "right" }}>
          <Flex wrap="wrap" gap="small" justify="flex-end" align="center">
            <Button
              type="primary"
              onClick={() => handleEditButtonClick(employee)}
            >
              Edit
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => handleDeleteEmployeee(employee._id)}
            >
              Delete
            </Button>
          </Flex>
        </div>
      ),
    },
  ];

  const storeOptions = employee
    .map((emp) => emp.storeOptions)
    .flat()
    .filter((store, index, self) => {
      return index === self.findIndex((s) => s?._id === store?._id);
    });

  return (
    <Flex vertical gap={10} justify="end">
      
      <Button
        type="primary"
        onClick={() => setModalVisible(true)}
        style={{ maxWidth: "150px", float: "right" }}
      >
        Add Employee
      </Button>
      
      <Table
        dataSource={employee}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          total: employee.length,
          onChange: (page, pageSize) => setCurrentPage(page),
        }}
        scroll={{ x: 800, y: 600 }}
      />
      <Modal
        visible={modalVisible}
        title="Employee"
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
                  handleUpdateEmployee(form.getFieldValue("_id"), values);
                } else {
                  handleAddEmployeee(values);
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
            name="email"
            label="Employee Email"
            rules={[
              { required: true, message: "Please enter the employee email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Employee Password"
            rules={[
              { required: true, message: "Please enter the employee password" },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            name="storeId"
            label="Store"
            rules={[{ required: true, message: "Please select the store" }]}
          >
            <Select>
              {storeOptions?.map((store) => (
                <Select.Option key={store?._id} value={store?._id}>
                  {store?.name || "N/A"}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
};

export default Employee;
