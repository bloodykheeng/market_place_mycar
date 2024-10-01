import React, { useState, useEffect } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiShoppingBag } from "react-icons/bi";
import ReactImageGallery from "react-image-gallery";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";

const ProductDetail = () => {
  const productDetailItem = {
    images: [
      {
        original:
          "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600",
        thumbnail:
          "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      {
        original:
          "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=600",
        thumbnail:
          "https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      {
        original:
          "https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=600",
        thumbnail:
          "https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      {
        original:
          "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        thumbnail:
          "https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        original:
          "https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=600",
        thumbnail:
          "https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=600"
      }
    ],
    title: "BIG ITALIAN SOFA",
    reviews: "150",
    availability: true,
    brand: "apex",
    category: "Sofa",
    sku: "BE45VGTRK",
    price: 450,
    previousPrice: 599,
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem exercitationem voluptate sint eius ea assumenda provident eos repellendus qui neque! Velit ratione illo maiores voluptates commodi eaque illum, laudantium non!",
    size: ["XS", "S", "M", "L", "XL"],
    color: ["gray", "violet", "red"]
  };
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
    color: productDetailItem.availability ? "green" : "red"
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

  return (
    <section
      style={{
        flexGrow: 1,
        margin: "0 auto",
        maxWidth: "1200px",
        borderBottom: "1px solid #ddd",
        paddingTop: "20px",
        paddingBottom: "20px",
        display: "flex",
        flexDirection: "column",
        "@media (min-width: 768px)": {
          // Media query for large screens
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          paddingTop: "40px",
          paddingBottom: "40px"
        }
      }}
    >
      {/* image gallery */}
      <div
        style={{
          paddingLeft: "20px",
          paddingRight: "20px"
        }}
      >
        <ReactImageGallery
          showBullets={false}
          showFullscreenButton={false}
          showPlayButton={false}
          items={productDetailItem.images}
        />

        {/* /image gallery  */}
      </div>
      {/* description  */}

      <div style={containerStyle}>
        <h2 style={headingStyle}>{productDetailItem.title}</h2>
        <div style={{ marginTop: "4px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Rater component placeholder */}
            <div style={{ fontSize: "20px" }}>★★★★☆</div>
            <p style={ratingTextStyle}>({productDetailItem.reviews})</p>
          </div>
        </div>
        <p style={availabilityTextStyle}>
          Availability:{" "}
          <span>
            {productDetailItem.availability ? "In Stock " : "Expired"}
          </span>
        </p>
        <p style={textStyleBold}>
          Brand: <span style={textStyleNormal}>{productDetailItem.brand}</span>
        </p>
        <p style={textStyleBold}>
          Category:{" "}
          <span style={textStyleNormal}>{productDetailItem.category}</span>
        </p>
        <p style={textStyleBold}>
          SKU: <span style={textStyleNormal}>{productDetailItem.sku}</span>
        </p>
        <p style={priceStyle}>
          ${productDetailItem.price}{" "}
          <span style={oldPriceStyle}>${productDetailItem.previousPrice}</span>
        </p>
        <p style={descriptionStyle}>{productDetailItem.description}</p>
        <div style={{ marginTop: "24px" }}>
          <p style={labelStyle}>Size</p>
          <div style={{ display: "flex", gap: "4px" }}>
            {productDetailItem.size.map((x, index) => (
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
        </div>
        <div style={{ marginTop: "24px" }}>
          <p style={labelStyle}>Color</p>
          <div style={{ display: "flex", gap: "4px" }}>
            {productDetailItem.color.map((x, index) => (
              <div
                key={index}
                style={{
                  height: "32px",
                  width: "32px",
                  cursor: "pointer",
                  border: "1px solid #fff",
                  backgroundColor: x
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ marginTop: "24px" }}>
          <p style={labelStyle}>Quantity</p>
          <div style={{ display: "flex" }}>
            <button
              style={plusMinuceButtonStyle}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              onMouseDown={() => setActive(true)}
              onMouseUp={() => setActive(false)}
            >
              −
            </button>
            <div
              style={{
                display: "flex",
                height: "32px",
                width: "32px",
                alignItems: "center",
                justifyContent: "center",
                borderTop: "1px solid #ccc",
                borderBottom: "1px solid #ccc"
              }}
            >
              1
            </div>
            <button style={buttonStyle}>+</button>
          </div>
        </div>
        <div style={{ marginTop: "28px", display: "flex", gap: "24px" }}>
          <button
            style={hoverCartStyle}
            onMouseEnter={() => setHoverCart(true)}
            onMouseLeave={() => setHoverCart(false)}
          >
            <BiShoppingBag style={{ marginRight: "8px" }} />
            Add to cart
          </button>
          <button
            style={hoverWishlistStyle}
            onMouseEnter={() => setHoverWishlist(true)}
            onMouseLeave={() => setHoverWishlist(false)}
          >
            <AiOutlineHeart style={{ marginRight: "8px" }} />
            Wishlist
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
