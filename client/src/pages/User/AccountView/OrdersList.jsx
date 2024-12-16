import React, { useContext, useEffect, useState } from 'react'
import LayoutComponent from '../../../layout/Layout'
import AuthContext from '../../../store/authCtx'
import AccountNav from '../AccountNav'
import { getAllOrders } from '../../../api/orderAPI'
import { Descriptions,  Table, Tag } from 'antd'
import { Link } from 'react-router-dom'

const OrdersList = () => {
    const authCtx= useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([{
        _id:'',
        address:{fullName:'',city:''},
        orderItems:[{price:0, product:{discount:0}, quantity:0}],
        orderStatus:''
    }])
    // eslint-disable-next-line no-unused-vars
    const [userInfo, setUserInfo] = useState({
        firstName: authCtx.firstName,
        lastName: authCtx.lastName,
        photo: authCtx.photo,
        role: authCtx.role,
        email:authCtx.email
        })
// console.log(orders)
    useEffect(() => {
        getAllOrders(authCtx.token).then(res=>{
            // console.log(res.data.data)
            setLoading(false)
            setOrders(res.data.data)
        }).catch(err=>{
            console.log(err.response.data.message)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const dataSource =[];
    orders.sort((a,b)=>a.createdAt>b.createdAt?-1:0).forEach((item, index)=>{
        const total=item.orderItems?(item.orderItems.reduce((total, item)=>total+item.price*item.quantity,0) +item.shippingPrice-(item.voucher?item.voucher.discount:0)):0
        dataSource.push({
            _id: item._id,
            key: index,
            name:item.address.fullName,
            buyDate:(new Date(item.createdAt)).toLocaleString('en-GB', { timeZone: 'UTC' }),
    
            total: total.toLocaleString('vi', {style : 'currency', currency : 'VND'}),
            status: item.orderStatus
        })
    })
// console.log(dataSource)
    const columns=[
        {
            title: 'Mã đơn hàng',
            dataIndex: '_id',
            key: '_id',
          },
          {
            title: 'Ngày mua',
            dataIndex: 'buyDate',
            key: 'buyDate',
          },
          {
            title: 'Người nhận',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            filters:[
             {
               text:'Chờ xác nhận',
               value:'new',
             },
             {
               text:'Đang xử lý',
               value:'processing',
             },
             {
               text:'Hoàn tất',
               value:'done',
             },
             {
               text:'Đã hủy',
               value:'fail',
             }
            ],
            onFilter: (value, record) => record.status===value,
            render: (_, record) => {
                let text="";
                let tagColor='blue';
                if(record.status==='new'){ text="Chờ xác nhận";
                }else if(record.status==='processing'){ text="Đang xử lý";
                }else if(record.status==='done'){
                    tagColor="green";
                    text="Hoàn tất"
                }else{
                    tagColor="red";
                    text="Đã hủy"                    
                }

                return (<Tag color={tagColor}>{text}</Tag>)
             }
          },
          {
            // title: 'Xem chi tiết',
            key: '_id',
            render: (_, record) => (
                  <Link to={`/order/${record._id}`} className='text-[#073b4c] font-medium'>Xem chi tiết</Link>
              ),
          },
    ]
  return (
    <LayoutComponent>
      <main className='flex justify-center space-x-4'>
      <AccountNav userInfo={userInfo}/>
      <section className='min-w-[900px] '>
      <div className='mb-6'>
      <Descriptions title="Đơn hàng của tôi" column={4} bordered>
        <Descriptions.Item label="Tổng đơn hàng" contentStyle={{fontSize:"16px",fontWeight:"500"}} labelStyle={{fontWeight:"bold"}} span={4}>{dataSource.length}</Descriptions.Item>
        <Descriptions.Item label="Chờ xác nhận" labelStyle={{fontWeight:"bold"}}>{dataSource.reduce((total, item)=> item.status==="new"?++total:total,0)}</Descriptions.Item>
        <Descriptions.Item label="Đang xử lý" labelStyle={{fontWeight:"bold"}}>{dataSource.reduce((total, item)=> item.status==="processing"?++total:total,0)}</Descriptions.Item>
        <Descriptions.Item label="Hoàn tất" labelStyle={{fontWeight:"bold"}}>{dataSource.reduce((total, item)=> item.status==="done"?++total:total,0)}</Descriptions.Item>
        <Descriptions.Item label="Đã hủy" labelStyle={{fontWeight:"bold"}}>{dataSource.reduce((total, item)=> item.status==="fail"?++total:total,0)}</Descriptions.Item>
      </Descriptions>
        </div>
        <div className=''>
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 10}} loading={loading}/>
        </div>
      </section>
      </main>
    </LayoutComponent>
  )
}

export default OrdersList