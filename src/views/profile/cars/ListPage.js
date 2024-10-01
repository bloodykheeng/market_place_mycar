import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateForm from "./CreateForm";

import EditForm from "./EditForm";

import moment from "moment";

import { Link } from "react-router-dom";

import {
  getAllCars,
  getCarById,
  postCar,
  updateCar,
  deleteCarById
} from "../../../services/cars/car-service";

import { toast } from "react-toastify";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import { Image } from "primereact/image";
import { useNavigate } from "react-router-dom";
import MuiTable from "../../../components/tables/MuiTable";

function ListPage({ loggedInUserData, ...props }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [
    deleteSelectedItemMutationIsLoading,
    setDeleteSelectedItemMutationIsLoading
  ] = useState(false);

  const { data, isLoading, isError, error, status } = useQuery({
    queryKey: ["cars", "user_id", loggedInUserData?.id],
    queryFn: () =>
      getAllCars({
        user_id: loggedInUserData?.id
      })
  });
  console.log("list of all cars : ", data);

  useEffect(() => {
    if (isError) {
      console.log("Error fetching getAllcars is : ", error);
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
    }
  }, [isError]);

  const DeleteSelectedItemMutation = useMutation({
    mutationFn: (variables) => deleteCarById(variables),
    onSuccess: (data) => {
      setDeleteSelectedItemMutationIsLoading(false);
      queryClient.invalidateQueries(["cars"]);
    },
    onError: (error) => {
      setDeleteSelectedItemMutationIsLoading(false);
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
    }
  });

  // const handleDelete = async (event, id) => {
  //     var result = window.confirm("Are you sure you want to delete?");
  //     if (result === true) {
  //         ProgramDeleteMutation.mutate(id);
  //     }
  // };

  const handleDelete = (event, id) => {
    let selectedDeleteId = id;
    confirmDialog({
      message: "Are you sure you want to delete?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => confirmDelete(selectedDeleteId),
      reject: cancelDelete
    });
  };

  const confirmDelete = (selectedDeleteId) => {
    if (selectedDeleteId !== null) {
      setDeleteSelectedItemMutationIsLoading(true);
      DeleteSelectedItemMutation.mutate(selectedDeleteId);
    }
  };

  const cancelDelete = () => {
    // setDeleteProgramId(null);
  };

  const [selectedItem, setSelectedItem] = useState();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showBudjetOutPutAddForm, setShowBudjetOutPutAddForm] = useState(false);

  const handleShowEditForm = (item) => {
    setSelectedItem(item);
    setShowEditForm(true);
    console.log("handleShowEditForm is : ", item);
  };
  const handleCloseEditForm = () => {
    setSelectedItem({ id: null });
    setShowEditForm(false);
  };

  // const activeUser = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")) : undefined;
  const activeUser = loggedInUserData;
  console.log(loggedInUserData);
  console.log("loggedInUserData in profile is : ", loggedInUserData);

  const onFormClose = () => {
    setShowAddForm(false);
  };

  const onBudjetOutPutFormClose = () => {
    setShowBudjetOutPutAddForm(false);
  };

  let tableId = 0;
  const columns = [
    {
      title: "#",
      width: "5%",
      field: "name",
      render: (rowData) => {
        // tableId = rowData.tableData.id;
        tableId = tableId++;
        return <div>{rowData.tableData.index + 1}</div>;
        // return <div>{rowData.tableData.id}</div>;
      }
    },
    {
      title: "Name",
      field: "name"
    },
    {
      title: "Price",
      field: "price"
    },
    {
      title: "Price",
      field: "price",
      render: (rowData) => {
        const amount = parseFloat(rowData.price.replace(/,/g, ""));
        return (
          <div>
            {isNaN(amount)
              ? rowData.price
              : amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        );
      }
    },
    {
      title: "Model",
      field: "model"
    },

    {
      title: "Photo",
      field: "photo_url",
      render: (rowData) => {
        return rowData.photos ? (
          <Image
            src={`${rowData?.photos && process.env.REACT_APP_API_BASE_URL}${
              rowData?.photos[0]?.photo_url
            }`}
            alt="Item"
            width="100"
            style={{ verticalAlign: "middle" }}
            preview={true}
          />
        ) : (
          <div>No Image</div>
        );
      }
    },

    {
      title: "Date",
      field: "created_at",
      render: (rowData) => {
        return moment(rowData.created_at).format("lll");
      }
    }
  ];
  return (
    <div style={{ width: "100%" }}>
      {/* <div className="col-12 xl:col-12">
                <div className="card">
                    <p>Funders Are Attched onto subprojects</p>
                </div>
            </div> */}
      <Panel header="Cars" style={{ marginBottom: "20px" }}>
        {["Vendor", "Seller"].includes(activeUser?.role) &&
          activeUser?.permissions.includes("create") && (
            <div
              style={{
                height: "3rem",
                margin: "1rem",
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem"
              }}
            >
              <Button
                label="Sell Car"
                className="p-button-primary"
                onClick={() => setShowAddForm(true)}
              />

              <CreateForm
                show={showAddForm}
                onHide={() => setShowAddForm(false)}
                onClose={onFormClose}
                projectId={props?.projectId}
              />
            </div>
          )}

        <MuiTable
          tableTitle="Cars"
          tableData={data?.data ?? []}
          tableColumns={columns}
          handleShowEditForm={handleShowEditForm}
          handleDelete={(e, item_id) => handleDelete(e, item_id)}
          showEdit={
            ["Admin", "Vendor"].includes(loggedInUserData?.role) &&
            activeUser?.permissions.includes("update")
          }
          showDelete={
            ["Admin", "Vendor"].includes(loggedInUserData?.role) &&
            activeUser?.permissions.includes("delete")
          }
          loading={
            isLoading ||
            status === "loading" ||
            deleteSelectedItemMutationIsLoading
          }
          //
          handleViewPage={(rowData) => {
            navigate("car", { state: { carData: rowData } });
          }}
          showViewPage={true}
          hideRowViewPage={false}
          //
          //
          exportButton={true}
          pdfExportTitle="Cars"
          csvExportTitle="Cars"
        />

        {selectedItem && (
          <EditForm
            rowData={selectedItem}
            show={showEditForm}
            onHide={handleCloseEditForm}
            onClose={handleCloseEditForm}
          />
        )}
      </Panel>
    </div>
  );
}

export default ListPage;
