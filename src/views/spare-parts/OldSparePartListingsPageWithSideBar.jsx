/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { toast } from "react-toastify";

import { css } from "@emotion/react";
import SparePartsList from "./SparePartsList";

import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllCars } from "../../services/cars/car-service.js";
import { getAllCarTypes } from "../../services/cars/car-types-service";
import {
  getAllSparePartTypeTypes,
  getSparePartTypeById,
  postSparePartType,
  updateSparePartType,
  deleteSparePartTypeById
} from "../../services/spare-parts/spare-parts--types-service.js";
import {
  getAllSpareParts,
  getSparePartById,
  postSparePart,
  updateSparePart,
  deleteSparePartById
} from "../../services/spare-parts/spare-parts-service";
import { ProgressSpinner } from "primereact/progressspinner";
import { AutoComplete } from "primereact/autocomplete";

//
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { useSearchParams } from "react-router-dom";
import { Slider } from "primereact/slider";

const SparePartListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const [visible, setVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(params?.spare_part_type);

  const [selectedSparePartType, setSelectedSparePartType] = useState({
    slug: params?.spare_part_type
  });
  const [filteredSparePartType, setFilteredSparePartType] = useState();

  const [itemCondition, setItemCondition] = useState(params?.condition);
  const [maxPrice, setMaxPrice] = useState(
    parseInt(params?.maxPrice, 10) || null
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  // Sync changes in state back to URL search parameters
  useEffect(() => {
    const newParams = { ...params };
    if (selectedSparePartType?.slug)
      newParams.spare_part_type = selectedSparePartType?.slug;
    if (itemCondition) newParams.condition = itemCondition;
    if (maxPrice !== null) {
      newParams.maxPrice = maxPrice;
    } else {
      delete newParams.maxPrice; // Remove the parameter if maxPrice is null
    }

    setSearchParams(newParams);
  }, [selectedSparePartType, itemCondition, maxPrice, setSearchParams]);

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
    queryKey: ["spare-parts", params],
    queryFn: () =>
      getAllSpareParts({ ...params, approval_status: ["pending", "approved"] })
  });

  useEffect(() => {
    if (isError) {
      console.log("Error fetching getAllCars:", error);
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
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
    flex-wrap: wrap;
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

  const getAllSparePartTypesQuery = useQuery({
    queryKey: ["spare-part-types"],
    queryFn: getAllSparePartTypeTypes
  });

  console.log("getAllSparePartTypesQuery : ", getAllSparePartTypesQuery);
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
            <h3>Spare Part Types</h3>

            <div>
              {/* <label htmlFor="spare_part_type_id">Spare Part Type</label> */}
              <AutoComplete
                value={selectedSparePartType?.slug || ""}
                suggestions={filteredSparePartType}
                disabled={getAllSparePartTypesQuery.isLoading}
                completeMethod={(e) => {
                  const results = getAllSparePartTypesQuery.data?.data?.filter(
                    (item) => {
                      return item.slug
                        .toLowerCase()
                        .includes(e.query.toLowerCase());
                    }
                  );
                  setFilteredSparePartType(results);
                }}
                field="slug"
                dropdown={true}
                onChange={(e) => {
                  if (typeof e.value === "string") {
                    setSelectedSparePartType({ slug: e.value });
                  } else if (typeof e.value === "object" && e.value !== null) {
                    setSelectedSparePartType(e.value);
                    // Handle any related field updates if necessary
                  }
                }}
                placeholder="Select a Spare Part Type"
                id="spare_part_type_slug"
                selectedItemTemplate={(value) => (
                  <div>{value ? value.name : "Select a Spare Part Type"}</div>
                )}
              />

              {getAllSparePartTypesQuery.isLoading && (
                <ProgressSpinner
                  style={{ width: "10px", height: "10px" }}
                  strokeWidth="4"
                />
              )}
            </div>
          </div>
          {/* By condition */}
          <div>
            <h3>Spare Part Condition</h3>
            <RadioButton
              inputId="new"
              name="condition"
              value="new"
              onChange={(e) => setItemCondition(e.value)}
              checked={itemCondition === "new"}
            />
            <label htmlFor="new"> New </label>
            <RadioButton
              inputId="old"
              name="condition"
              value="old"
              onChange={(e) => setItemCondition(e.value)}
              checked={itemCondition === "old"}
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
              max={100000000}
              step={500000}
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
            <h3>Spare Part Types</h3>

            <div>
              {/* <label htmlFor="spare_part_type_id">Spare Part Type</label> */}
              <AutoComplete
                value={selectedSparePartType?.slug || ""}
                suggestions={filteredSparePartType}
                disabled={getAllSparePartTypesQuery.isLoading}
                completeMethod={(e) => {
                  const results = getAllSparePartTypesQuery.data?.data?.filter(
                    (item) => {
                      return item.slug
                        .toLowerCase()
                        .includes(e.query.toLowerCase());
                    }
                  );
                  setFilteredSparePartType(results);
                }}
                field="slug"
                dropdown={true}
                onChange={(e) => {
                  if (typeof e.value === "string") {
                    setSelectedSparePartType({ slug: e.value });
                  } else if (typeof e.value === "object" && e.value !== null) {
                    setSelectedSparePartType(e.value);
                    // Handle any related field updates if necessary
                  }
                }}
                id="spare_part_type_slug"
                placeholder="Select a Spare Part Type"
                selectedItemTemplate={(value) => (
                  <div>{value ? value.name : "Select a Spare Part Type"}</div>
                )}
              />

              {getAllSparePartTypesQuery.isLoading && (
                <ProgressSpinner
                  style={{ width: "10px", height: "10px" }}
                  strokeWidth="4"
                />
              )}
            </div>
          </div>
          {/* By condition */}
          <div>
            <h3>Spare Part Condition</h3>
            <RadioButton
              inputId="new"
              name="condition"
              value="new"
              onChange={(e) => setItemCondition(e.value)}
              checked={itemCondition === "new"}
            />
            <label htmlFor="new"> New </label>
            <RadioButton
              inputId="old"
              name="condition"
              value="old"
              onChange={(e) => setItemCondition(e.value)}
              checked={itemCondition === "old"}
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
              max={100000000}
              step={500000}
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
            css={css`
              display: none; /* Default to not displayed */
              @media (max-width: 992px) {
                display: block; /* Only display the button on wider screens */
              }
            `}
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
                  placeholder="Search Spare Part"
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
          <SparePartsList data={data} isLoading={isLoading} />
        </div>
      </div>
    </Card>
  );
};

export default SparePartListingsPage;
