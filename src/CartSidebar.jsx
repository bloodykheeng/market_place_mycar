import React from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { useCarCart } from "./context/CarCartContext"; // Import your custom hook instead
import { useSparePartsCart } from "./context/SparePartsCartContext";
import useAuthContext from "./context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Image } from "primereact/image";
import { ProgressSpinner } from "primereact/progressspinner";

const CartSidebar = ({ visible, onHide }) => {
  // Use the custom hook to access cart items and functions
  const {
    carCartItems,
    addToCarCart,
    removeFromCarCart,
    isPostToSyncCarCartMutationLoading
  } = useCarCart();
  const { getUserQuery } = useAuthContext();
  const navigate = useNavigate();

  const handleIncrement = (item) => {
    addToCarCart({ ...item, selected_quantity: 1 });
  };

  const handleDecrement = (item) => {
    if (item.selected_quantity > 1) {
      addToCarCart({ ...item, selected_quantity: -1 });
    } else {
      removeFromCarCart(item.id);
    }
  };

  const {
    sparePartsCartItems,
    addToSparePartsCart,
    removeFromSparePartsCart,
    isPostToSyncSpareCartLoading
  } = useSparePartsCart();

  const handleSparePartIncrement = (item) => {
    addToSparePartsCart({ ...item, selected_quantity: 1 });
  };

  const handleSpareDecrement = (item) => {
    if (item.selected_quantity > 1) {
      addToSparePartsCart({ ...item, selected_quantity: -1 });
    } else {
      removeFromSparePartsCart(item.id);
    }
  };

  const handleCheckout = () => {
    // if (!getUserQuery?.data?.data) {
    //   toast.info("Please log in to proceed to checkout");
    //   onHide(); // Close the sidebar
    //   navigate("/login");
    // } else {
    //   onHide();
    //   navigate("/checkout");
    //   // toast.info("payments will be added in soon...");
    //   // Here you can navigate to the payment process or handle it accordingly
    // }

    onHide();
    navigate("/checkout");
  };

  const hasItemsInCart =
    carCartItems.length > 0 || sparePartsCartItems.length > 0;

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={onHide}
      style={{ minWidth: "30vw" }}
    >
      {(isPostToSyncCarCartMutationLoading || isPostToSyncSpareCartLoading) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%"
          }}
        >
          <ProgressSpinner />
        </div>
      )}
      <h3 style={{ color: "#FFB701" }}>Shopping Cart</h3>
      {hasItemsInCart ? (
        <>
          {carCartItems.length > 0 && (
            <ul>
              {carCartItems.map((item) => (
                <li key={item.id}>
                  <div>
                    {" "}
                    <Image
                      src={
                        item?.photos &&
                        Array.isArray(item?.photos) &&
                        item?.photos.length > 0
                          ? `${process.env.REACT_APP_API_BASE_URL}${item?.photos[0].photo_url}`
                          : ""
                      }
                      alt="Image"
                      width="80"
                      height="60"
                      preview
                    />
                  </div>
                  {item.name} - UGX {Number(item.price).toLocaleString()} x{" "}
                  {item.selected_quantity}
                  <div>
                    <Button
                      icon="pi pi-minus"
                      onClick={() => handleDecrement(item)}
                      className="m-2 p-button-rounded p-button-outlined p-button-sm"
                    />
                    <Button
                      icon="pi pi-plus"
                      onClick={() => handleIncrement(item)}
                      className="m-2 p-button-rounded p-button-outlined p-button-sm"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {sparePartsCartItems.length > 0 && (
            <ul>
              {sparePartsCartItems.map((item) => (
                <li key={item.id}>
                  <div>
                    <Image
                      src={`${process.env.REACT_APP_API_BASE_URL}${item?.photo_url}`}
                      alt="Image"
                      width="80"
                      height="60"
                      preview
                    />
                  </div>
                  {item.name} - UGX {Number(item.price).toLocaleString()} x{" "}
                  {item.selected_quantity}
                  <div>
                    <Button
                      icon="pi pi-minus"
                      onClick={() => handleSpareDecrement(item)}
                      className="m-2 p-button-rounded p-button-outlined p-button-sm"
                    />
                    <Button
                      icon="pi pi-plus"
                      onClick={() => handleSparePartIncrement(item)}
                      className="m-2 p-button-rounded p-button-outlined p-button-sm"
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}

          <center>
            <Button
              label="Proceed To Checkout"
              icon="pi pi-check"
              className="p-mt-2"
              onClick={handleCheckout}
            />
          </center>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </Sidebar>
  );
};

export default CartSidebar;
