import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { PrimeReactProvider, PrimeReactContext } from "primereact/api";

import ScrollToTop from "./ScrollToTop";

import { BrowserRouter } from "react-router-dom";
//
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

//
import { Tooltip } from "primereact/tooltip";
import { GoogleOAuthProvider } from "@react-oauth/google";

//
import { motion } from "framer-motion";

//
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

//
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

//
import { AuthProvider } from "./context/AuthContext";
import { CarCartProvider } from "./context/CarCartContext";
import { SparePartsCartProvider } from "./context/SparePartsCartContext";
import { ThemeProvider } from "./context/ThemeContext";
import PrimeReact from "primereact/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "always",
      refetchOnWindowFocus: false
    },
    mutations: {
      networkMode: "always"
    }
  }
});

// Setting up PrimeReact. This must be done before rendering your app component if it uses PrimeReact features.
PrimeReact.ripple = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
    >
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <PrimeReactProvider value={{ unstyled: false }}>
          <ThemeProvider>
            <BrowserRouter>
              <QueryClientProvider client={queryClient}>
                <ScrollToTop>
                  <AuthProvider>
                    <CarCartProvider>
                      <SparePartsCartProvider>
                        <App />
                      </SparePartsCartProvider>
                    </CarCartProvider>
                  </AuthProvider>

                  <ReactQueryDevtools initialIsOpen={false} />
                  <Tooltip target=".custom-target-icon" />
                  <ConfirmDialog />
                  <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                  />
                </ScrollToTop>
              </QueryClientProvider>
            </BrowserRouter>
          </ThemeProvider>
        </PrimeReactProvider>
      </GoogleOAuthProvider>
    </motion.div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
