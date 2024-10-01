import React, { Suspense, useState, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate
} from "react-router-dom";
//
import AppRoutes from "../AppRoutes";
import { Button } from "primereact/button";
import AppTopbar from "../AppTopbar";

import { motion } from "framer-motion";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";

function AppLayout() {
  // ===========  App routes ===========
  let myroutes = AppRoutes();
  const [defaultRoutes, setDefaultRoutes] = useState(myroutes);

  useEffect(() => {
    setDefaultRoutes(myroutes);
  }, [myroutes]);

  //
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the button when the user scrolls down 100px from the top of the document
      setShowBackToTop(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
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
        <AppTopbar />
        <Routes>
          {defaultRoutes.map((route, index) => {
            return (
              <Route
                path={route.path}
                key={index}
                element={<route.element location={location} />}
              />
            );
          })}
        </Routes>
        {/* back to top */}
        {showBackToTop && (
          <Button
            onClick={scrollToTop}
            style={{
              position: "fixed",
              bottom: "30px",
              right: "20px",
              zIndex: "1000"
            }}
          >
            <i className="pi pi-arrow-up"></i>
          </Button>
        )}
      </Suspense>
    </>
  );
}

export default AppLayout;
