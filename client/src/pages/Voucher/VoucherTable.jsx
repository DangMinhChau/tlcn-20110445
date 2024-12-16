import { Button, Modal, Space, Table } from 'antd'
import React,{ useState,useEffect } from 'react'
import { useContext } from 'react'
import AuthContext from '../../store/authCtx'
import {ExclamationCircleFilled } from '@ant-design/icons';
import { deleteVoucher, getAllVoucherAdmin } from '../../api/discountAPI'
const { confirm } = Modal;
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
const VoucherTable = (props) => {
    const authCtx= useContext(AuthContext)
    const [vouchers, setVouchers] = useState([])
    const [reload, setReload] = useState(false)
    useEffect(() => {
        getAllVoucherAdmin(authCtx.token).then(res=>{
            setVouchers(res.data.data)
        }).catch(err=>{
            console.log(err)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload,props.reload])

    const showDeleteConfirm = (voucher) => {
        return confirm({
          title: `Bạn chắn chắn vô hiệu hóa ${voucher.name}?`,
          icon: <ExclamationCircleFilled />,
          okText: 'Vô hiệu hóa',
          okType: 'danger',
          cancelText: 'Hủy',
          onOk() {
        deleteVoucher(authCtx.token,voucher._id).then(res=>{
        // console.log(res)
        setReload(old=>!old)
        success("Đã xóa thành công")
       }).catch(err=>{
        console.log(err)
        error(err.response.data.message)
       })
    
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      };

      const columns=[
        {
            title: 'Tên mã',
            dataIndex: 'name',
            key: 'name'
        }, 
        {
            title: 'Giảm',
            dataIndex: 'discount',
            key: 'discount',
            sorter: (a, b) =>a.discount-b.discount,
            render:(_,record)=>(<p>-{record.discount.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</p>),
        }, 
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            sorter: (a, b) =>(new Date(a.startDate))-(new Date(b.startDate)),
            render:(_,record)=>(<p>{(new Date(record.startDate)).toLocaleDateString("en-US")}</p>),
        }, 
        {
            title: 'Ngày kết thúc',
            dataIndex: 'expireDate',
            key: 'expireDate',  
            sorter: (a, b) =>(new Date(a.expireDate))-(new Date(b.expireDate)),
            render:(_,record)=>(<p className={`${(new Date(Date.now()))>(new Date(record.expireDate))?'text-[#ff006e]':'text-[#48cae4]'}`}>{(new Date(record.expireDate)).toLocaleDateString("en-US")}</p>),
    
        },
          {
            title: "Vô hiệu hóa",
            key: "disable",
            render: (_, record) => (
              <Space size="middle">
                <Button
              danger
              onClick={() => {
               return showDeleteConfirm(record)
              }}
              className='text-[#48cae4] border border-[#48cae4]'
            >
             Vô hiệu hóa
            </Button>
              </Space>
            ),
          },
    ]
  return (
    <div>
        <h2 className='text-[24px] font-bold my-4'>Danh sách voucher</h2>
        <Table columns={columns} dataSource={vouchers}/>
    </div>
  )
}


export default VoucherTable