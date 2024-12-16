import { Avatar, Card, Col, Rate, Row, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { getProductById } from '../../api/productAPI'
const columns=[
    {
        title: 'Ảnh đại diện',
        dataIndex: 'name',
        key: 'name',
        render:(_,record)=>(<Avatar size={40} src={record.user.photo} alt="avatar"/>)
    }, 
    {
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
        render:(_,record)=>(<span>{`${record.user.firstName} ${record.user.lastName}`}</span>)
    }, 
    {
        title: 'Ngày bình luận',
        dataIndex: 'createAt',
        key: 'createAt',
        render:(_,record)=>(<span>{(new Date(record.createdAt)).toLocaleString('en-GB')}</span>)
    },  
    {
        title: 'Mức đánh giá',
        dataIndex: 'rating',
        key: 'rating',
        render:(_,record)=>(<Rate disabled defaultValue={record.rating} />)
    },  
    {
        title: 'Đánh giá',
        dataIndex: 'comment',
        key: 'comment',
        render:(_,record)=>(<p className='max-w-[450px]'>{record.comment}</p>)
    }, 
]
const ProductReviews = ({productId}) => {
    const [reviews, setReviews] = useState([])
    // console.log(reviews)
    useEffect(() => {
      if(productId!==''){
        getProductById(productId).then(res=>{
            setReviews(res.data.data.reviews||[])
        }).catch(err=>console.log(err))
      }
    }, [productId])
    let oneStar=0;
    let twoStar=0;
    let threeStar=0;
    let fourStar=0;
    let fiveStar=0;
    reviews.length>0&&reviews.forEach(review=>{
        switch(review.rating){
            case 1:
                oneStar++;
                break;
            case 2:
                twoStar++;
                break;
            case 3:
                threeStar++;
                break;
            case 4:
                fourStar++;
                break;
            case 5:
                fiveStar++;
                break;               
            default: break;
        }
    })
  return (
    <div>
    <Row gutter={10}>
      <Col span={8}>
        <div className='flex flex-col items-end justify-start  gap-1 ml-7 mb-7'>
          <Card style={{ width: 300 }}>
            <h3 className='text-[24px]'><span>{reviews.length>0?Math.round((oneStar*1+twoStar*2+threeStar*3+fourStar*4+fiveStar*5)/(oneStar+twoStar+threeStar+fourStar+fiveStar)*10)/10:0}</span>/5</h3>
            <div>
              <Rate disabled defaultValue={1} />
              <span className='inline-block ml-4 text-[18px]'>({oneStar})</span>
            </div>
            <div>
              <Rate disabled defaultValue={2} />
              <span className='inline-block ml-4 text-[18px]'>({twoStar})</span>
            </div> 
            <div>
              <Rate disabled defaultValue={3} />
              <span className='inline-block ml-4 text-[18px]'>({threeStar})</span>
            </div>
            <div>
              <Rate disabled defaultValue={4} />
              <span className='inline-block ml-4 text-[18px]'>({fourStar})</span>
            </div>
            <div>
              <Rate disabled defaultValue={5} />
              <span className='inline-block ml-4 text-[18px]'>({fiveStar})</span>
            </div>      
          </Card>
        </div>
      </Col>
      <Col span={15}>
        <h4 className='text-[16px] font-bold'>Đánh giá</h4>
        <Table pagination={5} columns={columns} dataSource={reviews}/>
      </Col>
    </Row>
    </div>
  )
}

export default ProductReviews