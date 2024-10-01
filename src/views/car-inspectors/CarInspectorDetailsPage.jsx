/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import CarTyreAnimation from "./lottie/car-tyre-lottie"; // adjust the path as needed
import {
  getAllCarInspectors,
  getUserBySlug
} from "../../services/auth/user-service.js";
import { FaEye } from "react-icons/fa";
import { Rating } from "primereact/rating";
import { useNavigate } from "react-router-dom";
import CarInspectorsRating from "./CarInspectorsRating";
import useAuthContext from "../../context/AuthContext";

import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";

const CarInspectorDetailsPage = () => {
  const { getUserQuery, logout, logoutMutation } = useAuthContext();
  const loggedInUserData = getUserQuery?.data?.data;

  const { slug } = useParams();
  const [visible, setVisible] = useState(true);
  const [selectedInspector, setSelectedInspector] = useState(null);

  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["inspector-by-slug", slug],
    queryFn: () => getUserBySlug(slug)
  });

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setSelectedInspector(data.data);
    }
  }, [data, isLoading, isError]);

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

  // Loading handling
  if (isLoading) {
    return (
      <Card>
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Skeleton
            width="100%"
            height="100%"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem"
              }}
            >
              <h2>Loading Details...</h2>
              <Lottie
                animationData={CarTyreAnimation}
                loop={true}
                style={{ height: "400px" }}
              />
            </div>
          </Skeleton>
        </div>
      </Card>
    );
  }

  // Error handling
  if (isError) {
    console.log("Error fetching getGarageBySlug:", error);
    toast.error(
      error?.response?.data?.message || "An Error Occurred Please Contact Admin"
    );
    return null;
  }

  return (
    <Card>
      <div
        css={css`
          width: 100%;
          min-height: 100vh;
          padding: 0.5rem;
          display: flex;
          flex-wrap: wrap;
        `}
      >
        <section
          css={css`
            // flex-grow: 6;
            flex: 1 1 50%;
            @media (max-width: 767px) {
              width: 100%;
            }
          `}
        >
          {selectedInspector?.photo_url ? (
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}${selectedInspector.photo_url}`}
              alt={selectedInspector.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              preview
            />
          ) : (
            <Avatar
              icon="pi pi-user"
              size="xlarge"
              style={{
                backgroundColor: "#2196F3",
                color: "#ffffff",
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          )}
        </section>
        <div
          css={css`
            // flex-grow: 6;
            flex: 1 1 50%;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 1rem;

            @media (max-width: 767px) {
              width: 100%;
            }
          `}
        >
          {selectedInspector && (
            <div className="flex flex-column">
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
        </div>
        <div
          css={css`
            flex: 1 1 100%;
            @media (max-width: 767px) {
              width: 100%;
            }
          `}
        >
          <CarInspectorsRating
            loggedInUserData={loggedInUserData}
            productDetailItem={selectedInspector}
          />
        </div>
      </div>
    </Card>
  );
};

export default CarInspectorDetailsPage;
