import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { Skeleton } from "primereact/skeleton";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CarInspectorsList({
  data,
  isLoading = false,
  first,
  rows,
  onPageChange = () => {},
  ...props
}) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [selectedInspector, setSelectedInspector] = useState(null);
  console.log("data in inspectors list is : ", data);
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

  const getAvailabilityStatus = (item) => {
    switch (item.status) {
      case "active":
        return "success";
      case "deactive":
        return "danger";
      default:
        return null;
    }
  };

  // Item template for each garage
  const itemTemplate = (item, layout) => {
    if (layout === "list") {
      return (
        <div className="col-12" key={item.id}>
          <div
            className={classNames(
              "flex flex-column xl:flex-row xl:align-items-start p-4 gap-4",
              {
                "border-top-1 surface-border":
                  item.id !== data?.data?.data[0].id
              }
            )}
          >
            {item.photo_url ? (
              <Image
                src={`${process.env.REACT_APP_API_BASE_URL}${item.photo_url}`}
                alt={item.name}
                width="250"
                preview
              />
            ) : (
              <Avatar
                icon="pi pi-user"
                size="xlarge"
                style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
              />
            )}

            <div className="flex flex-1 gap-4 flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start">
              <div className="flex gap-3 flex-column align-items-center sm:align-items-start">
                <div
                  className="text-2xl font-bold cursor-pointer text-900"
                  onClick={() => onItemSelect(item)}
                >
                  {item.name}
                </div>
                <div className="text-lg">{item.email}</div>
                <div className="flex gap-3 align-items-center">
                  <Tag
                    value={item.status}
                    severity={getAvailabilityStatus(item)}
                  />
                </div>
                <div>
                  <FaEye
                    style={{
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      marginTop: "1rem"
                    }}
                    onClick={() => navigate(`/inspectors/${item.slug}`)}
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

  const onItemSelect = (item) => {
    setSelectedInspector(item);
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
            No Car Inspectors
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
        header="Inspector Details"
        visible={visible}
        modal
        onHide={() => setVisible(false)}
        maximizable
      >
        {selectedInspector && (
          <div className="flex flex-column">
            {selectedInspector.photo_url ? (
              <Image
                src={`${process.env.REACT_APP_API_BASE_URL}${selectedInspector.photo_url}`}
                alt={selectedInspector.name}
                width="250"
                preview
              />
            ) : (
              <Avatar
                icon="pi pi-user"
                size="xlarge"
                style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
              />
            )}

            <div className="flex align-items-center">
              <strong>Name:&nbsp; </strong> <h4>{selectedInspector.name}</h4>
            </div>
            <div className="flex align-items-center">
              <strong>Email:&nbsp; </strong>
              <p>{selectedInspector.email}</p>
            </div>
            <div className="flex align-items-center">
              <strong>Status:&nbsp; </strong>
              <Tag
                value={selectedInspector?.status}
                severity={getAvailabilityStatus(selectedInspector)}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
