import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { Skeleton } from "primereact/skeleton";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";

export default function MotorThirdPartyList({
  data,
  isLoading = false,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  console.log("data in garage list is : ", data);
  // Loading handling
  // Loading handling
  if (isLoading) {
    return (
      <div className="card" style={{ width: "100%" }}>
        <div className="p-4 border-round border-1 surface-border">
          <ul className="p-0 m-0 list-none">
            <li className="mb-3">
              <div className="flex">
                <Skeleton
                  shape="circle"
                  size="4rem"
                  className="mr-2"
                ></Skeleton>
                <div style={{ flex: "1" }}>
                  <Skeleton width="100%" className="mb-2"></Skeleton>
                  <Skeleton width="75%"></Skeleton>
                </div>
              </div>
            </li>
            <li className="mb-3">
              <div className="flex">
                <Skeleton
                  shape="circle"
                  size="4rem"
                  className="mr-2"
                ></Skeleton>
                <div style={{ flex: "1" }}>
                  <Skeleton width="100%" className="mb-2"></Skeleton>
                  <Skeleton width="75%"></Skeleton>
                </div>
              </div>
            </li>
            <li className="mb-3">
              <div className="flex">
                <Skeleton
                  shape="circle"
                  size="4rem"
                  className="mr-2"
                ></Skeleton>
                <div style={{ flex: "1" }}>
                  <Skeleton width="100%" className="mb-2"></Skeleton>
                  <Skeleton width="75%"></Skeleton>
                </div>
              </div>
            </li>
            <li>
              <div className="flex">
                <Skeleton
                  shape="circle"
                  size="4rem"
                  className="mr-2"
                ></Skeleton>
                <div style={{ flex: "1" }}>
                  <Skeleton width="100%" className="mb-2"></Skeleton>
                  <Skeleton width="75%"></Skeleton>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    ); // Show skeleton when loading
  }

  const getAvailabilityStatus = (garage) => {
    switch (garage.availability) {
      case "Available":
        return "success";
      case "Few Spots":
        return "warning";
      case "Full":
        return "danger";
      default:
        return null;
    }
  };

  // Item template for each garage
  const itemTemplate = (product, layout) => {
    if (layout === "list") {
      return (
        <div className="col-12" key={product.id}>
          <div
            className={classNames(
              "flex flex-column xl:flex-row xl:align-items-start p-4 gap-4",
              { "border-top-1 surface-border": product.id !== data?.data[0].id }
            )}
          >
            <Image
              src={`${process.env.REACT_APP_API_BASE_URL}${product.logo_url}`}
              alt={product.name}
              width="250"
              preview
            />

            <div className="flex flex-1 gap-4 flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start">
              <div className="flex gap-3 flex-column align-items-center sm:align-items-start">
                <div
                  className="text-2xl font-bold cursor-pointer text-900"
                  onClick={() => onProductSelect(product)}
                >
                  {product.name}
                </div>

                <div>{product.description}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const onProductSelect = (garage) => {
    setSelectedProduct(garage);
    setVisible(true);
  };

  return (
    <div className="card" style={{ width: "100%" }}>
      {!isLoading && Array.isArray(data?.data) && data?.data.length === 0 ? (
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
            No Motors (3rd Party)'z
          </h1>
        </div>
      ) : (
        <DataView
          value={data?.data}
          itemTemplate={itemTemplate}
          layout="list"
          paginator
          rows={5}
        />
      )}

      <Dialog
        header="Garage Details"
        visible={visible}
        modal
        onHide={() => setVisible(false)}
        maximizable
      >
        {selectedProduct && (
          <div className="flex flex-column">
            <Image
              src={`${process.env.REACT_APP_API_BASE_URL}${selectedProduct.logo_url}`}
              alt={selectedProduct.name}
              width="250"
              preview
            />
            <div className="flex align-items-center">
              <strong>Name:&nbsp; </strong> <h4>{selectedProduct.name}</h4>
            </div>

            <div>
              <strong>Details:&nbsp; </strong>
              <p>{selectedProduct.description}</p>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
