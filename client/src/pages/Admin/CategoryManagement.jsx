import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Switch,
  Space,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import {
  getAllCategories,
  createCategory,
  updateCategory,
} from "../../api/categoryAPI";
import AuthContext from "../../store/authCtx";

const { Column } = Table;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [reload, setReload] = useState(false);
  const authCtx = useContext(AuthContext);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    getAllCategories()
      .then((res) => {
        setCategories(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        message.error(err.response?.data?.message || "Lỗi tải danh mục");
        setLoading(false);
      });
  }, [authCtx.token, reload]);

  const handleAddCategory = () => {
    addForm.validateFields().then(async (values) => {
      try {
        await createCategory(authCtx.token, values);
        message.success("Thêm danh mục thành công");
        setIsAddModalVisible(false);
        addForm.resetFields();
        setReload((prev) => !prev);
      } catch (err) {
        message.error(err.response?.data?.message || "Lỗi thêm danh mục");
      }
    });
  };

  const handleEditCategory = () => {
    editForm.validateFields().then(async (values) => {
      try {
        await updateCategory(
          authCtx.token,
          {
            ...values,
            isShow: values.isShow,
          },
          editingCategory._id
        );
        message.success("Cập nhật danh mục thành công");
        setIsEditModalVisible(false);
        setReload((prev) => !prev);
      } catch (err) {
        message.error(err.response?.data?.message || "Lỗi cập nhật danh mục");
      }
    });
  };

  const toggleCategoryVisibility = async (category) => {
    try {
      await updateCategory(
        authCtx.token,
        {
          isShow: !category.isShow,
        },
        category._id
      );
      message.success(`${category.isShow ? "Ẩn" : "Hiện"} danh mục thành công`);
      setReload((prev) => !prev);
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi cập nhật trạng thái");
    }
  };

  return (
    <div className="w-full">
      <div className="m-4 flex justify-center">
        <Button
          type="primary"
          onClick={() => setIsAddModalVisible(true)}
          className="text-[#48cae4] border border-[#48cae4]"
        >
          Thêm Danh Mục
        </Button>
      </div>

      <Table
        dataSource={categories}
        rowKey={(record) => record._id}
        loading={loading}
      >
        <Column title="Tên Danh Mục" dataIndex="name" key="name" />
        <Column
          title="Thao tác"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <Button
                onClick={() => {
                  setEditingCategory(record);
                  editForm.setFieldsValue(record);
                  setIsEditModalVisible(true);
                }}
                icon={<EditOutlined />}
              >
                Sửa
              </Button>
              <Switch
                checked={record.isShow}
                onChange={() => toggleCategoryVisibility(record)}
                checkedChildren="Hiển thị"
                unCheckedChildren="Ẩn"
              />
            </Space>
          )}
        />
      </Table>

      {/* Add Category Modal */}
      <Modal
        title="Thêm Danh Mục Mới"
        open={isAddModalVisible}
        onOk={handleAddCategory}
        onCancel={() => {
          setIsAddModalVisible(false);
          addForm.resetFields();
        }}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="name"
            label="Tên Danh Mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title="Sửa Danh Mục"
        open={isEditModalVisible}
        onOk={handleEditCategory}
        onCancel={() => {
          setIsEditModalVisible(false);
          editForm.resetFields();
        }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="Tên Danh Mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item name="isShow" valuePropName="checked">
            <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
