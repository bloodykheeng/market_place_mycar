/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { Dialog } from "primereact/dialog";

import { css } from "@emotion/react";

//
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";
import { ProgressBar } from "primereact/progressbar";

import { Skeleton } from "primereact/skeleton";
import SparePartDetailPage from "./SparePartDetailPage";
import SparePartMedia from "./SparePartMedia";
import { FaWrench } from "react-icons/fa";

//
import { useSparePartsCart } from "../../context/SparePartsCartContext";

export default function SparePartsList({ data, isLoading }) {
  const [layout, setLayout] = useState("grid");
  const { sparePartsCartItems, addToSparePartsCart, removeFromSparePartsCart } =
    useSparePartsCart();

  const handleAddToSparePartCart = (
    productDetailItem,
    selected_quantity = 1
  ) => {
    const itemToAdd = { ...productDetailItem, selected_quantity };
    addToSparePartsCart(itemToAdd);
  };

  //
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [displayDialog, setDisplayDialog] = useState(false);

  const [displayProductDialog, setDisplayProductDialog] = useState(false);

  const navigate = useNavigate();

  console.log("featured products : ", data);

  const handleProductNameClick = (productDetail) => {
    navigate("/spare/detail/" + productDetail?.slug);
  };

  // Loading handling
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "400px",
          overflow: "hidden",
          paddingTop: "2rem"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          <Skeleton width="100%" style={{ marginBottom: "1rem" }}>
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
          <div className="flex mt-3 justify-content-between">
            <Skeleton width="4rem" height="2rem"></Skeleton>
            <Skeleton width="4rem" height="2rem"></Skeleton>
          </div>
          <div style={{ width: "100%", marginBottom: "1rem" }}></div>
          <Skeleton width="100%" height="300px"></Skeleton>
        </div>
      </div>
    ); // Show skeleton when loading
  }

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
            src={`${product && process.env.REACT_APP_API_BASE_URL}${
              product?.photo_url
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
              <Button
                icon="pi pi-shopping-cart"
                className="p-button-rounded"
                onClick={() => handleAddToSparePartCart(product)}
                disabled={product?.inventoryStatus === "OUTOFSTOCK"}
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
                // style={{
                //   width: "200px",
                //   height: "200px",
                //   background: `url("${
                //     product && process.env.REACT_APP_API_BASE_URL
                //   }${product?.photo_url}")`,
                //   backgroundSize: "cover",
                //   cursor: "pointer"
                // }}

                css={css`
                  width: 200px;
                  height: 200px;
                  background: url(${product &&
                  process.env.REACT_APP_API_BASE_URL}${product?.photo_url});
                  background-size: cover;
                  cursor: pointer;
                  @media (max-width: 767px) {
                    width: 300px;
                    height: 300px;
                  }
                `}
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

            <Button
              icon="pi pi-shopping-cart"
              className="p-button-rounded"
              onClick={() => handleAddToSparePartCart(product)}
              disabled={product?.inventoryStatus === "OUTOFSTOCK"}
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
            <FaWrench size={20} style={{ color: "#4DFF07" }} />
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
    <div style={{ width: "100%", height: "100%" }}>
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
            No Spare Parts Yet
          </h1>
        </div>
      )}

      {selectedProduct && displayProductDialog && (
        <Dialog
          header="Spare Part Details"
          visible={displayProductDialog}
          onHide={() => setDisplayProductDialog(false)}
          maximizable={true}
          modal
          showHeader={true}
        >
          <SparePartDetailPage selectedProduct={selectedProduct} />
        </Dialog>
      )}

      {selectedProduct && displayDialog && (
        <Dialog
          header="Spare Part Media"
          visible={displayDialog}
          onHide={() => setDisplayDialog(false)}
          maximizable={true}
          modal
          showHeader={true}
        >
          <SparePartMedia selectedProduct={selectedProduct} />
        </Dialog>
      )}
    </div>
  );
}
