import React, { useContext, useEffect, useState } from "react";
import LayoutComponent from "../../layout/Layout";
import AccountNav from "./AccountNav";
import AuthContext from "../../store/authCtx";
import { deleteAddress, getCurrentUser } from "../../api/userAPI";
import AddressItem from "./AccountView/AddressItem";
import { Modal } from "antd";
import AddressForm from "./AccountView/AddressForm";

const success = (mes) => {
  Modal.success({
    title: "SUCCESS",
    content: mes,
    closable: true,
  });
};
const error = (mes) => {
  Modal.error({
    title: "ERROR",
    content: mes,
    closable: true,
  });
};
const Address = () => {
  const authCtx = useContext(AuthContext);
  const [reload, setReload] = useState(true);
  const { confirm } = Modal;
  // eslint-disable-next-line no-unused-vars
  const [userInfo, setUserInfo] = useState({
    firstName: authCtx.firstName,
    lastName: authCtx.lastName,
    photo: authCtx.photo,
    role: authCtx.role,
    email: authCtx.email,
  });

  const showConfirm = (token, addressId) => {
    confirm({
      title: "XÁC NHẬN",
      content: `Xác nhận xóa địa chỉ?`,
      okText: <span className="text-[#48cae4] hover:text-white">OK</span>,
      onOk() {
        deleteAddress(token, addressId)
          .then((res) => {
            success("Xóa thành công");
            setReload((old) => !old);
          })
          .catch((err) => {
            console.log(err);
            error(err.response.data.message);
          });
      },
      onCancel() {
        return false;
      },
    });
  };
  const removeAddress = (addressId) => {
    showConfirm(authCtx.token, addressId);
  };
  const [addressArr, setAddressArr] = useState([]);
  useEffect(() => {
    getCurrentUser(authCtx.token).then((res) => {
      setAddressArr(res.data.data.addresses);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return (
    <LayoutComponent>
      <main className="flex justify-center space-x-4">
        <AccountNav userInfo={userInfo} />
        <section className="min-w-[900px] flex ">
          <div className="w-1/2  min-h-8 flex flex-col space-y-1">
            {addressArr.length > 0 &&
              addressArr.map((item, index) => (
                <AddressItem
                  removeAddress={removeAddress}
                  className="w-[450px]"
                  key={item._id}
                  item={item}
                  setReload={setReload}
                />
              ))}
          </div>
          <div className="w-1/2">
            <AddressForm setReload={setReload} />
          </div>
        </section>
      </main>
    </LayoutComponent>
  );
};

export default Address;
