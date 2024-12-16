import { Button,  Form, Input, Modal,  Select } from 'antd'
import React, { useContext, useEffect,  useState } from 'react'
import AuthContext from '../../../store/authCtx';
import { createAddress } from '../../../api/userAPI';
import { getAllProvinces, getDistrictsByProvince, getWardsByDistrict } from '../../../api/provinceAPI';
const success = (mes) => {
    Modal.success({
      title:'SUCCESS',
      content: mes,
      closable:true,
    });
  };
  const error = (mes) => {
    Modal.error({
      title: "ERROR",
      content: mes,
      closable:true,
    });
  };

const AddressForm = ({setReload}) => {
  const authCtx= useContext(AuthContext);
  const [address, setAddress] = useState({
    provinces:[],
    districts:[],
    wards:[]
  })
useEffect(() => {
  getAllProvinces().then(res=>{
    // console.log(res)
    setAddress({...address,provinces:[...res]})
  }).catch(err=>{
    console.log(err)
  })
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

 const provincesOptions=address.provinces.map(province=>{
  return {"label":province.name,"value":province.name}
 })
 const districtsOptions=address.districts.map(district=>{
  return {"label":district.name,"value":district.name}
 })

 const wardsOptions=address.wards.map(ward=>{
  return {"label":ward.name,"value":ward.name}
 })

 const provinceChangeHandler=(value)=>{
  const province= address.provinces.find(province=>province.name===value)
  // console.log(province)
  getDistrictsByProvince(province.code).then(res=>{
    setAddress({...address,districts:[...res.districts],wards:[]})
  }).catch(err=>{
    console.log(err)
  })
 }

 const districtChangeHandler=(value)=>{
  const district= address.districts.find(district=>district.name===value)
  // console.log(province)
  getWardsByDistrict(district.code).then(res=>{
    setAddress({...address,wards:[...res.wards]})
  }).catch(err=>{
    console.log(err)
  })
 }
 
// console.log(provincesOptions)
    const onFinish = (values) => {
        console.log('Success:', values);
        createAddress(authCtx.token,values ).then(res=>{
            success("Thêm thành công")
            setReload(old=>!old)
        }).catch(err=>{
            error(err.response.data.message)
        })
      };
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
  return (
    <>
    <h3 className='text-[18px] font-bold pb-3'>Thêm địa chỉ</h3>
    <Form
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Tên người nhận"
      name="fullName"
      rules={[
        {
          required: true,
          message: 'Vui lòng thêm tên người nhận!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Số điện thoại"
      name="phoneNo"
      rules={[
        {
          required: true,
          message: 'Vui lòng thêm số điện thoại!',
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || value.length >=10 ) {
              return Promise.resolve();
            }
            return Promise.reject(
              new Error("Số điện thoại phải có ít nhất 10 chữ số")
            );
          }
        })
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Địa chỉ"
      name="address"
      rules={[
        {
          required: true,
          message: 'Vui lòng thêm địa chỉ',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Tỉnh thành"
      name="city"
      rules={[
        {
          required: true,
          message: 'Vui lòng thêm tỉnh thành',
        },
      ]}
    >
      <Select
      // style={{ width: 220 }}
      options={provincesOptions}
      onChange={provinceChangeHandler}
    />
    </Form.Item>

        <Form.Item
      label="Quận/huyện"
      name="district"
      rules={[
        {
          required: true,
          message: 'Vui lòng thêm quận huyện',
        },
      ]}
    >
      <Select
      // style={{ width: 220 }}
      options={districtsOptions}
      onChange={districtChangeHandler}
    />
    </Form.Item>

        <Form.Item
      label="Phường/xã"
      name="ward"
      rules={[
        {
          required: true,
          message: 'Vui lòng thêm phường xã',
        },
      ]}
    >
      <Select
      // style={{ width: 200 }}
      options={wardsOptions}
    />
    </Form.Item>


    

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit" className='text-[#48cae4] border border-[#48cae4]'>
        Thêm địa chỉ mới
      </Button>
    </Form.Item>
  </Form>
  </>
  )
}

export default AddressForm