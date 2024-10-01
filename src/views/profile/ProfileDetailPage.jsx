/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import moment from "moment";
import EditForm from "./EditForm";

import { FaPencilAlt } from "react-icons/fa"; // Equivalent to IconPencil
import { FaShoppingBag } from "react-icons/fa";
import { IoCheckmarkCircleOutline } from "react-icons/io5"; // Equivalent to IconCheckCircle
import { MdCloudDone } from "react-icons/md"; // Equivalent to IconCloudCheck
import { AiFillCloseCircle } from "react-icons/ai"; // Equivalent to IconXCircle
import { RiDeleteBin6Line } from "react-icons/ri"; // Equivalent to IconTrash
import { Tag } from "primereact/tag";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";

function ProfileDetailPage({ userDetail, loggedInUserData }) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(userDetail);
  const [showEditForm, setShowEditForm] = useState(false);
  const [profilePhotoVisible, setProfilePhotoVisible] = useState(false);

  useEffect(() => {
    setProfileData(userDetail);
  }, [userDetail]);

  const handleCloseEditForm = () => {
    setShowEditForm(false);
  };

  const getColorSeverity = (status) => {
    let color = "primary";
    if (status === "active") color = "success";
    else if (status === "deactive") color = "danger";
    return color;
  };

  return (
    <>
      <div className="justify-content-center align-items-center h-100">
        {/* <BreadcrumbNav /> */}
        <div className="col-12">
          <Card className="mb-3" style={{ borderRadius: ".5rem" }}>
            <div className="flex flex-wrap g-0">
              <div
                css={css`
                  @media (max-width: 767px) {
                    width: 100%;
                    flex-grow: 0 !important;
                  }
                `}
                className="text-center flex-grow-1"
                style={{
                  background:
                    "linear-gradient(to right bottom, #0074D9, #00A5F8)"
                }}
              >
                <h2>Profile</h2>
                <Avatar
                  icon="pi pi-user"
                  image={`${process.env.REACT_APP_API_BASE_URL}${profileData?.photo_url}`}
                  shape="circle"
                  className="my-5"
                  size="xlarge"
                  onClick={() => setProfilePhotoVisible(true)}
                  style={{ cursor: "pointer" }}
                />
                <h5>{profileData?.name}</h5>
                <p>ROLE: {profileData?.role}</p>
                <Button
                  icon={<FaPencilAlt style={{ color: "white" }} />}
                  // className="p-button-rounded p-button-text"
                  className="m-2"
                  tooltip="Edit Profile"
                  onClick={() => setShowEditForm(true)}
                />
                <Button
                  className="m-2"
                  icon={<FaShoppingBag style={{ color: "white" }} />}
                  tooltip="View Product Catalogue"
                  onClick={() =>
                    navigate("products", {
                      state: { user_detail: profileData }
                    })
                  }
                />
              </div>
              <div
                css={css`
                  @media (max-width: 767px) {
                    width: 100%;
                    flex-grow: 0 !important;
                  }
                `}
                className="flex-grow-1"
              >
                <div className="p-4">
                  <h6>Information</h6>
                  <div>
                    <div className="flex gap-1 align-items-center">
                      <h6>Name : </h6>
                      <p className="text-muted">{profileData?.name}</p>
                    </div>
                    <div className="flex gap-1 align-items-center">
                      <h6>Role : </h6>
                      <p className="text-muted">{profileData?.role}</p>
                    </div>
                    <div className="flex gap-1 align-items-center">
                      <h6>Account Status : </h6>
                      <Tag
                        value={
                          profileData?.status.charAt(0).toUpperCase() +
                          profileData?.status.slice(1)
                        }
                        severity={getColorSeverity(profileData?.status)}
                      />
                    </div>
                  </div>
                  <Divider />
                  <div>
                    <div className="flex gap-1 align-items-center">
                      <h6>Email : </h6>
                      <p className="text-muted">{profileData?.email}</p>
                    </div>
                    <div className="flex gap-1 align-items-center">
                      <h6>Date Joined : </h6>
                      <p className="text-muted">
                        {moment(profileData?.date_joined).format(
                          "MMMM D, YYYY h:mm A"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <EditForm
        rowData={profileData}
        show={showEditForm}
        onHide={handleCloseEditForm}
        onClose={handleCloseEditForm}
        loggedInUserData={loggedInUserData}
      />

      <Dialog
        header="Profile Image"
        visible={profilePhotoVisible}
        onHide={() => setProfilePhotoVisible(false)}
        maximizable
      >
        <div className="flex align-items-center justify-content-center">
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}${profileData?.photo_url}`}
            alt="Profile"
            style={{ width: "auto" }}
          />
        </div>
      </Dialog>
    </>
  );
}

export default ProfileDetailPage;
