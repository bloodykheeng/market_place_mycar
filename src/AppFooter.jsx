import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import {
  getAllEventSubscribers,
  getEventSubscriberById,
  postEventSubscriber,
  updateEventSubscriber,
  deleteEventSubscriberById
} from "./services/event-subscribers/event-subscribers-service";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";

export const footerProductLinks = [
  {
    name: "About Us",
    link: "/about"
  },

  {
    name: "Locations",
    link: "/locations" // Added a link for store locations
  },
  {
    name: "Products",
    link: "/cars" // Added a link for the blog
  },
  {
    name: "Customer Reviews",
    link: "/reviews" // Added a link for reviews
  }
];

export const footerCompanyLinks = [
  {
    name: "New Arrivals",
    link: "/" // Changed to match car sales
  },
  {
    name: "Used Cars",
    link: "/" // Changed to match car sales
  },
  {
    name: "Special Offers",
    link: "/" // Changed to match car sales
  }
];

export const footerSupportLinks = [
  {
    name: "FAQ"
  },
  {
    name: "Reviews"
  },
  {
    name: "Contact Us"
  },
  {
    name: "Shipping"
  },
  {
    name: "Live chat"
  }
];

//
const ulStyle = {
  textAlign: "left",
  listStyleType: "none", // No bullets
  padding: 0 // Remove default padding
};

const liStyle = {
  marginBottom: "4px",
  fontSize: "1rem",
  lineHeight: "1.5rem",

  cursor: "pointer",
  textDecoration: "none",
  fontWeight: "bold"
};

const HoverLink = ({ to, children }) => {
  const [hover, setHover] = useState(false);

  const style = {
    fontSize: "1rem",
    lineHeight: "1.5rem",
    color: hover ? "#FFDCA4" : "inherit", // Change color on hover
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: "bold"
  };

  return (
    <Link
      to={to}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </Link>
  );
};

const AppFooter = () => {
  const [hover, setHover] = useState(false);
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const subscribeMutation = useMutation({
    mutationFn: postEventSubscriber,
    onSuccess: () => {
      setIsLoading(false);
      toast.success("Subscribed Successfully");
    },
    onError: (error) => {
      setIsLoading(false);
      error?.response?.data?.message
        ? toast.error(error?.response?.data?.message)
        : !error?.response
        ? toast.warning("Check Your Internet Connection Please")
        : toast.error("An Error Occurred Please Contact Admin");
      console.log("Subscription error: ", error);
    }
  });

  const handleSubscribe = () => {
    if (email) {
      setIsLoading(true);
      subscribeMutation.mutate(email);
    } else {
      toast.warning("Email is required to subscribe");
    }
  };

  return (
    <Card>
      <div
      // style={{
      //   color: "white",
      //   background: "#7474BF" /* Fallback for older browsers */,
      //   backgroundImage:
      //     "linear-gradient(to right, #348AC7, #7474BF)" /* Modern browsers */
      // }}
      >
        <div
          style={{
            padding: "1rem", // Reduced padding for smaller screens
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center", // Center-align items
            // backgroundColor: "#FFDCA4",
            color: "white",
            gap: "1rem", // Add gap between elements for better spacing
            justifyContent: "space-between",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(7.5px)",
            webkitBackdropFilter: "blur(7.5px)",
            // boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.18)",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            zIndex: 4
          }}
        >
          <h1
            style={{
              marginBottom: "1rem", // Adjust margin
              fontSize: "1.5rem", // Adjust font size for smaller screens
              fontWeight: "600",
              color: "white"
            }}
          >
            <span style={{ color: "#0105FF" }}>Subscribe</span>{" "}
            <span style={{ color: "#4DFF07" }}>To our Car</span>
            <span style={{ color: "#FFB701" }}> Collection</span> to get news,
            events & offers
          </h1>

          <div
            style={{
              position: "relative"
            }}
          >
            <React.Fragment>
              <div className="p-inputgroup" style={{ flex: "1 1 300px" }}>
                <InputText
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%" }}
                />
                {/* <Button icon="pi pi-search" style={{}} /> */}
                <Button
                  icon={isLoading ? null : "pi pi-send"}
                  onClick={handleSubscribe}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ProgressSpinner
                      style={{ width: "20px", height: "20px" }}
                      strokeWidth="8"
                    />
                  ) : null}
                </Button>
              </div>
            </React.Fragment>
          </div>
        </div>

        {/*=================================== next ====================================*/}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",

            gap: "24px",
            padding: "10px 20px 64px 20px",
            textAlign: "center",
            justifyContent: "space-around" // Distributes space around items
          }}
        >
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
              maxWidth: "300px"
            }}
          >
            <img
              src="/assets/cars/mycarclassicgold.png"
              alt="logo/image"
              style={{ width: "40%" }}
            />
            <p
              style={{
                marginTop: "12px",
                fontSize: "2rem",

                cursor: "pointer",
                textDecoration: "none", // Apply text-decoration: none for links
                fontWeight: "bold" // Apply font-weight for emphasis (optional)
              }}
            >
              Unleash Your Dream Ride
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "15px"
              }}
            >
              <a href="https://web.facebook.com/rahi680/" target="_blank">
                <i
                  className="pi pi-facebook"
                  style={{ fontSize: "25px", cursor: "pointer" }}
                ></i>
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                style={{ marginLeft: "15px" }}
              >
                <i
                  className="pi pi-twitter"
                  style={{ fontSize: "25px", cursor: "pointer" }}
                ></i>
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                style={{ marginLeft: "15px" }}
              >
                <i
                  className="pi pi-instagram"
                  style={{ fontSize: "25px", cursor: "pointer" }}
                ></i>
              </a>
            </div>
          </ul>

          <ul style={ulStyle}>
            <h1
              style={{
                marginBottom: "4px",
                fontWeight: "600",
                color: "#0105FF"
              }}
            >
              Company
            </h1>
            {footerCompanyLinks?.map((link) => (
              <li key={link.name} style={liStyle}>
                <HoverLink to={link.link}>{link.name}</HoverLink>
              </li>
            ))}
          </ul>

          <ul style={ulStyle}>
            <h1
              style={{
                marginBottom: "4px",
                fontWeight: "600",
                color: "#4DFF07"
              }}
            >
              Shop
            </h1>
            {footerProductLinks?.map((link) => (
              <li key={link.name} style={liStyle}>
                <HoverLink to={link.link}>{link.name}</HoverLink>
              </li>
            ))}
          </ul>

          <ul style={ulStyle}>
            <h1
              style={{
                marginBottom: "4px",
                fontWeight: "600",
                color: "#FFB701"
              }}
            >
              Support
            </h1>
            {footerSupportLinks?.map((link) => (
              <li key={link.name} style={liStyle}>
                <HoverLink to={link.link}>{link.name}</HoverLink>
              </li>
            ))}
          </ul>
        </div>
        {/*====================================== next ==============================*/}
        <div
          style={{
            display: "flex",
            flexDirection: "column", // Stack children vertically
            gap: "40px",
            paddingTop: "8px",
            paddingBottom: "32px",
            textAlign: "center"
          }}
        >
          <span>
            &copy; {new Date().getFullYear()}{" "}
            <span
              style={{
                color: "#342ac8",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              MYCAR
            </span>{" "}
            . all rights reserved.
          </span>

          <span>
            Terms <sup style={{ fontWeight: "800" }}>.</sup> privacy policy
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img
              src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
              alt="Payment Methods"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppFooter;
