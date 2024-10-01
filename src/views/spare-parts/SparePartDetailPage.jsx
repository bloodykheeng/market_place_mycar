import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { AiOutlineHeart } from "react-icons/ai";
import { BiShoppingBag } from "react-icons/bi";
import ReactImageGallery from "react-image-gallery";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";

//
import { toast } from "react-toastify";
import { ProgressBar } from "primereact/progressbar";
import { useParams } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSpareParts,
  getSparePartById,
  getSparePartBySlug,
  postSparePart,
  updateSparePart,
  deleteSparePartById
} from "../../services/spare-parts/spare-parts-service";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Carousel } from "primereact/carousel";
import { Image } from "primereact/image";
import { FaTag, FaAlignLeft, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import PrintableQRCode from "./PrintableQRCode";
import { Rating } from "primereact/rating";

//
import { useSparePartsCart } from "../../context/SparePartsCartContext";
import SparePartsRating from "./SparePartsRating";

import Lottie from "lottie-react";
import CarTyreAnimation from "./lottie/car-tyre-lottie";

import useAuthContext from "../../context/AuthContext";

const SparePartDetailPage = () => {
  const { getUserQuery, logout, logoutMutation } = useAuthContext();
  const qrCodeRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => qrCodeRef.current
  });

  const [ratings, setRatings] = useState([
    {
      id: 1,
      stars: 4,
      comment: "Great service!",
      user: { id: 1, name: "John Doe", photo: "http://example.com/john.jpg" }
    },
    {
      id: 2,
      stars: 5,
      comment: "Excellent!",
      user: { id: 2, name: "Jane Smith", photo: "http://example.com/jane.jpg" }
    }
  ]);
  const [productDetailItem, setProductDetailItem] = useState({ images: [] });
  console.log(
    "🚀 ~ SparePartDetailPage ~ productDetailItem:",
    productDetailItem
  );
  const [quantity, setQuantity] = useState(1);
  let { slug } = useParams();

  const { sparePartsCartItems, addToSparePartsCart, removeFromSparePartsCart } =
    useSparePartsCart();

  const handleAddToSparePartCart = (
    productDetailItem,
    selected_quantity = 1
  ) => {
    const itemToAdd = { ...productDetailItem, selected_quantity };
    addToSparePartsCart(itemToAdd);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["spare-part-by-slug", slug],
    queryFn: () => getSparePartBySlug(slug)
  });

  console.log("featured product by id : ", data);
  useEffect(() => {
    if (!isLoading && !isError && data) {
      setProductDetailItem({ ...data.data });
    }
  }, [data]);

  const plusMinuceButton =
    "flex h-8 w-8 cursor-pointer items-center justify-center border duration-100 hover:bg-neutral-100 focus:ring-2 focus:ring-gray-500 active:ring-2 active:ring-gray-500";

  const containerStyle = {
    margin: "auto",
    padding: "20px"
  };

  const headingStyle = {
    paddingTop: "12px",
    fontSize: "24px",
    fontWeight: "bold"
  };

  const ratingTextStyle = {
    marginLeft: "12px",
    fontSize: "small",
    color: "#aaa"
  };

  const availabilityTextStyle = {
    marginTop: "20px",
    fontWeight: "bold",
    color: productDetailItem?.availability ? "green" : "red"
  };

  const textStyleBold = {
    fontWeight: "bold"
  };

  const textStyleNormal = {
    fontWeight: "normal"
  };

  const priceStyle = {
    marginTop: "16px",
    fontSize: "32px",
    fontWeight: "bold",
    color: "#8a2be2"
  };

  const oldPriceStyle = {
    fontSize: "small",
    color: "#aaa",
    textDecoration: "line-through"
  };

  const descriptionStyle = {
    paddingTop: "20px",
    fontSize: "small",
    color: "#aaa",
    lineHeight: "normal"
  };

  const labelStyle = {
    paddingBottom: "8px",
    fontSize: "small",
    color: "#aaa"
  };

  const hoverStyle = {
    backgroundColor: "#8a2be2",
    color: "white"
  };

  const [hoverCart, setHoverCart] = useState(false);
  const [hoverWishlist, setHoverWishlist] = useState(false);

  const buttonStyle = {
    height: "48px",
    width: "33%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8a2be2",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s"
  };

  const hoverCartStyle = {
    ...buttonStyle,
    backgroundColor: hoverCart ? "#0000ff" : "#8a2be2"
  };

  const hoverWishlistStyle = {
    ...buttonStyle,
    backgroundColor: hoverWishlist ? "#ffff00" : "#ffc107"
  };

  //
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [active, setActive] = useState(false);

  const plusMinuceButtonStyle = {
    display: "flex",
    height: "32px",
    width: "32px",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid black",
    transition: "background-color 100ms",
    backgroundColor: hover ? "#f4f4f4" : "transparent", // neutral-100 equivalent
    outline: focus || active ? "2px solid #ccc" : "none" // ring-gray-500 equivalent
  };

  //

  //
  // Initialize state with default styles
  const [sectionStyle, setSectionStyle] = useState({
    display: "flex", // Default to flex
    flexWrap: "wrap",
    margin: "0 auto",
    width: "100%",
    paddingTop: "20px",
    paddingBottom: "20px",
    gridTemplateColumns: "1fr", // Default to single column layout
    gap: "20px" // Adjusted for visual consistency
  });

  const mainContainerStyle = {
    margin: "0 auto",
    paddingLeft: "16px",
    paddingRight: "16px"
  };

  // Loading handling

  if (isLoading) {
    return (
      <Card>
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Skeleton
            width="100%"
            height="100%"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem"
              }}
            >
              <h2>Loading Spare Part Details...</h2>
              <Lottie
                animationData={CarTyreAnimation}
                loop={true}
                style={{ height: "400px" }}
              />
            </div>
          </Skeleton>
        </div>
      </Card>
    );
  }

  // testing

  if (isError) {
    console.log("Error fetching getAllCars:", error);
    toast.error(
      error?.response?.data?.message || "An Error Occurred Please Contact Admin"
    );
    return null;
  }

  // const increment = () => setQuantity(quantity + 1);
  // const decrement = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const increment = () => {
    if (quantity < productDetailItem.quantity) {
      setQuantity(quantity + 1);
    } else {
      toast.info("Maximum available quantity reached");
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      toast.info("Cannot have less than one item");
    }
  };

  //=============== printing ===============

  const appBaseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:3000";
  const productUrl = `${appBaseUrl}/spare/detail/${productDetailItem?.slug}`;

  //================= rating =====================

  const loggedInUserData = getUserQuery?.data?.data;

  const addRating = (newRating) => {
    newRating.id = ratings.length + 1;
    setRatings([...ratings, newRating]);
  };

  const editRating = (updatedRating, id) => {
    setRatings(
      ratings.map((rating) => (rating.id === id ? updatedRating : rating))
    );
  };

  //
  return (
    <Card>
      <section className="productDetailSection">
        {/* image gallery */}
        <div
          style={{
            paddingLeft: "5px",
            paddingRight: "5px"
          }}
        >
          {productDetailItem?.photo_url ? (
            <div className="flex card justify-content-center">
              <Image
                src={`${process.env.REACT_APP_API_BASE_URL}${productDetailItem?.photo_url}`}
                alt="Image"
                width="300"
                preview
              />
            </div>
          ) : (
            <p>No photo available.</p>
          )}

          {/* /image gallery  */}

          {/* QR Code */}
          <div style={{ marginTop: "20px" }}>
            <h3>Product QR Code:</h3>
            <div ref={qrCodeRef}>
              <PrintableQRCode value={productUrl} />
            </div>
            {/* Print Button */}
            <button onClick={handlePrint} style={{ marginTop: "20px" }}>
              Print QR Code
            </button>
          </div>
        </div>
        {/* description  */}

        <div style={containerStyle}>
          <h2 style={headingStyle}>
            {" "}
            <span style={textStyleBold}>Spare Part : </span>
            {productDetailItem?.name}
          </h2>
          <div style={{ marginTop: "4px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Rater component placeholder */}
              <div style={{ fontSize: "20px" }}>
                <Rating
                  value={productDetailItem?.rating}
                  readOnly
                  stars={5}
                  cancel={false}
                />
              </div>
              <p style={ratingTextStyle}>
                ({Math.round(productDetailItem?.rating)})
              </p>
            </div>
          </div>

          {/* <p style={availabilityTextStyle}>
            Availability:{" "}
            <span>
              {productDetailItem?.visibility ? "In Stock " : "Expired"}
            </span>
          </p> */}

          <p style={textStyleBold}>
            Type:{" "}
            <span style={textStyleNormal}>
              {productDetailItem?.spare_part_type?.name}
            </span>
          </p>
          {/* <p style={textStyleBold}>
          SKU: <span style={textStyleNormal}>{productDetailItem?.sku}</span>
        </p> */}
          <p style={textStyleBold}>
            <FaTag style={{ color: "gold", marginRight: "10px" }} />
            <span>Price: </span> UGX{" "}
            {Number(productDetailItem?.price).toLocaleString()}
          </p>

          <p
            style={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center"
            }}
          >
            {productDetailItem?.condition === "new" ? (
              <FaThumbsUp style={{ color: "green", margin: "10px" }} />
            ) : (
              <FaThumbsDown style={{ color: "red", margin: "10px" }} />
            )}
            <span>Condition: </span>

            {productDetailItem?.condition === "new" ? "New" : "Used"}
          </p>

          <p style={textStyleBold}>
            <FaAlignLeft style={{ color: "lightblue", marginRight: "10px" }} />
            <span>Description:</span> {productDetailItem?.description}
          </p>
          {/* <div style={{ marginTop: "24px" }}>
          <p style={labelStyle}>Size</p>
          <div style={{ display: "flex", gap: "4px" }}>
            {productDetailItem?.size?.map((x, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  height: "32px",
                  width: "32px",
                  cursor: "pointer",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ccc"
                }}
              >
                {x}
              </div>
            ))}
          </div>
        </div> */}

          <div style={{ marginTop: "24px" }}>
            <p style={labelStyle}>Quantity</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                label="-"
                className="p-button-rounded p-button-outlined"
                onClick={decrement}
                icon="pi pi-minus"
                style={{ width: "50px" }}
              />
              <div
                style={{
                  margin: "0 10px",
                  minWidth: "32px",
                  textAlign: "center"
                }}
              >
                {quantity}
              </div>
              <Button
                label="+"
                className="p-button-rounded p-button-outlined"
                onClick={increment}
                icon="pi pi-plus"
                style={{ width: "50px" }}
              />
            </div>
          </div>
          <div style={{ marginTop: "28px", display: "flex", gap: "24px" }}>
            <Button
              label="Add to cart"
              icon="pi pi-shopping-cart"
              className="p-button-success p-button-rounded"
              onClick={() => console.log("Add to cart")}
              style={{ width: "140px" }}
            />
            <Button
              label="Buy"
              icon="pi pi-money-bill"
              className="p-button-primary p-button-rounded"
              onClick={() => console.log("Buy Item")}
              style={{ width: "140px" }}
            />
          </div>
        </div>
      </section>
      <section
        style={{
          paddingLeft: "5px",
          paddingRight: "5px",
          height: "100%"
        }}
      >
        <SparePartsRating
          loggedInUserData={loggedInUserData}
          productDetailItem={productDetailItem}
        />
      </section>
    </Card>
  );
};

export default SparePartDetailPage;
