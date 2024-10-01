import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { Dialog } from "primereact/dialog";

//
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";
import { getAllCars } from "../../../services/cars/car-service.js";
import { ProgressBar } from "primereact/progressbar";

import { Skeleton } from "primereact/skeleton";
import ProductDetail from "./product-details/ProductDetail";
import ProductMedia from "./product-details/ProductMedia";

//
import { useCarCart } from "../../../context/CarCartContext";

export default function FeaturedProducts() {
  const [layout, setLayout] = useState("grid");

  //
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [displayDialog, setDisplayDialog] = useState(false);

  const [displayProductDialog, setDisplayProductDialog] = useState(false);

  //====================== cart ====================
  const { addToCarCart } = useCarCart();

  const handleAddToCarCart = (productDetailItem, selected_quantity = 1) => {
    const itemToAdd = { ...productDetailItem, selected_quantity };
    addToCarCart(itemToAdd);
  };

  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cars"],
    queryFn: () =>
      getAllCars({ visibility: "featured", inspection_status: "approved" })
  });

  // Loading handling
  if (isLoading) {
    return (
      <div style={{ width: "100%", height: "400px", overflow: "hidden" }}>
        <Skeleton width="100%" height="100%">
          <Skeleton
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,

              padding: "20px",
              borderRadius: "5px",

              textAlign: "left",
              transition: "all 0.3s ease"
            }}
          >
            <Skeleton style={{ margin: "0 0 10px 0", fontSize: "2rem" }}>
              <div style={{ margin: "20px", width: "100%" }}>
                <ProgressBar
                  mode="indeterminate"
                  style={{ height: "6px" }}
                ></ProgressBar>
              </div>
            </Skeleton>
            <Skeleton>
              {" "}
              <ProgressBar
                mode="indeterminate"
                style={{ height: "6px" }}
              ></ProgressBar>
            </Skeleton>
          </Skeleton>
        </Skeleton>
      </div>
    ); // Show skeleton when loading
  }

  if (isError) {
    console.log("Error fetching getAllCars:", error);
    toast.error(
      error?.response?.data?.message || "An Error Occurred Please Contact Admin"
    );
    return null;
  }

  console.log("featured products : ", data);

  const handleProductNameClick = (productDetail) => {
    navigate("/car/detail/" + productDetail?.slug);
  };

  const getSeverity = (product) => {
    switch (product?.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  //
  const handleWhatsAppClick = (product) => {
    // Assuming the seller's WhatsApp number is stored in the product data
    // const sellerWhatsApp = product?.seller?.whatsapp;
    const sellerWhatsApp = "+256774542872";

    if (sellerWhatsApp) {
      // Constructing message with product name and photo
      const message = `Hi, I'm interested in this car : ${product.name}. Here is the product photo: ${process.env.REACT_APP_API_BASE_URL}${product.photos[0].photo_url}`;

      // Constructing product URL with slug as query parameter
      const productURL = `${process.env.REACT_APP_BASE_URL}/car/detail/${product.slug}`;

      // Adding product URL to the message
      const messageWithUrl = `${message} Car URL: ${productURL}`;

      // Encoding message
      const encodedMessage = encodeURIComponent(messageWithUrl);

      // Constructing WhatsApp URL
      const whatsappURL = `https://wa.me/${sellerWhatsApp}?text=${encodedMessage}`;

      // Opening WhatsApp in a new tab/window
      window.open(whatsappURL, "_blank");
    } else {
      // Handle if seller's WhatsApp number is not available
      toast.warning("Seller WhatsApp number not available.");
    }
  };

  const listItem = (product, index) => {
    // Check if product data is available

    return (
      <div className="col-12" key={product.id}>
        <div
          className={classNames(
            "flex flex-column xl:flex-row xl:align-items-start p-4 gap-4",
            { "border-top-1 surface-border": index !== 0 }
          )}
        >
          <img
            className="block mx-auto w-9 sm:w-16rem xl:w-10rem shadow-2 xl:block border-round"
            src={`${product?.photos && process.env.REACT_APP_API_BASE_URL}${
              product?.photos[0]?.photo_url
            }`}
            alt={product?.name}
            onClick={() => {
              // handleProductNameClick();
              setSelectedProduct(product);
              setDisplayDialog(true);
            }}
            style={{ width: "100%", cursor: "pointer" }}
          />
          <div className="flex flex-1 gap-4 flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start">
            <div className="flex gap-3 flex-column align-items-center sm:align-items-start">
              <div
                className="text-2xl font-bold text-900"
                onClick={() => {
                  handleProductNameClick(product);
                  // setSelectedProduct(product);
                  // setDisplayProductDialog(true);
                }}
                style={{
                  cursor: "pointer"
                }}
              >
                {product?.name}
              </div>
              <Rating value={product?.rating} readOnly cancel={false}></Rating>
              <div className="flex gap-3 align-items-center">
                <span className="flex gap-2 align-items-center">
                  <i className="pi pi-tag"></i>
                  <span className="font-semibold">{product?.category}</span>
                </span>
                <Tag
                  value={product?.inventoryStatus}
                  severity={getSeverity(product)}
                ></Tag>
              </div>
            </div>
            <div className="flex gap-3 sm:flex-column align-items-center sm:align-items-end sm:gap-2">
              <span className="text-2xl font-semibold">
                UGX {Number(product?.price ?? 0).toLocaleString()}
              </span>
              {/* <Button
                icon="pi pi-shopping-cart"
                className="p-button-rounded"
                disabled={product?.inventoryStatus === "OUTOFSTOCK"}
                onClick={() => handleAddToCarCart(product)}
              ></Button> */}
              <Button
                severity="success"
                icon="pi pi-whatsapp"
                className="p-button-rounded"
                onClick={() => handleWhatsAppClick(product)}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const gridItem = (product) => {
    // Check if product data is available

    return (
      <div className="p-2 col-12 sm:col-6 lg:col-12 xl:col-4" key={product.id}>
        <div className="p-4 border-1 surface-border surface-card border-round">
          <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="flex gap-2 align-items-center">
              <i className="pi pi-tag"></i>
              <span className="font-semibold">{product?.category}</span>
            </div>
            <Tag
              value={product.inventoryStatus}
              severity={getSeverity(product)}
            ></Tag>
          </div>
          <div className="flex gap-3 py-5 flex-column align-items-center">
            <center>
              <div
                className="shadow-2 border-round"
                style={{
                  width: "300px",
                  height: "300px",
                  background: `url("${
                    product?.photos && process.env.REACT_APP_API_BASE_URL
                  }${product?.photos[0]?.photo_url}")`,
                  backgroundSize: "cover",
                  cursor: "pointer"
                }}
                onClick={() => {
                  setSelectedProduct(product);
                  setDisplayDialog(true);
                }}
              ></div>
            </center>

            {/* <img
              className="w-9 shadow-2 border-round"
              src={`${product?.photos && process.env.REACT_APP_API_BASE_URL}${
                product?.photos[0]?.photo_url
              }`}
              alt={product?.name}
              onClick={() => {
                setSelectedProduct(product);
                setDisplayDialog(true);
              }}
              style={{ width: "100%", cursor: "pointer" }}
            /> */}
            <div
              className="text-2xl font-bold"
              onClick={() => {
                handleProductNameClick(product);
                // setSelectedProduct(product);
                // setDisplayProductDialog(true);
              }}
              style={{
                cursor: "pointer"
              }}
            >
              {product?.name}
            </div>
            <Rating value={product?.rating} readOnly cancel={false}></Rating>
          </div>
          <div className="flex align-items-center justify-content-between">
            <span className="text-2xl font-semibold">
              UGX {Number(product?.price ?? 0).toLocaleString()}
            </span>
            {/* <Button
              icon="pi pi-shopping-cart"
              className="p-button-rounded"
              disabled={product?.inventoryStatus === "OUTOFSTOCK"}
              onClick={() => handleAddToCarCart(product)}
            ></Button> */}

            <Button
              severity="success"
              icon="pi pi-whatsapp"
              className="p-button-rounded"
              onClick={() => handleWhatsAppClick(product)}
            ></Button>
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (product, layout, index) => {
    if (!product) {
      return;
    }

    if (layout === "list") return listItem(product, index);
    else if (layout === "grid") return gridItem(product);
  };

  const listTemplate = (products, layout) => {
    return (
      <div className="grid grid-nogutter">
        {products.map((product, index) => itemTemplate(product, layout, index))}
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="grid grid-nogutter surface-0 text-800">
        <div className="p-3 col-6">
          <span className="block text-4xl font-bold text-900">
            Featured Cars
          </span>
        </div>
        <div className="flex p-3 col-6 justify-content-end align-items-center">
          <DataViewLayoutOptions
            layout={layout}
            onChange={(e) => setLayout(e.value)}
          />
        </div>
      </div>
    );
  };

  const imageDialogFooter = (
    <Button
      label="Close"
      icon="pi pi-times"
      onClick={() => setDisplayDialog(false)}
      className="p-button-text"
    />
  );

  return (
    <div className="card">
      <DataView
        value={data?.data ?? []}
        listTemplate={listTemplate}
        layout={layout}
        header={renderHeader()}
      />
      {!isLoading && Array.isArray(data?.data) && data?.data.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            width: "100%",
            flexDirection: "column",
            textAlign: "center"
          }}
        >
          <h1 style={{ fontFamily: "Platypi, sans-serif", fontSize: "2rem" }}>
            No Featured Cars Yet
          </h1>
        </div>
      )}

      {selectedProduct && displayProductDialog && (
        <Dialog
          header="Product Details"
          visible={displayProductDialog}
          onHide={() => setDisplayProductDialog(false)}
          maximizable={true}
          modal
          showHeader={true}
        >
          <ProductDetail selectedProduct={selectedProduct} />
        </Dialog>
      )}

      {selectedProduct && displayDialog && (
        <Dialog
          header="Product Media"
          visible={displayDialog}
          onHide={() => setDisplayDialog(false)}
          maximizable={true}
          modal
          showHeader={true}
        >
          <ProductMedia selectedProduct={selectedProduct} />
        </Dialog>
      )}
    </div>
  );
}
