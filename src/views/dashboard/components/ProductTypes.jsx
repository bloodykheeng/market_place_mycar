import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";

//
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";
import { getAllCarTypes } from "../../../services/cars/car-types-service";
import { Card } from "primereact/card";

import { Skeleton } from "primereact/skeleton";

const ProductSlide = ({ productType, handleClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const slideStyle = {
    width: "100%",
    height: "100%",
    background: `url("${process.env.REACT_APP_API_BASE_URL}${productType.photo_url}")`,
    backgroundSize: "cover",
    cursor: "pointer",
    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
    position: "relative",
    borderRadius: "0 0 8px 8px"
  };

  const textStyle = {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    color: isHovered ? "tomato" : "white",
    padding: "0.5rem",
    fontSize: "18px",
    borderRadius: "0 0 8px 8px",
    zIndex: 2
  };

  return (
    <div
      style={slideStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleClick(productType)}
    >
      <div style={textStyle}>{productType.name}</div>
    </div>
  );
};

//================== main component ================
export default function ProductTypes() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product-types"],
    queryFn: getAllCarTypes
  });

  if (isError) {
    console.log("Error fetching getAllCarTypes:", error);
    toast.error(
      error?.response?.data?.message || "An Error Occurred Please Contact Admin"
    );
    return null;
  }

  const handleClick = (productType) => {
    // Use URLSearchParams to construct the query string
    const queryParams = new URLSearchParams({
      car_type: productType.slug // dynamically pass the productType slug
    });

    // Navigate using react-router-dom's navigate function
    navigate(`/car/listings?${queryParams.toString()}`, {
      state: { productType: productType.name }
    });
  };

  console.log("product types : ", data);

  if (isLoading) {
    return (
      <div style={{ width: "100%", height: "300px", overflow: "hidden" }}>
        <Skeleton width="100%" height="100%"></Skeleton>
      </div>
    ); // Show skeleton when loading
  }

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          // backgroundColor: "#FCFAED",
          padding: "1rem"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
          }}
        >
          <h1 style={{ fontFamily: "Platypi, sans-serif", fontSize: "2rem" }}>
            Explore Our <span style={{ color: "#FF5733" }}>Car Types</span>{" "}
            Collection
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            width: "100%"
          }}
        >
          {isLoading ? (
            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
          ) : (
            <Swiper
              // slidesPerView={4}
              // spaceBetween={20}
              slidesPerView={"auto"}
              centeredSlides={true}
              modules={[Navigation, Pagination, Autoplay]}
              // navigation

              className="mySwiper"
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              // loop={true}
              // style={{
              //   width: "100%",
              //   height: "170px",
              //   display: "flex",
              //   alignItems: "center",
              //   justifyContent: "center",
              //   padding: "1rem"
              // }}
              style={{
                width: "100%",
                paddingTop: "50px",
                paddingBottom: "50px"
              }}
              spaceBetween={30}
              pagination={{
                clickable: true
              }}
              // breakpoints={{
              //   0: { slidesPerView: 1 },
              //   480: { slidesPerView: 3, spaceBetween: 30 },
              //   768: { slidesPerView: 4, spaceBetween: 30 },
              //   1024: { slidesPerView: 4, spaceBetween: 30 }
              // }}
            >
              {data?.data.map((productType, index) => (
                <SwiperSlide
                  style={{
                    width: "300px",
                    height: "300px",
                    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
                    borderRadius: "0 0 8px 8px",
                    padding: "0px",
                    margin: "0px"
                  }}
                >
                  <ProductSlide
                    key={index}
                    productType={productType}
                    handleClick={handleClick}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </Card>
  );
}
