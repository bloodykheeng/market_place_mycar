/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { toast } from "react-toastify";

import { css } from "@emotion/react";
import CarList from "./CarList";

import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllCars } from "../../services/cars/car-service.js";
import { getAllCarTypes } from "../../services/cars/car-types-service";

//
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { useSearchParams } from "react-router-dom";
import { Slider } from "primereact/slider";

const CarListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const [visible, setVisible] = useState(false);
  const [selectedCarType, setSelectedCarType] = useState(params?.car_type);
  const [carCondition, setCarCondition] = useState(params?.condition);
  const [carStatus, setCarStatus] = useState(params?.car_status);
  const [transmission, setTransmission] = useState(params?.transmission);
  const [maxPrice, setMaxPrice] = useState(
    parseInt(params?.maxPrice, 10) || null
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  // Sync changes in state back to URL search parameters
  useEffect(() => {
    const newParams = { ...params };
    if (selectedCarType) newParams.car_type = selectedCarType;
    if (carCondition) newParams.condition = carCondition;
    if (carStatus) newParams.car_status = carStatus; // Add car status parameter
    if (transmission) newParams.transmission = transmission; // Add transmission parameter
    if (maxPrice !== null) {
      newParams.maxPrice = maxPrice;
    } else {
      delete newParams.maxPrice; // Remove the parameter if maxPrice is null
    }

    setSearchParams(newParams);
  }, [
    selectedCarType,
    carCondition,
    maxPrice,
    setSearchParams,
    carStatus,
    transmission
  ]);

  // Handle the click on the search button
  const handleSearchClick = () => {
    // This will trigger the useEffect above due to searchQuery changing
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      search: searchQuery
    });
  };

  console.log("The params we are to search with : ", params);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cars", params],
    queryFn: () => getAllCars({ ...params, inspection_status: "approved" })
  });

  useEffect(() => {
    if (isError) {
      console.log("Error fetching getAllCars:", error);
      toast.error(
        error?.response?.data?.message ||
          "An Error Occurred Please Contact Admin"
      );
      return null;
    }
  }, [isError]);

  let sideBarCss = css`
    position: fixed;
    display: none; /* Default to not displayed */
    width: 300px;
    height: calc(100vh - 9rem);
    z-index: 999;
    overflow-y: auto;
    user-select: none;
    top: 6rem;
    left: 2rem;
    transition: transform 0.2s, left 0.2s;
    border-radius: 10px;
    padding: 1.5rem;
    ${"" /* background-color: rgba(255, 255, 255, 0.1); */}
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);
    ${
      "" /* box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.18);  */
    }

    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);

    @media (min-width: 992px) {
      display: block; /* Only display the block on wider screens */
    }
  `;

  let mainContainerCss = css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    ${"" /* justify-content: space-between; */}
    padding: 1rem;
    transition: margin-left 0.2s;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05),
      0px 1px 4px rgba(0, 0, 0, 0.08);
    ${"" /* glasmophism */}
    ${"" /* background-color: rgba(255, 255, 255, 0.1); */}
          backdrop-filter: blur(2px);
    webkit-backdrop-filter: blur(2px);
    ${"" /* border-radius: 10px; */}
    ${
      "" /* border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18); */
    }
    @media (min-width: 992px) {
      margin-left: 350px;
    }
  `;

  let subMainContainerCss = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center; /* Center-align items */
    gap: 1rem; /* Add gap between elements for better spacing */
    justify-content: space-between;

    border-radius: 10px;
    z-index: 4;
    justify-content: flex-end;
    align-items: flex-end;

    @media (max-width: 992px) {
      justify-content: flex-end;
      align-items: center;
    }
    ${
      "" /* box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05),
      0px 1px 4px rgba(0, 0, 0, 0.08); */
    }

    ${
      "" /* background-color: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(7.5px);
            -webkit-backdrop-filter: blur(7.5px);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18);
            border: 1px solid rgba(255, 255, 255, 0.18);
             */
    }

    ${
      "" /* &:hover {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.02),
        0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);
    } */
    }
  `;
  let carListingsCss = css`
    display: flex;
    flex-wrap: wrap;s
    align-items: center; /* Center-align items */
    gap: 0.2rem; /* Add gap between elements for better spacing */
    ${"" /* justify-content: space-between; */}
    border-radius: 10px;
    z-index: 4;
    ${
      "" /* box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05),
      0px 1px 4px rgba(0, 0, 0, 0.08);
    &:hover {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.02),
        0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);
    } */
    }
  `;

  const getAllCarTypesQuery = useQuery({
    queryKey: ["product-types"],
    queryFn: getAllCarTypes
  });

  const carTypeOptions = getAllCarTypesQuery?.data?.data?.map((type) => ({
    label: type?.name,
    value: type?.slug
  }));

  const carStatusOptions = [
    { label: "Sale", value: "sale" },
    { label: "Auction", value: "auction" }
  ];

  const transmissionOptions = [
    { label: "Manual", value: "manual" },
    { label: "Automatic", value: "automatic" },
    { label: "Electric", value: "electric" }
  ];
  return (
    <Card>
      <div>
        {/* Static sidebar for large screens */}
        <div className="sidebar-content" css={sideBarCss}>
          {/* Sidebar content goes here */}
          <div>
            <Button
              icon="pi pi-filter"
              label="Filters"
              className="p-button-text"
            />
          </div>
          <div>
            <h3>Car Types</h3>
            <Dropdown
              value={selectedCarType}
              options={carTypeOptions}
              onChange={(e) => setSelectedCarType(e.value)}
              placeholder="Select a Car Type"
              disabled={getAllCarTypesQuery?.isLoading}
            />
          </div>

          {/* By transmission */}
          <div>
            <h3>Transmission</h3>
            <Dropdown
              value={transmission}
              options={transmissionOptions}
              onChange={(e) => setTransmission(e.value)}
              placeholder="Select by Transmission"
            />
          </div>

          {/* By car status */}
          <div>
            <h3>Car Status</h3>
            {carStatusOptions.map((status) => (
              <div key={status.value} style={{ margin: "0.5rem" }}>
                <RadioButton
                  inputId={status.value}
                  name="carStatus"
                  value={status.value}
                  onChange={(e) => setCarStatus(e.value)}
                  checked={carStatus === status.value}
                />
                <label htmlFor={status.value}> {status.label} </label>
              </div>
            ))}
          </div>

          {/* By condition */}
          <div>
            <h3>Car Condition</h3>
            <RadioButton
              inputId="new"
              name="condition"
              value="new"
              onChange={(e) => setCarCondition(e.value)}
              checked={carCondition === "new"}
            />
            <label htmlFor="new"> New </label>
            <RadioButton
              inputId="old"
              name="condition"
              value="old"
              onChange={(e) => setCarCondition(e.value)}
              checked={carCondition === "old"}
            />
            <label htmlFor="old"> Old </label>
          </div>
          {/* By max price */}
          <div>
            <h3>Filter by Maximum Price</h3>
            <Slider
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.value)}
              min={0}
              max={1000000000}
              step={1000000}
            />
            <div style={{ marginTop: "1rem" }}>
              <span>UGX {maxPrice ? maxPrice.toLocaleString() : 0}</span>
            </div>
          </div>
        </div>

        {/* Sidebar component for mobile screens */}
        <Sidebar
          visible={visible}
          onHide={() => setVisible(false)}
          showCloseIcon={false}
          // Ensures that sidebar acts as a modal on mobile
        >
          <div>
            <h3>Categories</h3>
            <Dropdown
              value={selectedCarType}
              options={carTypeOptions}
              onChange={(e) => setSelectedCarType(e.value)}
              disabled={getAllCarTypesQuery?.isLoading}
              placeholder="Select a Car Type"
            />
          </div>

          {/* By transmission */}
          <div>
            <h3>Transmission</h3>
            <Dropdown
              value={transmission}
              options={transmissionOptions}
              onChange={(e) => setTransmission(e.value)}
              placeholder="Select by Transmission"
            />
          </div>

          {/* By car status */}
          <div>
            <h3>Car Status</h3>
            {carStatusOptions.map((status) => (
              <div key={status.value} style={{ margin: "0.5rem" }}>
                <RadioButton
                  inputId={status.value}
                  name="carStatus"
                  value={status.value}
                  onChange={(e) => setCarStatus(e.value)}
                  checked={carStatus === status.value}
                />
                <label htmlFor={status.value}> {status.label} </label>
              </div>
            ))}
          </div>
          <div>
            <h3>Car Condition</h3>
            <RadioButton
              inputId="new"
              name="condition"
              value="new"
              onChange={(e) => setCarCondition(e.value)}
              checked={carCondition === "new"}
            />
            <label htmlFor="new"> New </label>{" "}
            <RadioButton
              inputId="old"
              name="condition"
              value="old"
              onChange={(e) => setCarCondition(e.value)}
              checked={carCondition === "old"}
            />
            <label htmlFor="old"> Old </label>
          </div>

          {/* By max price */}
          <div>
            <h3>Filter by Maximum Price</h3>
            <Slider
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.value)}
              min={0}
              max={1000000000}
              step={1000000}
            />
            <div style={{ marginTop: "1rem" }}>
              <span>UGX {maxPrice ? maxPrice.toLocaleString() : 0}</span>
            </div>
          </div>
        </Sidebar>
      </div>

      {/* Main Container  */}
      <div css={mainContainerCss}>
        <div css={subMainContainerCss}>
          {/* Button to toggle sidebar on small screens, hidden on large screens */}
          <div
          // css={css`
          //   display: none; /* Default to not displayed */
          //   @media (max-width: 992px) {
          //     display: block; /* Only display the button on wider screens */
          //   }
          // `}
          >
            {" "}
            <Button
              icon="pi pi-filter"
              label="Filter"
              className="p-button-text"
              onClick={() => setVisible(true)}
            />
          </div>

          <div
            style={{
              position: "relative"
            }}
          >
            <React.Fragment>
              <div className="p-inputgroup" style={{ flex: "1 1 300px" }}>
                <InputText
                  placeholder="Car Search"
                  style={{ width: "100%" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  icon="pi pi-search"
                  style={{}}
                  onClick={handleSearchClick}
                />
              </div>
            </React.Fragment>
          </div>
        </div>

        <div css={carListingsCss}>
          <CarList data={data} isLoading={isLoading} />
        </div>
      </div>
    </Card>
  );
};

export default CarListingsPage;
