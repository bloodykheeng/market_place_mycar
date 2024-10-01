import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { InputTextarea } from "primereact/inputtextarea";
import { Avatar } from "primereact/avatar";

import Edit from "@mui/icons-material/Edit";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

import GarageRatingDialog from "./GarageRatingDialog";
import { confirmDialog } from "primereact/confirmdialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllGarageReviews,
  getGarageReviewById,
  postGarageReview,
  updateGarageReview,
  deleteGarageReviewById
} from "../../services/garages/garage-review-service";
import { toast } from "react-toastify";

import Lottie from "lottie-react";
import CarTyreAnimation from "./lottie/car-tyre-lottie";

import { ProgressSpinner } from "primereact/progressspinner";

const GarageRating = ({ loggedInUserData, productDetailItem }) => {
  const [visible, setVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const openModal = (rating) => {
    setSelectedRating(rating);
    setVisible(true);
  };

  const styles = {
    container: {
      padding: "1rem"
    },
    header: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "1rem"
    },
    ratingsList: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem"
    },

    ratingInfo: {
      display: "flex",
      flexDirection: "column"
    },
    userName: {
      fontWeight: "bold"
    },
    editIcon: {
      cursor: "pointer",
      color: "green"
    },
    deleteIcon: {
      cursor: "pointer",
      color: "red"
    },

    comment: {
      marginTop: "0.5rem"
    }
  };

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["garage-reviews", "by_garage_id"],
    queryFn: () => getAllGarageReviews({ garage_id: productDetailItem?.id })
  });

  console.log("🚀 ~ data:", data);

  useEffect(() => {
    console.log("🚀 ~ SparePartsRating ~ error:", error);
    if (isError) {
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
    }
  }, [isError]);

  const [deleteMutationIsLoading, setDeleteMutationIsLoading] = useState(false);
  const DeleteSelectedItemMutation = useMutation({
    mutationFn: (variables) => deleteGarageReviewById(variables),
    onSuccess: () => {
      queryClient.invalidateQueries(["garage-reviews"]);
      toast.success("Deleted Successfully");
      setDeleteMutationIsLoading(false);
      // queryClient.resetQueries(["spare-part-reviews"]);
    },
    onError: (error) => {
      setDeleteMutationIsLoading(false);
      console.log("🚀 ~ SparePartsRating ~ error:", error);
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
    }
  });

  const handleDelete = (event, id) => {
    confirmDialog({
      message: "Are you sure you want to delete?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => confirmDelete(id),
      reject: cancelDelete
    });
  };

  const confirmDelete = (selectedDeleteId) => {
    if (selectedDeleteId !== null) {
      setDeleteMutationIsLoading(true);
      DeleteSelectedItemMutation.mutate(selectedDeleteId);
    }
  };
  const cancelDelete = () => {};

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",

          padding: "1rem"
        }}
      >
        <h2>Loading Reviews...</h2>
        <Lottie
          animationData={CarTyreAnimation}
          loop={true}
          style={{ height: "200px" }}
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Button
          label="Add Rating"
          icon="pi pi-plus"
          onClick={() => openModal(null)}
        />
      </div>
      <div style={styles.ratingsList}>
        <div>
          {data?.data?.data?.map((item) => (
            <div
              key={item?.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem"
              }}
            >
              {item?.created_by?.photo_url ? (
                // <img
                //   src={`${process.env.REACT_APP_API_BASE_URL}${item?.created_by?.photo_url}`}
                //   alt={item?.created_by?.name}
                //   style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                // />
                <Avatar
                  image={`${process.env.REACT_APP_API_BASE_URL}${item?.created_by?.photo_url}`}
                  shape="circle"
                  alt={item?.created_by?.name}
                  size="large"
                  className="p-mb-3"
                />
              ) : (
                <Avatar
                  icon="pi pi-user"
                  shape="circle"
                  size="large"
                  className="p-mb-3"
                  style={{ backgroundColor: "#007ad9", color: "#ffffff" }}
                />
              )}
              <div style={styles.ratingInfo}>
                <div style={styles.userName}>{item?.created_by?.name}</div>
                <Rating
                  value={item?.rating}
                  readOnly
                  stars={5}
                  cancel={false}
                />
                <div style={styles.comment}>{item.comment}</div>
              </div>
              {loggedInUserData &&
                loggedInUserData.id === item?.created_by?.id && (
                  <>
                    <Edit
                      style={styles.editIcon}
                      onClick={() => openModal(item)}
                    />
                    {deleteMutationIsLoading ? (
                      <div>
                        <ProgressSpinner
                          style={{ width: "20px", height: "20px" }}
                          strokeWidth="8"
                        />
                      </div>
                    ) : (
                      <DeleteOutline
                        style={styles.deleteIcon}
                        onClick={(event) => handleDelete(event, item.id)}
                      />
                    )}
                  </>
                )}
            </div>
          ))}
        </div>
      </div>
      <GarageRatingDialog
        show={visible}
        onHide={() => setVisible(false)}
        onClose={() => setVisible(false)}
        loggedInUserData={loggedInUserData}
        productDetailItem={productDetailItem}
        initialData={selectedRating}
      />
    </div>
  );
};

export default GarageRating;
