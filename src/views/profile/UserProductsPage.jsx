import React, { useEffect } from "react";
import ProfileDetailPage from "./ProfileDetailPage";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import {
  getAllUsers,
  getUserById,
  getApproverRoles,
  createUser,
  updateUser,
  deleteUserById,
  getAssignableRoles
} from "../../services/auth/user-service";
import { Skeleton } from "primereact/skeleton";
import { ProgressSpinner } from "primereact/progressspinner";
import { ProgressBar } from "primereact/progressbar";
import { TabView, TabPanel } from "primereact/tabview";
import CarsPage from "./cars/CarsPage";
import BreadcrumbNav from "../../components/general_components/BreadcrumbNav";
import SparePartsPage from "../../views/profile/spare-parts/SparePartsPage";

function UserProductsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  //
  let { state } = useLocation();
  let user_detail = state?.user_detail ? state?.user_detail : null;

  console.log("state in use location is : ", state);

  //===================== getUserById by id =================
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", user_detail?.id],
    queryFn: () => getUserById(user_detail?.id)
  });

  useEffect(() => {
    if (isError) {
      console.log("Error fetching getUserById :", error);
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");
    }
  }, [isError]);

  useEffect(() => {
    if (!user_detail) {
      navigate("/");
    }
  }, []);

  //
  // let userData = user_detail ?? data?.data;
  let userData = data?.data;
  console.log("🚀 ~ UserProductsPage ~ userData:", userData);

  // Loading handling
  if (isLoading) {
    return (
      <Card style={{ minHeight: "100vh", minWidth: "100vw" }}>
        <div
          style={{
            width: "100%",
            height: "400px",
            overflow: "hidden",
            marginTop: "2rem"
          }}
        >
          <Skeleton width="100%" style={{ marginBottom: "1rem" }}>
            <Skeleton
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,

                padding: "20px",
                borderRadius: "5px",

                textAlign: "left",
                transition: "all 0.3s ease"
              }}
            >
              <Skeleton style={{ margin: "0 0 10px 0", fontSize: "2rem" }}>
                <div style={{ margin: "20px", width: "100%" }}>
                  <ProgressBar
                    mode="indeterminate"
                    style={{ height: "6px" }}
                  ></ProgressBar>
                </div>
              </Skeleton>
              <Skeleton>
                {" "}
                <ProgressBar
                  mode="indeterminate"
                  style={{ height: "6px" }}
                ></ProgressBar>
              </Skeleton>
            </Skeleton>
          </Skeleton>
          <div className="flex mt-3 justify-content-between">
            <Skeleton width="4rem" height="2rem"></Skeleton>
            <Skeleton width="4rem" height="2rem"></Skeleton>
          </div>
          <div style={{ width: "100%", marginBottom: "1rem" }}></div>
          <Skeleton width="100%" height="300px"></Skeleton>
        </div>
      </Card>
    );
  }
  return (
    <Card style={{ minHeight: "100vh" }}>
      <BreadcrumbNav />
      <TabView>
        <TabPanel header="Cars">
          <CarsPage loggedInUserData={userData} />
        </TabPanel>
        <TabPanel header="Spare Parts">
          <SparePartsPage loggedInUserData={userData} />
        </TabPanel>
      </TabView>
    </Card>
  );
}

export default UserProductsPage;
