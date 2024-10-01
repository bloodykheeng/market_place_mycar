import React, { useState, useEffect } from "react";

import {
  getAllFaqs,
  getFaqById,
  postFaq,
  updateFaq,
  deleteFaqById
} from "../../services/faqs/faqs-service";

import RowForm from "./widgets/RowForm";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";

function EditForm(props) {
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: (variables) => updateFaq(props?.rowData?.id, variables),
    onSuccess: () => {
      props.onClose();
      toast.success("Edited Successfully");
      queryClient.invalidateQueries(["faqs"]);
    },
    onError: (error) => {
      // props.onClose();
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
    }
  });

  // const handleSubmit = (data) => {
  //     console.log(data);

  //     editMutation.mutate(data);
  // };

  const handleSubmit = async (data) => {
    console.log("Data we are submitting: ", data);

    editMutation.mutate(data);
  };

  return (
    <Dialog
      header="Faqs Form"
      visible={props.show}
      onHide={() => props.onHide()}
    >
      {/* <h3>Programs Edit Form</h3> */}
      <p>Edit Data Below</p>
      <RowForm initialData={props.rowData} handleSubmit={handleSubmit} />
      {/* <h4>{creactProgramsMutation.status}</h4> */}

      {editMutation.isLoading && (
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
    </Dialog>
  );
}

export default EditForm;
