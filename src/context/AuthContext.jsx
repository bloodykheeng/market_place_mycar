import { createContext, useContext, useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getUserService, getCsrf } from "../services/auth/auth.js";
import axios from "axios";
import { logout } from "../services/auth/auth-api";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  const navigate = useNavigate();
  console.log("location.pathname : ", location.pathname);

  // const getCsrfToken = useQuery(["csrftoken"], getCsrf, {
  //     retry: false,
  //     onSuccess: (data) => {},
  //     onError: (error) => {
  //         console.log("error while getting csrf token : ", error);
  //     },
  // });

  const getUserQuery = useQuery({
    queryKey: ["user"],
    queryFn: getUserService,
    retry: false
  });

  useEffect(() => {
    if (getUserQuery?.data?.data) {
      setIsLoading(false);
    }
  }, [getUserQuery?.data?.data]);

  console.log(
    "🚀 ~ AuthProvider ~ getUserQuery?.data?.data:",
    getUserQuery?.data?.data
  );

  useEffect(() => {
    if (getUserQuery?.isError) {
      //   getUserQuery?.error?.response?.data?.message
      //     ? toast.error(getUserQuery?.error?.response?.data?.message)
      //     : !getUserQuery?.error?.response
      //     ? toast.warning("Check Your Internet Connection Please")
      //     : toast.error("An Error Occured Please Contact Admin");
      setIsLoading(false);

      //   navigate("/login");
    }
  }, [getUserQuery?.isError]);

  //logout
  // Logout mutation function
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      // Reset the user state to null
      setUser(null);
      queryClient.resetQueries(["users"]);
      queryClient.clear();
      // Invalidate all queries to clear cached data
      // queryClient.invalidateQueries(["user"]);

      // queryClient.resetQueries();
      // queryClient.clear();
      // Remove the Authorization header from Axios
      axios.defaults.headers.common["Authorization"] = null;

      console.log("logout response is : ", data);
      navigate("/");
      window.location.reload();
      // Display a success toast message
      toast.success("Goodbye 👋");

      // Set loading state to false
      setIsLoading(false);
    },
    onError: (error) => {
      // Display an error toast message
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occured Please Contact Admin");

      // Set loading state to false
      setIsLoading(false);

      // Log the error
      console.log("Logout errors ", error);
    }
  });

  return (
    <AuthContext.Provider
      value={{
        getUserQuery,
        logoutMutation,
        user,
        errors,
        isLoading,
        setIsLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
