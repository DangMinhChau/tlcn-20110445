import React, { useContext, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import AuthContext from '../../../store/authCtx';
import { updateUser } from '../../../api/userAPI';
import { filterObj } from '../../../configs/constants';

// KIỂM TRA FILE TRƯỚC KHI GỬI
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

// TRẢ VỀ COMPONENT
const ChangeInfo = (props) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const { confirm } = Modal;
  const [messageApi, contextHolder] = message.useMessage();

  const showConfirm = (formData, token) => {
    confirm({
      title: "XÁC NHẬN",
      content: `Thay đổi thông tin?`,
      okText:<span  className="text-[#48cae4] hover:text-white">OK</span>,
      onOk() {
        // console.log(token)
        updateUser(formData, token)
          .then((res) => {
              success("Thay đổi thành công.");
              props.setUserInfo(filterObj(res.data.user, 'firstName', 'lastName', 'email',"photo"));
      
          })
          .catch((err) => {
            console.log(err);
            error("Cập nhật thất bại thử lại sau");
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
    const handleChange = (info) => {
        if (info.file.status === "uploading") {
          setLoading(true);
          return;
        }
        if (info.file.status === "done") {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, (url) => {
            setLoading(false);
            setImageUrl(url);
          });
        }
      };
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
      };
      const uploadButton = (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div
            style={{
              marginTop: 8,
            }}
          >
            Tải hình
          </div>
        </div>
      );


      const onFinish = (values) => {
        const formData = new FormData();
        if(values.photo) formData.append("photo", values.photo.file.originFileObj);
        if(values.firstName) formData.append("firstName", values.firstName);
        if(values.lastName) formData.append("lastName", values.lastName);
        if(values.email) formData.append("email", values.email);
    
        showConfirm(formData, authCtx.token);
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
              Thay đổi thông tin
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Form
                labelCol={{
                  span: 4,
                }}
                wrapperCol={{
                  span: 20,
                }}
                layout="horizontal"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item label="Họ" name="lastName">
                  <Input />
                </Form.Item>
                <Form.Item label="Tên" name="firstName">
                  <Input />
                </Form.Item>
        
                <Form.Item label="Email" name="email"
                rules={[
                    {
                      type: "email",
                      message: "Vui lòng thêm email hợp lệ"
                    }
                  ]}>
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Hình"
                  valuePropName="file"
                  name="photo"
                >
<Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    customRequest={({ onSuccess }) =>
                      setTimeout(() => {
                        onSuccess("ok", null);
                      }, 1000)
                    }
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{
                          width: "100%",
                        }}
                      />
                    ) : (
                      uploadButton
                    )}
        </Upload>
                </Form.Item>
                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 8,
                  }}
                >
                  <Button type="primary" htmlType="submit" className="text-[#48cae4] border border-[#48cae4]">
                    Thay đổi
                  </Button>
                </Form.Item>
              </Form>
        
            </div>
          </Col>
        </Row>
        
    </>
  )
}

export default ChangeInfo