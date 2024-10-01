/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useCarCart } from "../../context/CarCartContext"; // Import your custom hook instead
import { useSparePartsCart } from "../../context/SparePartsCartContext";
import useAuthContext from "../../context/AuthContext";
import { Image } from "primereact/image";
import { useNavigate } from "react-router-dom";
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";
import moment from "moment";

import {
  getAllSparePartTranctions,
  getSparePartTranctionById,
  postSparePartTranction,
  updateSparePartTranction,
  deleteSparePartTranctionById
} from "../../services/spare-parts/spare-parts-transactions-service";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";

import { ConfirmDialog } from "primereact/confirmdialog";
import { useFlutterwave } from "flutterwave-react-v3";

const CheckOutList = () => {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [visible, setVisible] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [transactionIsLoading, setTransactionIsLoading] = useState(false);
  const [pendingData, setPendingData] = useState();

  const { carCartItems, addToCarCart, removeFromCarCart } = useCarCart();
  const { getUserQuery } = useAuthContext();

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
    clearSparePartsCart
  } = useSparePartsCart();

  console.log("🚀 ~ CheckOutList ~ sparePartsCartItems:", sparePartsCartItems);

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

  const hasItemsInCart =
    carCartItems.length > 0 || sparePartsCartItems.length > 0;

  useEffect(() => {
    if (!hasItemsInCart) {
      navigate("/");
      toast.warning(
        "You cant checkout with an empty cart first make some shopping"
      );
    }
  }, [hasItemsInCart]);

  const onSubmit = (values) => {
    setPendingData(values);
    // Show the confirmation dialog
    setVisible(true);
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.name) {
      errors.name = "Name is required";
    }
    if (!values.phone) {
      errors.phone = "Phone number is required";
    }
    return errors;
  };

  // Define constants for VAT and delivery fees
  const VAT_PERCENTAGE = 19;
  const DELIVERY_FEE = 4.95;

  // Function to calculate the total price
  const calculateTotal = useCallback(() => {
    // Calculate the subtotal for car cart items
    const carCartTotal = carCartItems.reduce(
      (acc, item) => acc + item.price * item.selected_quantity,
      0
    );

    // Calculate the subtotal for spare parts cart items
    const sparePartsTotal = sparePartsCartItems.reduce(
      (acc, item) => acc + item.price * item.selected_quantity,
      0
    );

    // Calculate subtotal
    const subtotal = carCartTotal + sparePartsTotal;

    // Calculate VAT
    const vat = (subtotal * VAT_PERCENTAGE) / 100;

    // Calculate grand total
    const total = subtotal + vat + DELIVERY_FEE;

    return { subtotal, vat, total };
  }, [carCartItems, sparePartsCartItems]); // Dependencies for useCallback

  // Memoize the result using useMemo so it recalculates only when dependencies change
  const { subtotal, vat, total } = useMemo(calculateTotal, [calculateTotal]);

  useEffect(() => {
    console.log("logged in user on checkout is : ", getUserQuery?.data?.data);
    let userData = {
      email: getUserQuery?.data?.data?.email,
      name: getUserQuery?.data?.data?.name,
      amount: total
    };
    setUserDetails(userData);
  }, [getUserQuery?.data?.data]);

  useEffect(() => {
    // Update the userDetails object with the new amount whenever total changes
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      amount: total
    }));
  }, [total]);

  console.log("userDetails initial data is : ", userDetails);

  const getItemNames = (carItems, spareItems) => {
    // Map over car items and spare parts items to get their names
    const carItemNames = carItems.map((item) => item.name).join(", ");
    const spareItemNames = spareItems.map((item) => item.name).join(", ");

    // Combine names from both arrays with appropriate formatting
    return [carItemNames, spareItemNames].filter((name) => name).join(", ");
  };

  const itemNames = getItemNames(carCartItems, sparePartsCartItems);

  let key = process.env.REACT_APP_FLUTTER_WAVE_PUBLIC_KEY;

  console.log("pendingData data is : ", pendingData);

  const config = {
    public_key: key,
    tx_ref: Date.now(),
    amount: total,
    currency: "UGX",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: pendingData?.email,
      phonenumber: pendingData?.phone,
      name: pendingData?.name
    },
    customizations: {
      title: "MYCAR",
      description: `Payment for items in cart: ${itemNames}`,
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg"
    }
  };

  const handleFlutterPayment = useFlutterwave(config);

  const onConfirm = () => {
    setVisible(false);
    setTransactionIsLoading(true);

    // Handle actual form submission logic here

    handleFlutterPayment({
      callback: (response) => {
        console.log(response);
        setTransactionIsLoading(false);

        if (getUserQuery?.data?.data) {
          // if logged in
          handleSubmit(response);
        } else {
          clearSparePartsCart();
          navigate("/");
        }
      },
      onClose: () => {
        setTransactionIsLoading(false);
        toast.success("Thanks For Shopping with Us");
      }
    });
  };

  // ========================== handle submiting to database  ==========================
  const [createMutationIsLoading, setCreateMutationIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const creactMutation = useMutation({
    mutationFn: postSparePartTranction,
    onSuccess: (data) => {
      setCreateMutationIsLoading(false);
      clearSparePartsCart();
      toast.success("created Tx Successfully");
    },
    onError: (error) => {
      setCreateMutationIsLoading(false);

      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
      console.log("create users error : ", error);
    }
  });

  const handleSubmit = async (data) => {
    setCreateMutationIsLoading(true);
    // event.preventDefault();

    let finalData = {
      user_id: getUserQuery?.data?.data?.id,
      status: data?.status,
      customer_name: data?.customer?.name,
      customer_email: data?.customer?.email,
      customer_phone_number: data?.customer?.phone_number,
      transaction_id: data?.transaction_id,
      tx_ref: data?.tx_ref,
      flw_ref: data?.flw_ref,
      currency: data?.currency,
      amount: data?.amount,
      charged_amount: data?.charged_amount,
      charge_response_code: data?.charge_response_code,
      charge_response_message: data?.charge_response_message,
      gateway_created_at: data?.gateway_created_at
        ? moment(data?.gateway_created_at).format("YYYY-MM-DD HH:mm:ss")
        : null,
      products: sparePartsCartItems?.map((product) => ({
        name: product?.name,
        price: product?.price,
        spare_parts_id: product?.spare_part_id,
        quantity: product?.selected_quantity
      }))
    };
    console.log("data we are submitting while checking out : ", finalData);

    // setCreateMutationIsLoading(false);

    creactMutation.mutate(finalData);
  };

  // ==========================end  handle submiting to database  ==========================
  return (
    <Card style={{ minHeight: "100vh" }}>
      <div css={responsiveGridStyle}>
        <div className="p-1" css={columnStyle}>
          <Card className="p-1" title="Order Summary">
            {hasItemsInCart ? (
              <>
                {carCartItems.length > 0 && (
                  <ul
                    style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}
                  >
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
                        {item.name} - UGX {Number(item.price).toLocaleString()}{" "}
                        x {item.selected_quantity}
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
                  <ul
                    style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}
                  >
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
                        {item.name} - UGX {Number(item.price).toLocaleString()}{" "}
                        x {item.selected_quantity}
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
              </>
            ) : (
              <p>Your cart is empty.</p>
            )}
            <div className="order-totals">
              <h5>VAT (19%): UGX {vat.toLocaleString()}</h5>
              <h5>Delivery: UGX {DELIVERY_FEE.toLocaleString()}</h5>
              <h4>TOTAL: UGX {total.toLocaleString()}</h4>
            </div>
          </Card>
        </div>
        <div className="p-1" css={columnStyle}>
          <Card className="p-1" title="Payment Details">
            <div className="p-fluid">
              <Form
                onSubmit={onSubmit}
                validate={validate}
                initialValues={userDetails}
                keepDirtyOnReinitialize={true}
                // If true, only pristine values will be overwritten when initialize(newValues) is called.
                // This can be useful for allowing a user to continue to edit a record while the record is
                // being saved asynchronously, and the form is reinitialized to the saved values when the
                // save is successful. Defaults to false.

                // initialValuesEqual={() => true}
                // initialValuesEqual with a function returning true prevents the form from
                // reinitializing when the initialValues prop changes. This is useful when you
                // want to avoid re-rendering or reinitializing the form due to changes in initial values.
                // Be cautious using this if your initial values are meant to be dynamic and responsive
                // to changes in your application's state.
                render={({
                  handleSubmit,
                  form,
                  submitting,
                  pristine,
                  values
                }) => (
                  <form onSubmit={handleSubmit} className="p-fluid">
                    <Field name="email">
                      {({ input, meta }) => (
                        <div className="p-field m-4">
                          <label htmlFor="email">Email</label>
                          <InputText
                            {...input}
                            id="email"
                            type="email"
                            className={classNames({
                              "p-invalid": meta.touched && meta.error
                            })}
                          />
                          {meta.error && meta.touched && (
                            <small className="p-error">{meta.error}</small>
                          )}
                        </div>
                      )}
                    </Field>
                    <Field name="name">
                      {({ input, meta }) => (
                        <div className="p-field m-4">
                          <label htmlFor="name">Name</label>
                          <InputText
                            {...input}
                            id="name"
                            className={classNames({
                              "p-invalid": meta.touched && meta.error
                            })}
                          />
                          {meta.error && meta.touched && (
                            <small className="p-error">{meta.error}</small>
                          )}
                        </div>
                      )}
                    </Field>
                    <Field name="phone">
                      {({ input, meta }) => (
                        <div className="p-field m-4">
                          <label htmlFor="phone">Phone</label>
                          <InputText
                            {...input}
                            id="phone"
                            className={classNames({
                              "p-invalid": meta.touched && meta.error
                            })}
                          />
                          {meta.error && meta.touched && (
                            <small className="p-error">{meta.error}</small>
                          )}
                        </div>
                      )}
                    </Field>
                    <Field name="amount">
                      {({ input, meta }) => (
                        <div className="p-field m-4">
                          <label htmlFor="amount">Amount</label>
                          <InputText
                            {...input}
                            id="amount"
                            keyfilter="pint"
                            // When you set the keyfilter to "pint", you are instructing the component to
                            // allow only positive integers
                            className={classNames({
                              "p-invalid": meta.touched && meta.error
                            })}
                            disabled={true}
                          />
                          {meta.error && meta.touched && (
                            <small className="p-error">{meta.error}</small>
                          )}
                        </div>
                      )}
                    </Field>
                    <div className="p-field m-4">
                      <Button
                        severity="warning"
                        icon={
                          transactionIsLoading || createMutationIsLoading
                            ? "pi pi-spin pi-spinner"
                            : "pi pi-credit-card"
                        }
                        label="Make Payment"
                        type="submit"
                        disabled={
                          transactionIsLoading || createMutationIsLoading
                        }
                        className={
                          transactionIsLoading || createMutationIsLoading
                            ? "p-button-warning"
                            : ""
                        }
                      />
                    </div>
                  </form>
                )}
              />
              <ConfirmDialog
                visible={visible}
                onHide={() => setVisible(false)}
                message="Are you sure you want to make this payment ?"
                header="Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={onConfirm}
                reject={() => setVisible(false)}
              />
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
};

//
const responsiveGridStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;

  @media (min-width: 768px) {
    flex-direction: row;
    & > div {
      flex-grow: 1;
    }
  }
`;

const columnStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: 100%;
  @media (max-width: 767px) {
    flex-grow: 0;
  }
`;

export default CheckOutList;
