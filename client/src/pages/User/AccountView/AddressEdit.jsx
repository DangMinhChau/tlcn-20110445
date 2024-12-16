import React, { useEffect, useState } from 'react'
import {  Form, Input, Modal, Select } from 'antd';
import { getAllProvinces, getDistrictsByProvince, getWardsByDistrict } from '../../../api/provinceAPI';


const AddressEdit = ({ open, onCreate, onCancel, item }) => {
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
    const [form] = Form.useForm();
    return (
      <Modal
        open={open}
        title="Cập nhật thông tin địa chỉ"
        okText="Cập nhật"
        cancelText="Cancel"
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
          <Form.Item
            name="fullName"
            label="Tên người nhận"
            initialValue={item.fullName}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNo"
            label="Số điện thoại"
            initialValue={item.phoneNo}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            initialValue={item.address}
          >
            <Input />
          </Form.Item>
          <Form.Item
      label="Tỉnh thành"
      name="city"
    >
      <Select
      style={{ width: 220 }}
      options={provincesOptions}
      onChange={provinceChangeHandler}
    />
    </Form.Item>

    <Form.Item
      label="Quận huyện"
      name="district"
    >
      <Select
      style={{ width: 220 }}
      options={districtsOptions}
      onChange={districtChangeHandler}
    />
    </Form.Item>

    <Form.Item
      label="Phường xã"
      name="ward"
    >
      <Select
      style={{ width: 220 }}
      options={wardsOptions}
    />
    </Form.Item>
        </Form>
      </Modal>
    );
  };

export default AddressEdit