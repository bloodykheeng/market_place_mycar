import React, { Suspense, useState, useEffect, useRef } from "react";

import logo from "./logo.svg";

//
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import "primereact/resources/primereact.css";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/lara-dark-blue/theme.css";

import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate
} from "react-router-dom";

import { motion } from "framer-motion";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import PrimeReact from "primereact/api";

//
const AppLayOut = React.lazy(() => import("./layouts/AppLayout.jsx"));

function App() {
  const location = useLocation();
  const [theme, setTheme] = useState("dark");
  const changeMyTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    PrimeReact?.changeTheme?.(
      `lara-${theme}-blue`,
      `lara-${newTheme}-blue`,
      "app-theme",
      () => setTheme(newTheme)
    );
  };

  const textVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.5, duration: 1.5 } }
  };

  return (
    <>
      <Suspense
        fallback={
          <Card
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "white",
              zIndex: 9999
            }}
          >
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
            <motion.div
              initial="hidden"
              animate="visible"
              variants={textVariant}
            >
              <h1
                style={{
                  marginTop: "20px",
                  fontSize: "24px",
                  color: "#007ad9"
                }}
              >
                MYCAR
              </h1>
            </motion.div>
          </Card>
        }
      >
        <Routes>
          <Route path="/*" element={<AppLayOut />} />

          <Route
            path="*"
            element={
              <div>
                <h1>Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
