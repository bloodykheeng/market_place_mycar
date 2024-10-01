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
  getAllGarages,
  getGarageBySlug,
  getGarageById,
  postGarage,
  updateGarage,
  deleteGarageById
} from "../../services/garages/garages-service.js";
import { FaEye } from "react-icons/fa";
import { Rating } from "primereact/rating";
import { useNavigate } from "react-router-dom";
import GarageRating from "./GarageRating";
import useAuthContext from "../../context/AuthContext";

const GarageDetailsPage = () => {
  const { getUserQuery, logout, logoutMutation } = useAuthContext();
  const loggedInUserData = getUserQuery?.data?.data;

  const { slug } = useParams();
  const [visible, setVisible] = useState(true);
  const [selectedGarage, setSelectedGarage] = useState(null);

  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["garages", "by-slug", slug],
    queryFn: () => getGarageBySlug(slug)
  });

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setSelectedGarage(data.data);
    }
  }, [data, isLoading, isError]);

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
              <h2>Loading Garage Details...</h2>
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
          {selectedGarage ? (
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}${selectedGarage.photo_url}`}
              alt={selectedGarage.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              preview
            />
          ) : (
            <p>No photo available.</p>
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
          {selectedGarage && (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <strong>Name:&nbsp; </strong> <h4>{selectedGarage.name}</h4>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <strong>Address:&nbsp; </strong>
                <p>{selectedGarage.address}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <strong>Opening Hours:&nbsp; </strong>
                <p>{selectedGarage.opening_hours}</p>
              </div>
              <div>
                <strong>Details:&nbsp; </strong>
                <p>{selectedGarage.special_features}</p>
              </div>
            </>
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
          <GarageRating
            loggedInUserData={loggedInUserData}
            productDetailItem={selectedGarage}
          />
        </div>
      </div>
    </Card>
  );
};

export default GarageDetailsPage;
