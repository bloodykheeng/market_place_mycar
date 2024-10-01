import React from "react";
import { Card } from "primereact/card";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// import required modules
import { EffectCoverflow, Pagination } from "swiper/modules";
// import required modules
import { Navigation, Autoplay } from "swiper/modules";

const ServiceOfferings = () => {
  const services = [
    {
      name: "Free Delivery",
      icon: "pi pi-send",
      color: "orange",
      description: "Nationwide delivery at no extra cost.",
      bgColor: "rgba(255, 243, 224, 0.1)" // Converted from #FFF3E0
    },
    {
      name: "Affordable Prices",
      icon: "pi pi-tag",
      color: "green",
      description: "Competitive factory direct pricing.",
      bgColor: "rgba(232, 245, 233, 0.1)" // Converted from #E8F5E9
    },
    {
      name: "Secure Payments",
      icon: "pi pi-lock",
      color: "blue",
      description: "Safe transaction with 100% protection.",
      bgColor: "rgba(227, 242, 253, 0.1)" // Converted from #E3F2FD
    },
    {
      name: "Wide Selection",
      icon: "pi pi-car",
      color: "purple",
      description: "A variety of cars to choose from.",
      bgColor: "rgba(243, 229, 245, 0.1)" // Converted from #F3E5F5
    },
    {
      name: "Quality Assurance",
      icon: "pi pi-check-square",
      color: "red",
      description: "Inspected cars that meet high standards.",
      bgColor: "rgba(255, 235, 238, 0.1)" // Converted from #FFEBEE
    },
    {
      name: "After-Sales Support",
      icon: "pi pi-users",
      color: "teal",
      description: "Dedicated support for your post-purchase needs.",
      bgColor: "rgba(224, 242, 241, 0.1)" // Converted from #E0F2F1
    }
  ];

  const serviceCard = (service) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        margin: "0.5rem",
        padding: "0.5rem", // Reduced padding
        // width: "200px", // Fixed width for all cards
        // height: "200px", // Reduced fixed height for consistency
        width: "100%",
        height: "100%",
        // backgroundColor: "rgba(255, 255, 255, 0.3)",
        backgroundColor: service.bgColor,
        backdropFilter: "blur(7.5px)",
        webkitBackdropFilter: "blur(7.5px)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.18)",
        borderRadius: "10px",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        zIndex: 4
      }}
      className="p-shadow-4" // Use PrimeReact shadow utilities
    >
      <i
        className={service.icon}
        style={{
          fontSize: "1.5rem",
          color: service.color,
          marginBottom: "0.5rem"
        }} // Reduced icon size
      ></i>
      <h4 style={{ margin: "0.5em 0" }}>{service.name}</h4>
      <p
        style={{
          //  color: "rgba(0,0,0,0.6)",
          fontSize: "0.85em"
        }}
      >
        {service.description}
      </p>
    </div>
  );

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%"
          // backgroundColor: "#FCFAED"
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
            Our <span style={{ color: "#FE1A1A" }}>Core</span> Values
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            width: "100%"
            // backgroundColor: "#FCFAED"
          }}
        >
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false
            }}
            pagination={true}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            pagination={{ clickable: true }}
            className="mySwiper"
            style={{
              width: "100%",
              paddingTop: "50px",
              paddingBottom: "50px"
            }}
          >
            {services.map((service) => (
              <SwiperSlide
                style={{
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  width: "300px",
                  height: "300px"
                }}
              >
                {serviceCard(service)}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </Card>
  );
};

export default ServiceOfferings;
