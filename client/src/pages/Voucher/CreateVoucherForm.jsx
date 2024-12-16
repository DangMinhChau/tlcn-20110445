import { DatePicker, Form, Input, InputNumber, Modal } from "antd";
import React from "react";

const CreateVoucherForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      title="Thêm voucher"
      okText="Tạo"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="createVoucherForm">
        <Form.Item
          name="name"
          label="Mã voucher"
          rules={[
            {
              required: true,
              message: "Vui lòng thêm mã",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="discount"
          label="Giảm"
          rules={[
            {
              required: true,
              message: "Vui lòng thêm số tiền giảm",
            },
          ]}
        >
          <InputNumber min={10000} />
        </Form.Item>
        <Form.Item
          name="duration"
          label="Thời hạn"
          rules={[
            {
              required: true,
              message: "Vui lòng thêm thời hạn",
            },
          ]}
        >
          <DatePicker.RangePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateVoucherForm;
