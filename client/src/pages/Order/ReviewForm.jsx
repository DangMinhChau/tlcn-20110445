import React from 'react'
import {  Form, Input, Modal, Rate } from 'antd';
const ReviewForm = ({ open, onCreate, onCancel,productId }) => {
    const [form] = Form.useForm();
  return (
    <Modal
    open={open}
    title="Đánh giá sản phẩm"
    okText="Đánh giá"
    cancelText="Hủy"
    onCancel={onCancel}
    onOk={() => {
      form
        .validateFields()
        .then((values) => {
          form.resetFields();
          onCreate(values,productId);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    }}
  >
    <Form
      form={form}
      layout="vertical"
      name="form_in_modal"
      initialValues={{
        rating: 5,
      }}
    >
      <Form.Item name="rating" label="">
        <Rate />
      </Form.Item>
      <Form.Item name="comment" label="Đánh giá">
      <Input.TextArea
    showCount
    maxLength={250}
    style={{
      height: 120,
      marginBottom: 24,
    }}
    placeholder="Đánh giá sản phẩm"
  />
      </Form.Item>

    </Form>
  </Modal>
  )
}

export default ReviewForm