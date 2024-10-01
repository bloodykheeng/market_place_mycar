/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { toast } from "react-toastify";

import { css } from "@emotion/react";
import GarageList from "./GarageList";

import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllCars } from "../../services/cars/car-service.js";
import { getAllCarTypes } from "../../services/cars/car-types-service";

import {
  getAllGarages,
  getGarageById,
  postGarage,
  updateGarage,
  deleteGarageById
} from "../../services/garages/garages-service.js";
import { ProgressSpinner } from "primereact/progressspinner";
import { AutoComplete } from "primereact/autocomplete";

//
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { useSearchParams } from "react-router-dom";
import { Slider } from "primereact/slider";

function GaragePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const [visible, setVisible] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const onPageChange = (event) => {
    console.log("🚀 ~ onPageChange ~ event:", event);
    setFirst(event.first);
    setRows(event.rows);
  };

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  // Sync changes in state back to URL search parameters
  useEffect(() => {
    const newParams = { ...params };
    setSearchParams(newParams);
  }, [setSearchParams]);

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
    queryKey: ["garages", params],
    queryFn: () => getAllGarages({ ...params, first: first, rows: rows })
  });

  useEffect(() => {
    if (isError) {
      console.log("Error fetching etAllGarages:", error);
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
    }
  }, [isError]);

  console.log("garages data is  : ", data);

  //
  let ListingsCss = css`
    padding: 1rem; /* Default padding */
    display: flex;
    flex-wrap: wrap;
    align-items: center; /* Center-align items */
    gap: 0.2rem; /* Add gap between elements for better spacing */
    ${"" /* justify-content: space-between; */}
    border-radius: 10px;
    z-index: 4;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05),
      0px 1px 4px rgba(0, 0, 0, 0.08);
    &:hover {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.02),
        0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);
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
    border-radius: 10px;
    ${
      "" /* border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18); */
    }
  `;

  let subMainContainerCss = css`
    padding: 1rem; /* Default padding */
    display: flex;
    flex-wrap: wrap;
    align-items: center; /* Center-align items */
    gap: 1rem; /* Add gap between elements for better spacing */
    justify-content: space-between;

    border-radius: 10px;
    z-index: 4;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05),
      0px 1px 4px rgba(0, 0, 0, 0.08);

    ${
      "" /* background-color: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(7.5px);
            -webkit-backdrop-filter: blur(7.5px);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18);
            border: 1px solid rgba(255, 255, 255, 0.18);
             */
    }

    &:hover {
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.02),
        0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);
    }
  `;

  //
  return (
    <Card>
      {/* Main Container  */}
      <div css={mainContainerCss}>
        <div css={subMainContainerCss}>
          {/* Button to toggle sidebar on small screens, hidden on large screens */}
          <div>
            <h4>Garages</h4>
          </div>

          <div
            style={{
              position: "relative"
            }}
          >
            <React.Fragment>
              <div className="p-inputgroup" style={{ flex: "1 1 300px" }}>
                <InputText
                  placeholder="Search Garage"
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

        <div css={ListingsCss}>
          <GarageList
            first={first}
            rows={rows}
            data={data}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Card>
  );
}

export default GaragePage;
