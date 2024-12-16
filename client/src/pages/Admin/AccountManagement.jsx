import React, { useEffect, useContext, useState } from "react";
import { getAllUser, lockUser, unlockUser } from "../../api/userAPI";
import AuthContext from "../../store/authCtx";
import { Avatar, Switch, Table, Tag } from "antd";

const { Column} = Table;

const AccountManagement = () => {
  const authCtx = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(true);
  useEffect(() => {
    getAllUser(authCtx.token)
      .then((res) => {
        // console.log(res.data.data)
        setUsers(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const onChange = async (_, record) => {
    if (record.isLocked) {
      unlockUser(authCtx.token, record._id)
        .then((res) => {
          setReload(() => (old) => !old);
        })
        .catch((err) => console.log(err.response.data.message));
    } else {
      lockUser(authCtx.token, record._id)
        .then((res) => {
          setReload(() => (old) => !old);
        })
        .catch((err) => console.log(err.response.data.message));
    }
  };

  return (
    <div className=" w-full">
      <Table
        dataSource={users}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
      >
        <Column
          title="Hình đại diện"
          dataIndex="photo"
          key="photo"
          render={(photo) => <Avatar src={photo} />}
        />
        <Column title="Tên" dataIndex="firstName" key="firstName" />
        <Column title="Họ" dataIndex="lastName" key="lastName" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Vai trò" dataIndex="role" key="role" />
        <Column
          title="Trạng thái"
          dataIndex="isLocked"
          key="isLocked"
          render={(isLocked) =>
            isLocked === false ? (
              <Tag color="success">Hoạt động</Tag>
            ) : (
              <Tag color="error">Đã Khóa</Tag>
            )
          }
          filters={[
            {
              text: "Hoạt động",
              value: false,
            },
            {
              text: "Đã Khóa",
              value: true,
            },
          ]}
          onFilter={(value, record) => record.isLocked === value}
          filtered={true}
        />
        <Column
          title="Khóa"
          dataIndex="isLocked"
          key="isLocked"
          render={(isLocked, record, index) => (
            <Switch
              defaultChecked={!isLocked}
              onChange={() => onChange(isLocked, record)}
              disabled={record.role === "admin"}
            />
          )}
        />
      </Table>
    </div>
  );
};

export default AccountManagement;
