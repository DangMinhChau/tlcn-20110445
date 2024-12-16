import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Space,
  Tag,
  notification,
  Row,
  Col,
  Typography,
  Switch,
  Rate,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  getAllProducts,
  createProduct,
  updateProduct,
} from "../../api/productAPI";
import { approveReview } from "../../api/reviewAPI";
import { getAllCategories } from "../../api/categoryAPI";
import AuthContext from "../../store/authCtx";

const { Option } = Select;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [reload, setReload] = useState(false);
  const authCtx = useContext(AuthContext);
  const [api, contextHolder] = notification.useNotification();
  const [fileList, setFileList] = useState({
    coverImage: [],
    images: [],
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    category: "all",
    sort: "createAt",
    search: {
      name: "",
      sku: "",
      color: "",
    },
    rangePrice: [0, 2000000],
  });
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getAllProducts(
            pagination.pageSize,
            pagination.current,
            filters.category,
            filters.sort,
            filters.rangePrice,
            filters.search
          ),
          getAllCategories(),
        ]);
        setCategories(categoriesRes.data.data);
        setProducts(productsRes.data.data);
        setPagination({
          ...pagination,
          total: productsRes.totalPage * pagination.pageSize,
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    loadData();
  }, [pagination.current, filters, authCtx.token, reload]);

  // Dependencies include filters for sort changes  // Handle table change for sorting and pagination
  const handleTableChange = (newPagination, filters, sorter) => {
    setPagination(newPagination);

    let sortString = "createAt"; // default sort

    if (sorter.field) {
      if (sorter.field === "totalStock") {
        sortString = `${sorter.order === "descend" ? "-" : ""}totalStock`;
      } else {
        sortString = `${sorter.order === "descend" ? "-" : ""}${sorter.field}`;
      }
    }

    setFilters((prev) => ({
      ...prev,
      sort: sortString,
      category: filters.category ? filters.category[0] : "all",
      parentCategory: filters.parentCategory
        ? filters.parentCategory[0]
        : "all",
    }));
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setFilters((prev) => ({
      ...prev,
      search: {
        ...prev.search,
        [dataIndex]: selectedKeys[0],
      },
    }));
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              setFilters((prev) => ({
                ...prev,
                search: {
                  ...prev.search,
                  [dataIndex]: "",
                },
              }));
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
  });
  const showReviewsModal = (product) => {
    setSelectedProduct(product);
    setIsReviewModalVisible(true);
  };
  const handleApproveReview = async (productId, reviewId, isApproved) => {
    try {
      await approveReview(authCtx.token, productId, reviewId, isApproved);
      api.success({
        message: "Thành công",
        description: `Đã ${isApproved ? "hiện" : "ẩn"} đánh giá`,
      });
      setSelectedProduct({
        ...selectedProduct,
        reviews: selectedProduct.reviews.map((r) =>
          r._id === reviewId ? { ...r, isApproved } : r
        ),
      });
    } catch (err) {
      api.error({
        message: "Thất bại",
        description: err.response?.data?.message || "Có lỗi xảy ra",
      });
    }
  };
  const columns = [
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      ...getColumnSearchProps("sku"),
      sorter: true,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: true,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Loại",
      dataIndex: "parentCategory",
      key: "parentCategory",
      render: (parentCategory) => (
        <Tag color={parentCategory === "pants" ? "blue" : "green"}>
          {parentCategory === "pants"
            ? "Quần"
            : parentCategory === "shirts"
            ? "Áo"
            : "Khác"}
        </Tag>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "name"],
      key: "category",
      filters: categories.map((cat) => ({
        text: cat.name,
        value: cat._id,
      })),
      onFilter: (value, record) => record.category._id === value,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      ...getColumnSearchProps("color"),
    },
    {
      title: "Tồn kho",
      key: "totalStock",
      render: (_, record) => {
        const total = record.inventory.reduce(
          (sum, item) => sum + item.stock,
          0
        );
        return <span>{total}</span>;
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: true,
      render: (price) =>
        price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => <Tag color="red">{discount}%</Tag>,
    },
    {
      title: "Đánh giá",
      key: "reviews",
      render: (_, record) => (
        <Button type="link" onClick={() => showReviewsModal(record)}>
          Xem
        </Button>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          >
            Sửa
          </Button>
          <Button danger onClick={() => showDeleteConfirm(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];
  const showDeleteConfirm = (product) => {
    Modal.confirm({
      title: "Xác nhận vô hiệu hóa sản phẩm",
      content: `Bạn có chắc chắn muốn vô hiệu hóa sản phẩm "${product.name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await updateProduct(authCtx.token, product._id, {
            isShow: false,
          });

          api.success({
            message: "Thành công",
            description: "Đã vô hiệu hóa sản phẩm",
          });

          setReload((prev) => !prev);
        } catch (err) {
          api.error({
            message: "Thất bại",
            description: err.response?.data?.message || "Có lỗi xảy ra",
          });
        }
      },
    });
  };
  const handleImageChange = (info, type) => {
    setFileList((prev) => ({
      ...prev,
      [type]: info.fileList,
    }));
  };

  const uploadProps = {
    beforeUpload: () => false,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
    },
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({
      ...record,
      category: record.category._id,
      inventory: record.inventory,
    });

    // Set image previews for existing product
    setFileList({
      coverImage: record.coverImage
        ? [
            {
              uid: "-1",
              name: "cover.png",
              status: "done",
              url: record.coverImage,
            },
          ]
        : [],
      images: record.images
        ? record.images.map((url, index) => ({
            uid: `-${index + 1}`,
            name: `image-${index}.png`,
            status: "done",
            url: url,
          }))
        : [],
    });

    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Append basic fields
      Object.keys(values).forEach((key) => {
        if (
          key !== "coverImage" &&
          key !== "images" &&
          values[key] !== undefined
        ) {
          if (key === "inventory") {
            formData.append("inventory", JSON.stringify(values.inventory));
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      // Handle image uploads
      if (editingProduct) {
        // Only append new images if they were changed
        if (fileList.coverImage[0]?.originFileObj) {
          formData.append("coverImage", fileList.coverImage[0].originFileObj);
        }

        fileList.images.forEach((file) => {
          if (file.originFileObj) {
            formData.append("images", file.originFileObj);
          }
        });

        // Make update API call
        await updateProduct(authCtx.token, editingProduct._id, formData);
      } else {
        // For new products, images are required
        if (fileList.coverImage[0]?.originFileObj) {
          formData.append("coverImage", fileList.coverImage[0].originFileObj);
        }

        fileList.images.forEach((file) => {
          if (file.originFileObj) {
            formData.append("images", file.originFileObj);
          }
        });

        await createProduct(authCtx.token, formData);
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingProduct(null);
      setFileList({ coverImage: [], images: [] });
      // setReload(!reload);
      setReload((prev) => !prev);

      api.success({
        message: "Thành công",
        description: `${
          editingProduct ? "Cập nhật" : "Thêm"
        } sản phẩm thành công`,
      });
    } catch (err) {
      console.error("Error:", err);
      api.error({
        message: "Thất bại",
        description: err.response?.data?.message || "Có lỗi xảy ra",
      });
    }
  };
  return (
    <div className="p-6">
      {contextHolder}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProduct(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingProduct(null);
        }}
        footer={null}
        width={1000}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="sku"
                label="SKU"
                rules={[{ required: true, message: "Vui lòng nhập SKU" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="parentCategory"
                label="Loại sản phẩm"
                rules={[
                  { required: true, message: "Vui lòng chọn loại sản phẩm" },
                ]}
              >
                <Select>
                  <Option value="pants">Quần</Option>
                  <Option value="shirts">Áo</Option>
                  <Option value="none">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select>
                  {categories.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Màu sắc"
                name="color"
                rules={[{ required: true, message: "Vui lòng nhập màu sắc!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: "Vui lòng nhập giá" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="discount" label="Giảm giá (%)" initialValue={0}>
                <InputNumber min={0} max={90} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <div className="mb-4">
            <Typography.Title level={5}>
              Kích thước và số lượng
            </Typography.Title>
            <Form.List name="inventory">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} className="mb-2">
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          name={[name, "size"]} // Changed from name="size" to name={[name, "size"]}
                          label="Size"
                          rules={[
                            {
                              required: true,
                              message: "Please input size",
                            },
                          ]}
                        >
                          <Input placeholder="Enter size" allowClear />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          {...restField}
                          name={[name, "stock"]}
                          label="Số lượng"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số lượng",
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            placeholder="Nhập số lượng"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4} className="flex items-center mt-8">
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm size
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Ảnh bìa" required>
                <Upload
                  {...uploadProps}
                  listType="picture-card"
                  fileList={fileList.coverImage}
                  onChange={(info) => handleImageChange(info, "coverImage")}
                  maxCount={1}
                >
                  {fileList.coverImage.length < 1 && "+ Upload"}
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ảnh chi tiết">
                <Upload
                  {...uploadProps}
                  listType="picture-card"
                  fileList={fileList.images}
                  onChange={(info) => handleImageChange(info, "images")}
                  maxCount={4}
                >
                  {fileList.images.length < 4 && "+ Upload"}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="text-right">
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setEditingProduct(null);
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingProduct ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={`Đánh giá sản phẩm ${selectedProduct?.name}`}
        open={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={selectedProduct?.reviews || []}
          columns={[
            {
              title: "Người dùng",
              render: (_, record) =>
                `${record.user.firstName} ${record.user.lastName}`,
            },
            {
              title: "Đánh giá",
              dataIndex: "rating",
              render: (rating) => <Rate disabled value={rating} />,
            },
            {
              title: "Nội dung",
              dataIndex: "comment",
            },
            {
              title: "Trạng thái",
              render: (_, record) => (
                <Switch
                  checked={record.isApproved}
                  onChange={(checked) =>
                    handleApproveReview(
                      selectedProduct._id,
                      record._id,
                      checked
                    )
                  }
                />
              ),
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default ProductManagement;
