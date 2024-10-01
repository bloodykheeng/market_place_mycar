import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { toast } from "react-toastify";
import { confirmDialog } from "primereact/confirmdialog";
import { DataView } from "primereact/dataview";
import { Skeleton } from "primereact/skeleton";
import { FaEdit, FaTrash } from "react-icons/fa";
import CreateForm from "./CreateForm";
import EditForm from "./EditForm";
import { getAllFaqs, deleteFaqById } from "../../services/faqs/faqs-service";
import { Accordion, AccordionTab } from "primereact/accordion";

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => getAllFaqs()
  });

  useEffect(() => {
    if (isError) {
      console.log("Error fetching getAllFaqs:", error);
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
    }
  }, [isError]);

  const handleSearchSubmit = () => {
    if (data) {
      setFilteredFaqs(
        data.filter((faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  const deleteMutation = useMutation({
    queryFn: deleteFaqById,
    onSuccess: () => {
      queryClient.invalidateQueries("faqs");
      toast.success("FAQ deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting FAQ");
    }
  });

  const handleDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete this FAQ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteMutation.mutate(id)
    });
  };

  const handleEdit = (faq) => {
    setSelectedFaq(faq);
    setShowEditForm(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const itemTemplate = (faq, layout) => {
    if (layout === "list") {
      return (
        <div className="col-12" key={faq.id}>
          <Accordion>
            <AccordionTab header={faq.question}>
              <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                <div className="flex flex-1 gap-4 flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start">
                  <div className="flex gap-3 flex-column align-items-center sm:align-items-start">
                    <p>{faq.answer}</p>
                    <div className="flex gap-3 align-items-center">
                      <Button
                        icon={<FaEdit />}
                        className="p-button-rounded p-button-secondary p-mr-2"
                        onClick={() => handleEdit(faq)}
                      />
                      <Button
                        icon={<FaTrash />}
                        className="p-button-rounded p-button-danger"
                        onClick={() => handleDelete(faq.id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTab>
          </Accordion>
        </div>
      );
    }
    return null;
  };

  // const itemTemplate = (faq, layout) => {
  //   if (layout === "list") {
  //     return (
  //       <div className="col-12" key={faq.id}>
  //         <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
  //           <div className="flex flex-1 gap-4 flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start">
  //             <div className="flex gap-3 flex-column align-items-center sm:align-items-start">
  //               <div className="text-2xl font-bold cursor-pointer text-900">
  //                 {faq.question}
  //               </div>
  //               <div className="flex gap-3 align-items-center">
  //                 <Button
  //                   icon={<FaEdit />}
  //                   className="p-button-rounded p-button-secondary p-mr-2"
  //                   onClick={() => handleEdit(faq)}
  //                 />
  //                 <Button
  //                   icon={<FaTrash />}
  //                   className="p-button-rounded p-button-danger"
  //                   onClick={() => handleDelete(faq.id)}
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  return (
    <Card>
      <div className="faq-page" style={{ minHeight: "100vh", padding: "1rem" }}>
        <h2 style={{ margin: 0 }}>Frequently Asked Questions</h2>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            flexWrap: "wrap",
            margin: "1rem 0"
          }}
        >
          <div className="p-col-8">
            <div className="p-inputgroup">
              <InputText
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search questions..."
              />
              <Button
                icon="pi pi-search"
                className="p-button-primary"
                onClick={handleSearchSubmit}
              />
            </div>
          </div>
          <div className="p-col-4" style={{ textAlign: "right" }}>
            <Button
              label="Add FAQ"
              className="p-button-primary"
              onClick={() => setShowAddForm(true)}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="card" style={{ width: "100%" }}>
            <div className="p-4 border-round border-1 surface-border">
              <ul className="p-0 m-0 list-none">
                {[...Array(5)].map((_, i) => (
                  <li className="mb-3" key={i}>
                    <div className="flex">
                      <Skeleton shape="circle" size="4rem" className="mr-2" />
                      <div style={{ flex: "1" }}>
                        <Skeleton width="100%" className="mb-2" />
                        <Skeleton width="75%" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : isError ? (
          <p>Error loading FAQs</p>
        ) : (
          <DataView
            value={filteredFaqs}
            itemTemplate={itemTemplate}
            layout="list"
            paginator
            lazy
            loading={isLoading}
            first={first}
            rows={rows}
            onPage={onPageChange}
            totalRecords={filteredFaqs.length}
            rowsPerPageOptions={[10, 25, 50, 100]}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            paginatorLeft
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            emptyMessage="No Data!"
          />
        )}
      </div>
      <CreateForm show={showAddForm} onHide={() => setShowAddForm(false)} />
      {selectedFaq && (
        <EditForm
          show={showEditForm}
          faq={selectedFaq}
          onHide={() => setShowEditForm(false)}
        />
      )}
    </Card>
  );
};

export default FAQPage;
