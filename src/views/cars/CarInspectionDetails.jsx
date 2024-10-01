import React, { useRef } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";
import moment from "moment"; // Import moment
import { Tag } from "primereact/tag";

import { Button } from "primereact/button";

import { ProgressBar } from "primereact/progressbar";
import { Panel } from "primereact/panel";

function CarInspectionDetails({ selectedItem, ...props }) {
  console.log(
    "selected item in SubProjectPerfomanceReportPdfModal : ",
    selectedItem
  );

  const componentRef = useRef();

  // Function to format date using moment
  const formatDate = (dateString) => {
    return moment(dateString).format("MMMM Do YYYY, h:mm:ss a"); // Example format
  };

  // Function to display status with color
  const statusWithColor = (status) => {
    let color;
    switch (status) {
      case "pending approval":
        color = "blue";
        break;
      case "approved":
        color = "green";
        break;
      case "pending":
        color = "orange";
        break;
      case "rejected":
        color = "red";
        break;
      default:
        color = "grey";
    }
    return (
      <span style={{ color }}>
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  // Function to display status with color using Tag
  const tagStatus = (status) => {
    let severity;
    switch (status) {
      case "pending approval":
        severity = "info"; // blue
        break;
      case "approved":
        severity = "success"; // green
        break;
      case "pending":
        severity = "warning"; // orange
        break;
      case "rejected":
        severity = "danger"; // red
        break;
      default:
        severity = "secondary"; // grey or default
    }
    return (
      <Tag
        severity={severity}
        value={status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      />
    );
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // This creates two columns of equal width
    gridGap: "1rem" // Space between the columns
  };

  // Remember to store the original title to reset it later
  const originalTitle = document.title;

  return (
    <>
      <Card title="Car Condition Assessment" style={{ marginTop: "1rem" }}>
        <div style={{ padding: "1rem", paddingBottom: "4rem" }}>
          {selectedItem?.car_inspection_report_category ? (
            selectedItem?.car_inspection_report_category.map(
              (category, index) => (
                <Panel
                  collapsed={true}
                  key={index}
                  header={`${category.inspection_field_category.name}`}
                  toggleable
                  style={{ marginBottom: "1rem" }}
                >
                  <DataTable value={category.fields} responsiveLayout="scroll">
                    <Column
                      field="inspection_field.name"
                      header="Evaluation"
                    ></Column>
                    <Column field="value" header="Assessment"></Column>
                    {/* <Column field="inspection_field.status" header="Field Status"></Column>
                            <Column field="creator.name" header="Created By"></Column> */}
                  </DataTable>
                </Panel>
              )
            )
          ) : (
            <h1>Inspection Report Not Available</h1>
          )}
        </div>
      </Card>
    </>
  );
}

export default CarInspectionDetails;
