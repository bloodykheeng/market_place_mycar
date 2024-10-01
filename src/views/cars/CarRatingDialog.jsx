import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { InputTextarea } from "primereact/inputtextarea";
import { Avatar } from "primereact/avatar";
import { Field, Form } from "react-final-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Edit from "@mui/icons-material/Edit";
import {
  getAllCarReviews,
  getCarReviewById,
  postCarReview,
  updateCarReview,
  deleteCarReviewById
} from "../../services/cars/car-reviews-service";
import { ProgressSpinner } from "primereact/progressspinner";

const CarRatingDialog = ({
  onClose,
  show,
  initialData,
  loggedInUserData,
  productDetailItem
}) => {
  const [currentRating, setCurrentRating] = useState(null);

  const [pendingData, setPendingData] = useState(null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // ===================== Creating and Editing Mutations ====================
  const queryClient = useQueryClient();
  const [createMutationIsLoading, setCreateMutationIsLoading] = useState(false);
  const useCreateMutation = useMutation({
    mutationFn: postCarReview,
    onSuccess: () => {
      setCreateMutationIsLoading(false);
      setPendingData(null);
      queryClient.invalidateQueries(["car-reviews"]);
      toast.success("Created Successfully");
      onClose();
    },
    onError: (error) => {
      console.log("🚀 ~ error:", error);
      setCreateMutationIsLoading(false);
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
    }
  });

  const [editMutationIsLoading, setEditMutationIsLoading] = useState(false);
  const useEditMutation = useMutation({
    mutationFn: (variables) => updateCarReview(initialData?.id, variables),
    onSuccess: () => {
      setEditMutationIsLoading(false);
      setPendingData(null);
      queryClient.invalidateQueries(["car-reviews"]);
      toast.success("Edited Successfully");
      onClose();
    },
    onError: (error) => {
      console.log("🚀 ~ error:", error);
      setEditMutationIsLoading(false);
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
    }
  });

  // =====================end  Creating and Editing Mutations ====================

  const handleSubmit = () => {
    console.log("🚀 ~ CarRatingDialog ~ pendingData:", pendingData);

    if (!initialData) {
      let finalData = {
        ...pendingData,
        car_id: productDetailItem?.id
      };

      console.log("🚀 ~ handleSubmit ~ finalData:", finalData);
      setCreateMutationIsLoading(true);
      useCreateMutation.mutate(finalData);
    } else {
      setEditMutationIsLoading(true);
      useEditMutation.mutate({
        ...pendingData,
        car_id: productDetailItem?.id
      });
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.rating) errors.rating = "Rating is required";
    if (!values.comment) errors.comment = "Comment is required";
    return errors;
  };

  const onConfirm = (pendingData) => {
    if (pendingData) {
      handleSubmit();
    }
    setShowConfirmDialog(false);
  };

  const onCancel = (setShowConfirmDialog) => {
    setShowConfirmDialog(false);
  };

  const saveRating = (values) => {
    setPendingData(values);
    setShowConfirmDialog(true);
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
    ratingItem: {
      display: "flex",
      alignItems: "center",
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
      color: "gray"
    },
    comment: {
      marginTop: "0.5rem"
    }
  };

  return (
    <>
      <Dialog
        header="Rate and Comment"
        visible={show}
        style={{ width: "50vw" }}
        onHide={onClose}
      >
        <div className="col-12 md:col-12">
          <div className="card p-fluid">
            <Form
              onSubmit={saveRating}
              initialValues={initialData}
              validate={validate}
              render={({
                handleSubmit,
                form,
                submitting,
                pristine,
                values
              }) => (
                <form onSubmit={handleSubmit}>
                  <Field name="rating">
                    {({ input, meta }) => (
                      <div className="p-field m-4">
                        <label htmlFor="rate">Rate</label>
                        <br />
                        <Rating
                          {...input}
                          value={input.value}
                          onChange={input.onChange}
                          stars={5}
                          cancel={false}
                        />
                        {meta.touched && meta.error && (
                          <small className="p-error">{meta.error}</small>
                        )}
                      </div>
                    )}
                  </Field>
                  <Field name="comment">
                    {({ input, meta }) => (
                      <div className="p-field m-4">
                        <label htmlFor="comment">Comment</label>
                        <InputTextarea {...input} rows={5} cols={30} />
                        {meta.touched && meta.error && (
                          <small className="p-error">{meta.error}</small>
                        )}
                      </div>
                    )}
                  </Field>
                  <div className="d-grid gap-2">
                    <Button
                      disabled={
                        createMutationIsLoading || editMutationIsLoading
                      }
                      type="submit"
                      label="Save"
                      icon="pi pi-check"
                    />
                  </div>
                  {(createMutationIsLoading || editMutationIsLoading) && (
                    <center>
                      <ProgressSpinner
                        style={{
                          width: "50px",
                          height: "50px",
                          borderWidth: "8px", // Border thickness
                          borderColor: "blue", // Border color
                          animationDuration: "1s"
                        }}
                        strokeWidth="8"
                        animationDuration="1s"
                      />
                    </center>
                  )}
                </form>
              )}
            />
          </div>
        </div>
      </Dialog>
      {showConfirmDialog && (
        <Dialog
          header="Confirm"
          visible={showConfirmDialog}
          style={{ width: "30vw" }}
          onHide={() => setShowConfirmDialog(false)}
        >
          <p>
            Are you sure you want to {initialData ? "edit" : "save"} this
            rating?
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "space-between"
            }}
          >
            <Button
              label="Yes"
              onClick={() =>
                onConfirm(
                  pendingData,
                  saveRating,
                  setPendingData,
                  setShowConfirmDialog
                )
              }
            />
            <Button label="No" onClick={() => onCancel(setShowConfirmDialog)} />
          </div>
        </Dialog>
      )}
    </>
  );
};

export default CarRatingDialog;
