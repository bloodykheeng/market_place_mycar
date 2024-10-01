import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { Skeleton } from "primereact/skeleton";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";

import { FaEye } from "react-icons/fa";
import { Rating } from "primereact/rating";
import { useNavigate } from "react-router-dom";

export default function GarageList({
  data,
  isLoading = false,
  first,
  rows,
  onPageChange = () => {},
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState(null);
  console.log("data in garage list is : ", data);
  const navigate = useNavigate();
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
  const itemTemplate = (garage, layout) => {
    if (layout === "list") {
      return (
        <div className="col-12" key={garage.id}>
          <div
            className={classNames(
              "flex flex-column xl:flex-row xl:align-items-start p-4 gap-4",
              {
                "border-top-1 surface-border":
                  garage.id !== data?.data?.data[0].id
              }
            )}
          >
            <Image
              src={`${process.env.REACT_APP_API_BASE_URL}${garage.photo_url}`}
              alt={garage.name}
              width="250"
              preview
            />

            <div className="flex flex-1 gap-4 flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start">
              <div className="flex gap-3 flex-column align-items-center sm:align-items-start">
                <div
                  className="text-2xl font-bold cursor-pointer text-900"
                  onClick={() => onGarageSelect(garage)}
                >
                  {garage.name}
                </div>
                <div className="text-lg">{garage.address}</div>
                <div>
                  <Rating
                    value={garage.rating}
                    readOnly
                    stars={5}
                    cancel={false}
                  />
                </div>

                <div className="flex gap-3 align-items-center">
                  <Tag
                    value={garage.availability ? "Available" : "Not Availabe"}
                    severity={getAvailabilityStatus(garage)}
                  />
                  <span className="text-sm">{garage.opening_hours} hrs</span>
                </div>
                <div>
                  <FaEye
                    style={{
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      marginTop: "1rem"
                    }}
                    onClick={() => navigate(`/garage/${garage.slug}`)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const onGarageSelect = (garage) => {
    setSelectedGarage(garage);
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
            No Garages
          </h1>
        </div>
      ) : (
        <DataView
          value={data?.data?.data}
          itemTemplate={itemTemplate}
          layout="list"
          paginator
          // rows={5}
          lazy
          loading={isLoading}
          first={first}
          rows={rows}
          onPage={onPageChange}
          totalRecords={data?.data?.total}
          rowsPerPageOptions={[10, 25, 50, 100]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          paginatorLeft
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          emptyMessage="No Data !"
          // onValueChange={(e) => setFiltered(e)}
        />
      )}

      <Dialog
        header="Garage Details"
        visible={visible}
        modal
        onHide={() => setVisible(false)}
        maximizable
      >
        {selectedGarage && (
          <div className="flex flex-column">
            <Image
              src={`${process.env.REACT_APP_API_BASE_URL}${selectedGarage.photo_url}`}
              alt={selectedGarage.name}
              width="250"
              preview
            />
            <div className="flex align-items-center">
              <strong>Name:&nbsp; </strong> <h4>{selectedGarage.name}</h4>
            </div>
            <div className="flex align-items-center">
              <strong>Address:&nbsp; </strong>
              <p>{selectedGarage.address}</p>
            </div>
            <div className="flex align-items-center">
              <strong>Opening Hours:&nbsp; </strong>
              <p>{selectedGarage.opening_hours}</p>
            </div>
            <div>
              <strong>Details:&nbsp; </strong>
              <p>{selectedGarage.special_features}</p>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
