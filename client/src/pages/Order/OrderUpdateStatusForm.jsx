import React from 'react';
import {  Form,  Modal, Radio } from 'antd';
const OrderUpdateStatusForm = ({ open, onCreate, onCancel,order }) => {
    const [form] = Form.useForm();
    return (
      <Modal
        open={open}
        title="Cập nhật trạng thái đơn hàng"
        okText="Cập nhật"
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
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
        >
          <Form.Item name="orderStatus" className="collection-create-form_last-form-item">
            <Radio.Group>
              <Radio value="new" disabled={order.orderStatus==='processing'||order.orderStatus==='done'||order.orderStatus==='fail'}>Đang xác thực</Radio>
              <Radio value="processing" disabled={order.orderStatus==='processing'||order.orderStatus==='done'||order.orderStatus==='fail'}>Đang xử lý</Radio>
              <Radio value="done" disabled={order.orderStatus==='new'||order.orderStatus==='fail'}>Hoàn thành</Radio>
              <Radio value="fail" disabled={order.orderStatus==='done'}>Hủy</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    );
}

export default OrderUpdateStatusForm