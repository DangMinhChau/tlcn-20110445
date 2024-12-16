import { Button, Form, Input, Modal,message, Col, Row } from 'antd'
import React, { useContext, useState } from 'react'
import AuthContext from '../../../store/authCtx';
import { updatePassword } from '../../../api/authAPI';

const ChangePassword = () => {
    const authCtx = useContext(AuthContext);
    const [loading, setloading] = useState(false)
    const { confirm } = Modal;
    const [messageApi, contextHolder] = message.useMessage();
    const showConfirm = (data, token) => {
        confirm({
          title: "XÁC NHẬN",
          content: `Thay đổi mật khẩu?`,
          okText:<span  className="text-[#48cae4] hover:text-white">OK</span>,
          onOk() {
            
            setloading(true)
            updatePassword(token,data).then(res=>{
                success("Thay đổi thành công.");
                authCtx.clearStoge();
                authCtx.login(res.token,res.data.user.firstName,res.data.user.lastName, res.data.user.photo,res.data.user.email, res.data.user.role)
                setloading(false)
            }).catch((err) => {
                console.log(err);
                setloading(false)
                error(err.response.data.message);
              });
          },
          onCancel() {
            // console.log("cancel");
            return false;
          },
        });
      };
      const error = (mes) => {
        messageApi.error(mes);
      };
      const success = (mes) => {
        messageApi.success(mes);
      };
      const onFinish = (values) => {
        // console.log(values);

        showConfirm(values, authCtx.token);
      };
      const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
      };
  return (
    <>
    {contextHolder}
    <Row style={{ marginTop: "50px", justifyContent: "center" }}>
      <Col span={10} style={{ textAlign: "center" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px"}} className='text-[18px] font-bold'>
          Đổi mật khẩu
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
    <Form
    name="basic"
    labelCol={{
      span: 10,
    }}
    wrapperCol={{
      span: 14,
    }}
    style={{
      maxWidth: 600,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >

<Form.Item
        name="password"
        label="Mật khẩu"
        rules={[
          {
            required: true,
            message: "Vui lòng thêm mật khẩu"
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || value.length >=8 ) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Mật khẩu phải từ 8 ký tự trở lên")
              );
            }
          })
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="Mật khẩu mới"
        rules={[
          {
            required: true,
            message: "Vui lòng thêm mật khẩu mới"
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || value.length >=8 ) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Mật khẩu phải từ 8 ký tự trở lên")
              );
            }
          })
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="newPasswordConfirm"
        label="Xác nhận mật khẩu"
        dependencies={["newPassword"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Vui lòng thêm xác nhận mật khẩu"
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Mật khẩu mới và xác nhận không giống")
              );
            }
          })
        ]}
      >
        <Input.Password />
      </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button className="text-[#48cae4] border border-[#48cae4]" type="primary" htmlType="submit" disabled={loading}>
        Đổi
      </Button>
    </Form.Item>
  </Form>
  </div>
          </Col>
        </Row>
        </>     
  )
}

export default ChangePassword