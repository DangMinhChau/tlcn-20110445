import React, { useContext } from 'react'
import { Avatar } from 'antd'
import { InfoCircleOutlined,UnorderedListOutlined,HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../../store/authCtx';
const AccountNav = (props) => {
    const authCtx=useContext( AuthContext);
    const navigate= useNavigate()
    const {firstName, lastName, photo}=props.userInfo
const logout=()=>{
  authCtx.logout();
    navigate('/')
}


  return (
    <nav className='flex flex-col bg-slate-100 p-5 text-left space-y-3'>
        <div className='text-center'>
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            src={photo}
          />
        </div>
        <div >
            Xin chào {<span className='font-bold'>{`${firstName} ${lastName}`}</span>}</div>
        <div className='flex items-center space-x-2'>
          <InfoCircleOutlined />
          <Link to={'/account'}>Thông tin tài khoản</Link>
        </div>
        <div className='flex items-center space-x-2'>
          <UnorderedListOutlined />
          <Link to={'/account/orders'}>Quản lý đơn hàng</Link>
        </div>
        <div className='flex items-center space-x-2'>
          <HomeOutlined />
          <Link to={'/account/address'}>Danh sách địa chỉ</Link>
        </div>
        <div onClick={logout} className='hover:cursor-pointer hover:text-[#48cae4] text-[#073b4c] font-medium'>Đăng xuất</div>
    </nav>
  )
}

export default AccountNav