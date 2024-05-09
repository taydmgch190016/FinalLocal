import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Flex,
  Select,
  Tooltip,
  Upload,
} from "antd";

import {
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../api/product.api";
import { getStore } from "../api/store.api";
import { getCategory } from "../api/category.api";

const Product = () => {
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(3);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState([]);
  const [image, setImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);
  const fetchProduct = async () => {
    try {
      const { response: productResponse, err: productErr } = await getProduct(
        currentPage,
        pageSize
      );
      const { response: storeResponse, err: storeErr } = await getStore();
      const { response: categoryResponse, err: categoryErr } =
        await getCategory();
      const storedStoreId = localStorage.getItem("storeId");

      if (productErr || storeErr || categoryErr) {
        toast.error("Error fetching product, store or category!");
      } else {
        const updatedProduct = productResponse.map((prod) => {
          const store = storeResponse.find(
            (store) => store._id === prod.storeId
          );
          const storeName = store ? store.name : "N/A";
          const category = categoryResponse.find(
            (category) => category._id === prod.categoryId
          );
          const categoryName = category ? category.name : "N/A";
          return {
            ...prod,
            storeName,
            storeOptions: storeResponse,
            categoryName,
            categoryOptions: categoryResponse,
          };
        });

        const filteredProduct = updatedProduct.filter(
          (prod) => prod.storeId === storedStoreId
        );

        setProduct(filteredProduct);
      }
    } catch (error) {
      toast.error("Error fetching product!");
    }
  };

  const handleAddProduct = async (values) => {
    setLoading(true);

    const valuesWithImage = { ...values};

    try {
      const { response, err } = await addProduct(valuesWithImage);
      if (response) {
        toast.success("Product added successfully!");
      }

      if (err) {
        toast.error("Error adding product!");
      } else {
        setProduct([...product, response]);
        setModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      toast.error("Error adding product!");
    }

    setLoading(false);
  };

  const handleUpdateProduct = async (productId, values) => {
    setLoading(true);
    const valuesWithImage = { ...values, image };

    try {
      const { response, err } = await updateProduct(productId, valuesWithImage);
      if (response) {
        toast.success("Product updated successfully!");
        const updatedProduct = product.map((prod) =>
          prod._id === productId ? { ...prod, ...values } : prod
        );
        setProduct(updatedProduct);
        setModalVisible(false);
        form.resetFields();
      }

      if (err) {
        toast.error("Error updating product!");
      }
    } catch (error) {
      toast.error("Error updating product!");
    }

    setLoading(false);
  };

  const handleDeleteProduct = async (productId) => {
    setLoading(true);

    try {
      const { response, err } = await deleteProduct(productId);
      if (response) {
        toast.success("Product deleted successfully!");
      }

      if (err) {
        toast.error("Error deleting product!");
      } else {
        setProduct(product.filter((prod) => prod._id !== productId));

        if (product.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      toast.error("Error deleting product!");
    }

    setLoading(false);
  };

  const handleEditButtonClick = (product) => {
    form.setFieldsValue(product);
    setEdit(true);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setImage(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Tooltip title={text}>
          <div className="description-cell">
            {text.length > 50 ? `${text.slice(0, 50)}...` : text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Image",
      dataIndex: "imageURL",
      key: "imageURL",
      render: (_, product) => (
        <img
          src={product.imageURL[0]}
          alt="Product"
          style={{ width: "100px", height: "100px" }}
        />
      ),
    },
    {
      title: "Store",
      dataIndex: "storeName",
      key: "storeName",
      align: "center",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      align: "center",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      align: "right",
      render: (_, product) => (
        <div className="actions-cell" style={{ textAlign: "right" }}>
          <Flex wrap="wrap" gap="small" justify="flex-end" align="center">
            <Button
              type="primary"
              onClick={() => handleEditButtonClick(product)}
            >
              Edit
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => handleDeleteProduct(product._id)}
            >
              Delete
            </Button>
          </Flex>
        </div>
      ),
    },
  ];

  

  const categoryOptions = product
    .map((prd) => prd.categoryOptions)
    .flat()
    .filter((category, index, self) => {
      return index === self.findIndex((c) => c?._id === category?._id);
    });

  return (
    <Flex vertical gap={10} justify="end">
      <Button
        type="primary"
        onClick={() => setModalVisible(true)}
        style={{ maxWidth: "250px" }}
      >
        Add Product
      </Button>
      <Table
        dataSource={product}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          total: product.length,
          onChange: (page, pageSize) => setCurrentPage(page),
        }}
        scroll={{ x: 800, y: 600 }}
      />
      <Modal
        visible={modalVisible}
        title="Product"
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
                  handleUpdateProduct(form.getFieldValue("_id"), values);
                } else {
                  handleAddProduct(values);
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
            label="Product Name"
            rules={[
              { required: true, message: "Please enter the product name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Product Description"
            rules={[
              {
                required: true,
                message: "Please enter the product description",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="price"
            label="Product Price"
            rules={[
              {
                required: true,
                message: "Please enter the product price",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || parseFloat(value) >= 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Please enter a valid price")
                  );
                },
              }),
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="quantity"
            type="number"
            label="Product Quantity"
            rules={[
              {
                required: true,
                message: "Please enter the product quantity",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || parseFloat(value) >= 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Please enter a valid price")
                  );
                },
              }),
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Product Image"
            rules={[
              {
                required: !edit,
                message: "Please upload the product image",
              },
            ]}
          >
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={(file) => {
                setImage(file);
                return false;
              }}
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Product"
                  style={{ width: "100px", height: "100px" }}
                />
              ) : (
                <Button>Upload</Button>
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select the category" }]}
          >
            <Select>
              {categoryOptions?.map((category) => (
                <Select.Option key={category?._id} value={category?._id}>
                  {category?.name || "N/A"}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
};

export default Product;
