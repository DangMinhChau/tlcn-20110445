import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import LayoutComponent from '../../layout/Layout';
import {  Input, Pagination, Popover, Slider, Spin } from 'antd';
import ProductItem from './ProductItem';
import { getAllProductsByName } from '../../api/productAPI';
import { pageSize } from '../../configs/constants';
const { Search } = Input;
const formatter = (value) => value.toLocaleString('vi', {style : 'currency', currency : 'VND'});
const ProductSearch = () => {
    const [products, setProducts] = useState([])
    const navigate= useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const productName=searchParams.get("name")
    const [loading, setLoading] = useState(true)
    const [totalItems, setTotalItems] = useState(0);
    const [current, setCurrent] = useState(1);
    const [sortBy, setSortBy] = useState('createAt')
    const [rangePrice, setRangePrice] = useState([0,2000000])

useEffect(() => {
    setLoading(true)
    if(!productName){
        setProducts([]);
        setLoading(false)
        return;
    }
    getAllProductsByName(productName.trim(),pageSize,current,sortBy,rangePrice).then(res=>{
        setProducts(res.data.data)
        // setTotalItems(res.totalPage*pageSize)
        // nếu res.result<pageSize thì (res.totalPage-1)*repageSize+res.result
        setTotalItems((res.totalPage-1)*pageSize+res.result)
        setLoading(false)

    }).catch(err=>{
        console.log(err.response.data.message)
        setLoading(false)

    })
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [productName,current,sortBy,rangePrice[0],rangePrice[1]])

const onAfterChange = (value) => {
    setRangePrice(value)
  };
const content = (
    <div>
        <p className='hover:cursor-pointer hover:text-[#48cae4]' onClick={()=>setSortBy('price')}>Giá tăng dần</p>
        <p className='hover:cursor-pointer hover:text-[#48cae4]' onClick={()=>setSortBy('-price')}>Giá giảm dần</p>
        <p className='hover:cursor-pointer hover:text-[#48cae4]' onClick={()=>setSortBy('createAt')}>Cũ nhất</p>
        <p className='hover:cursor-pointer hover:text-[#48cae4]' onClick={()=>setSortBy('-createAt')}>Mới nhất</p>
    </div>
  );
  return (
    <LayoutComponent>

        <h2 className='text-[32px] font-bold my-3 uppercase'>Tìm kiếm </h2>
        <div className='h-10  mx-[74px] flex justify-between'>
            <div className='flex'>
                <div className='min-w-[400px]'>
                    <p className='font-bold'>Giá từ: {rangePrice[0].toLocaleString('vi', {style : 'currency', currency : 'VND'})} - {rangePrice[1].toLocaleString('vi', {style : 'currency', currency : 'VND'})}</p>
                    <Slider range defaultValue={[0, 2000000]} max={2000000} step={25000} tooltip={{ formatter }} onAfterChange={onAfterChange} />
                </div>

            </div>
            <div >
            <Popover content={content} title="" trigger="hover" placement="bottomRight">
                <div className='px-3 py-2 border flex w-[170px] justify-between hover:cursor-pointer'>
                <p>Sắp xếp theo</p>
                </div>
                
            </Popover>
            </div>
        </div>
        {loading?<Spin size='large'/>:<>
           {products.length===0&&(<div className=' flex flex-col space-y-10 text-[24px] leading-10'>
            <div>
                <p>Rất tiếc, chúng tôi không tìm thấy kết quả cho từ khóa của bạn</p>
                <p>Vui lòng kiểm tra chính tả, sử dụng các từ tổng quát hơn và thử lại!</p>
            </div>
            <div className='w-1/3 mx-auto'>
                <Search placeholder="Tìm kiếm " loading={false} enterButton size='large' className='w-[350px]' onSearch={(value)=>{
                    if(!value) return;
                    navigate(`/search?name=${value}`)
                }}/>
            </div>
            
            </div>)}
            {productName&&<p className='text-[24px]'>Có <span className='font-bold'>{products.length!==0?totalItems:0}</span>  sản phẩm</p>}
            <div className='flex flex-wrap justify-center max-w-[100%] gap-4 gap-y-10 mt-10'>
                {products.length!==0&&products.map(product=>(<ProductItem product={product} key={product._id}/>)) }
            </div>
            {products.length!==0&&<Pagination
                defaultCurrent={current}
                total={totalItems}
                pageSize={pageSize}
                defaultPageSize={pageSize}
                onChange={(page, pageSize) => {
                setCurrent(page);
                }}
            />}</>}

    </LayoutComponent>
  )
}

export default ProductSearch