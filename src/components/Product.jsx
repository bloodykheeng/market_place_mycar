import React from "react";
import { Carousel } from "primereact/carousel";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";

const BestDealsCarousel = () => {
  const deals = [
    {
      name: "Lenovo Tab P10",
      price: 2099,
      oldPrice: 3490,
      rating: 4,
      sold: 321,
      image: "/assets/sample-cars/AutoWallpaper_300083.jpg" // Example image for Lenovo Tab
    },
    {
      name: "Samsung S21 Ultra",
      price: 5000,
      oldPrice: 6500,
      rating: 5,
      sold: 213,
      image: "/assets/sample-cars/AutoWallpaper_300084.jpg" // Example image for Samsung S21 Ultra
    },
    // Add more deals here
    {
      name: "Product Name 3",
      price: 1500,
      oldPrice: 2000,
      rating: 4,
      sold: 150,
      image: "/assets/sample-cars/AutoWallpaper_300089.JPG"
    },
    {
      name: "Product Name 4",
      price: 2500,
      oldPrice: 3000,
      rating: 5,
      sold: 190,
      image: "/assets/sample-cars/AutoWallpaper_300095.jpg"
    }
    // ... and so on for the rest of your images
  ];
  const responsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: "600px",
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: "480px",
      numVisible: 1,
      numScroll: 1
    }
  ];

  const productTemplate = (deal) => {
    return (
      <div
        style={{
          maxWidth: "300px",
          margin: "1rem",
          background: "white",
          borderRadius: "0.5rem",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid transparent",
          transition:
            "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out"
        }}
        onMouseOver={(e) => (e.currentTarget.style.borderColor = "#76C8C8")}
        onMouseOut={(e) => (e.currentTarget.style.borderColor = "transparent")}
      >
        <img
          src={deal.image}
          alt={deal.name}
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: "1 / 1",
            objectFit: "cover",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem"
          }}
        />
        <div style={{ padding: "1rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "semibold" }}>
            {deal.name}
          </h3>
          <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>
            {deal.description}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem"
            }}
          >
            <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              ${deal.price}
            </span>
            <Button
              label="Add to Cart"
              icon="pi pi-shopping-cart"
              className="p-button p-button-rounded p-button-outlined"
            />
          </div>
          <Rating value={deal.rating} readOnly cancel={false} />
          <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            {deal.sold} sold
          </p>
        </div>
      </div>
    );
  };

  return (
    <Carousel
      value={deals}
      numVisible={3}
      numScroll={1}
      responsiveOptions={responsiveOptions}
      itemTemplate={productTemplate}
      header={<h2>Best Deals</h2>}
      style={{ marginTop: "2em" }}
    />
  );
};

export default BestDealsCarousel;
