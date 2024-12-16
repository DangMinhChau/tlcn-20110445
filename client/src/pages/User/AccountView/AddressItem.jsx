import { Card, Descriptions, Modal } from "antd"
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import { useContext, useState } from "react";
import AddressEdit from "./AddressEdit";
import AuthContext from "../../../store/authCtx";
import { updateAddress } from "../../../api/userAPI";
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
const AddressItem=({item, className,removeAddress,setReload})=>{
  const authCtx= useContext(AuthContext)
  
  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    // console.log('Received values of form: ', values);
    updateAddress(authCtx.token, item._id, values).then(res=>{
      setReload(old=>!old)
      setOpen(false);
      success('Cập nhật thành công')
    }).catch(err=>{
      console.log(err);
      error(err.response.data.message)
    })
  };
  // console.log(item)
    return<> 
    <Card 
    className={`${className}`} 
    actions={[
        <EditOutlined key="edit" onClick={()=>{setOpen(true)}}/>,
        <CloseOutlined key="delete" onClick={()=>removeAddress(item._id)} />,
      ]}
      >
      <Descriptions column={2}>
        <Descriptions.Item  span={2} label="Tên người nhận">{item.fullName}</Descriptions.Item>
        <Descriptions.Item span={2} label="SĐT">{item.phoneNo}</Descriptions.Item>
        <Descriptions.Item span={2} label="Địa chỉ" className="text-left">
          {`${item.address}, ${item.ward}, ${item.district}, ${item.city}`}
        </Descriptions.Item>
    </Descriptions>
  </Card>
  <AddressEdit
    open={open}
    onCreate={onCreate}
    onCancel={() => {
      setOpen(false);
    }}
    item={item}
        />
  </>
  }

  export default AddressItem