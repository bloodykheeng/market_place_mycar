import React, { useState, useEffect } from "react";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Dropdown } from "primereact/dropdown";
import { Avatar } from "primereact/avatar";

import {
  FaHome,
  FaStar,
  FaCar,
  FaWrench,
  FaQuestionCircle,
  FaShoppingCart,
  FaUser,
  FaShieldAlt,
  FaWarehouse,
  FaClipboardCheck
} from "react-icons/fa";

//
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";
import { getAllCarTypes } from "./services/cars/car-types-service";
import { useLocation } from "react-router-dom";
import CartSidebar from "./CartSidebar";

//
import useAuthContext from "./context/AuthContext";
import { Badge } from "primereact/badge";
import { useCarCart } from "./context/CarCartContext";
import { useSparePartsCart } from "./context/SparePartsCartContext";
import { useTheme } from "./context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const AppTopbar = () => {
  const [cartVisible, setCartVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [productsItems, setProductsItems] = useState([]);
  const { getUserQuery, logout, logoutMutation } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const activeClassForRoutes =
    theme === "dark" ? `my-p-menuitem-active-dark` : `my-p-menuitem-active`;

  const { carCartItems, isPostToSyncCarCartMutationLoading } = useCarCart();

  const { sparePartsCartItems, isPostToSyncSpareCartLoading } =
    useSparePartsCart();
  console.log("isPostToSyncSpareCartLoading : ", isPostToSyncSpareCartLoading);
  console.log(
    "isPostToSyncCarCartMutationLoading : ",
    isPostToSyncCarCartMutationLoading
  );
  // Calculate the total number of items in the cart
  const totalItems =
    carCartItems.reduce((sum, item) => sum + item.selected_quantity, 0) +
    sparePartsCartItems.reduce((sum, item) => sum + item.selected_quantity, 0);

  console.log("getUserQuery is : ", getUserQuery);
  const location = useLocation();

  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product-types"],
    queryFn: getAllCarTypes
  });

  if (isError) {
    console.log("Error fetching getAllCarTypes:", error);
    toast.error(
      error?.response?.data?.message || "An Error Occurred Please Contact Admin"
    );
    return null;
  }

  // Use location to update active item
  const getMenuItemStyle = (path) => {
    return location.pathname === path ? { backgroundColor: "#ccc" } : {};
  };

  const items = [
    {
      label: "Home",
      icon: (
        <FaHome size={20} style={{ color: "gold", marginRight: "0.5rem" }} />
      ), // Use FontAwesome icon
      className: location.pathname === "/" ? activeClassForRoutes : "",
      command: () => {
        navigate("/");
      }
    },
    // {
    //   label: "Best Selling",
    //   icon: <FaStar size={20} style={{ color: "gold" }} />, // Example for Best Selling
    //   command: () => {
    //     /* Navigate to best selling */
    //   }
    // },
    {
      label: "Cars",
      icon: (
        <FaCar size={20} style={{ color: "#0105FF", marginRight: "0.5rem" }} />
      ), // Use FontAwesome icon
      style: { color: "green" }, // Keep color styling
      // items: productsItems
      className: location.pathname.startsWith("/car")
        ? activeClassForRoutes
        : "",
      command: () => {
        navigate("/car/listings");
      }
    },

    {
      label: "Spare Parts",
      icon: (
        <FaWrench
          size={20}
          style={{ color: "#4DFF07", marginRight: "0.5rem" }}
        />
      ),
      className: location.pathname.startsWith("/spare")
        ? activeClassForRoutes
        : "",
      command: () => {
        navigate("/spare/listings");
      }
      // items: [
      //   {
      //     label: "New",
      //     icon: "pi pi-fw pi-circle-on",
      //     style: { color: "green" }
      //   },
      //   {
      //     label: "Used",
      //     icon: "pi pi-fw pi-circle-off",
      //     style: { color: "orange" }
      //   }
      // ]
    },
    {
      label: "Garage",
      // Customize color
      icon: (
        <FaWarehouse
          size={20}
          style={{ color: "silk", marginRight: "0.5rem" }}
        />
      ),
      className: location.pathname.startsWith("/garage") // Adjust path prefix (optional)
        ? activeClassForRoutes
        : "",
      command: () => {
        navigate("/garage"); // Assuming your garage page path
      }
    },
    {
      label: "Motors (3rd Party)",
      // Customize icon for motors category
      // Example using FaCog
      icon: (
        <FaShieldAlt
          size={20}
          style={{ color: "#FF9900", marginRight: "0.5rem" }}
        />
      ),
      className: location.pathname.startsWith("/motor") // Adjust path prefix
        ? activeClassForRoutes
        : "",
      command: () => {
        navigate("/motor"); // Assuming your motors listings path
      }
    },
    {
      label: "Car Inspectors",
      icon: (
        <FaClipboardCheck
          size={20}
          style={{ color: "#FF5733", marginRight: "0.5rem" }}
        />
      ), // Use FontAwesome icon for Car Inspectors
      className: location.pathname.startsWith("/inspectors")
        ? activeClassForRoutes
        : "",
      command: () => {
        navigate("/inspectors");
      }
    },
    {
      label: "FAQ",
      icon: (
        <FaQuestionCircle
          size={20}
          style={{ color: "violet", marginRight: "0.5rem" }}
        />
      ),
      className: location.pathname.startsWith("/faq")
        ? activeClassForRoutes
        : "",
      style: { color: "violet" }, // Keep color styling
      command: () => {
        navigate("/faq");
      }
    }
  ];

  const start = (
    <img
      alt="Logo"
      src={`${process.env.PUBLIC_URL}/assets/cars/mycarclassic.png`}
      onError={(e) => (e.target.src = "path_to_default_logo")}
      style={{ height: "50px", marginRight: "10px" }}
    />
  );

  const handleLoginClick = () => {
    navigate("/login"); // Assuming '/login' is your path to the login page
  };
  // const end = (
  //   <React.Fragment>
  //     <Button label="Login" icon="pi pi-user" onClick={handleLoginClick} />
  //   </React.Fragment>
  // );

  let endContent;
  // Show the cart button with a badge
  // const cartButton = (
  //   <span>
  //     <i
  //       className="ml-2 mr-2 pi pi-shopping-cart p-overlay-badge p-button-text"
  //       style={{ cursor: "pointer", fontSize: "1.5rem", color: "#FFB701" }}
  //       onClick={() => setCartVisible(true)}
  //     >
  //       {totalItems > 0 && <Badge value={totalItems.toString()}></Badge>}
  //     </i>
  //   </span>
  // );

  const cartButton = (
    <Button
      className="p-button-text p-button-warning p-button-outlined p-button-sm"
      style={{ minWidth: "auto", cursor: "pointer" }}
      onClick={() => setCartVisible(true)}
      tooltip={totalItems > 0 ? "View Cart" : "Cart is Empty"}
      tooltipOptions={{ position: "bottom" }}
      aria-label="Toggle Cart"
      disabled={
        isPostToSyncSpareCartLoading || isPostToSyncCarCartMutationLoading
      }
    >
      {isPostToSyncSpareCartLoading || isPostToSyncCarCartMutationLoading ? (
        <ProgressSpinner
          style={{ width: "20px", height: "20px" }}
          strokeWidth="8"
        />
      ) : (
        <i
          className="pi pi-shopping-cart p-overlay-badge"
          style={{ fontSize: "1rem" }}
        >
          {totalItems > 0 && (
            <Badge value={totalItems.toString()} severity="danger" />
          )}
        </i>
      )}
    </Button>
  );
  const themeToggleButton = (
    <Button
      style={{ width: "auto" }}
      icon={
        theme === "light" ? (
          <FaMoon
            style={{ cursor: "pointer", width: "1rem", height: "1rem" }}
          />
        ) : (
          <FaSun style={{ cursor: "pointer", width: "1rem", height: "1rem" }} />
        )
      } // Moon for light, sun for dark
      className="p-button-text p-button-outlined p-button-sm"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      // tooltip={
      //   theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
      // }
      // tooltipOptions={{ position: "bottom" }}
    />
  );

  // Determine what buttons to display based on user authentication status
  if (getUserQuery?.isLoading) {
    endContent = (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {themeToggleButton}
        {cartButton}
        <Button
          label="Loading..."
          icon={
            <ProgressSpinner
              style={{ width: "20px", height: "20px" }}
              strokeWidth="8"
            />
          }
          className="p-button-text p-button-outlined p-button-sm"
          disabled
        />
      </div>
    );
  } else if (getUserQuery?.data?.data) {
    endContent = (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {themeToggleButton}
        {cartButton}
        <Button
          severity="success"
          label={getUserQuery?.data?.data?.name}
          icon="pi pi-user"
          className="p-button-text p-button-outlined p-button-sm"
          onClick={() => setProfileVisible(true)} // Assuming setProfileVisible toggles a sidebar or modal
        />
      </div>
    );
  } else {
    endContent = (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {themeToggleButton}
        {cartButton}
        <Button
          className="p-button-text p-button-outlined p-button-sm"
          label="Login"
          icon="pi pi-user"
          onClick={handleLoginClick}
        />
      </div>
    );
  }

  const menubarStyle = {
    position: "sticky",
    top: "0",
    zIndex: "100",
    width: "100%",
    backgroundColor:
      "background-image: linear-gradient(to bottom, #777777 0%, #555555 100%)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px"
  };

  return (
    <React.Fragment>
      <div style={menubarStyle}>
        <Menubar
          className="app-topbar"
          model={items}
          start={start}
          end={endContent}
        />
      </div>
      <Sidebar
        visible={profileVisible}
        position="right"
        onHide={() => setProfileVisible(false)}
        style={{ width: "300px" }}
      >
        <h3 style={{ color: "#4ade80" }}>User Profile</h3>
        <div
          style={{
            padding: "1em",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem"
          }}
        >
          {getUserQuery?.data?.data?.photo_url ? (
            <Avatar
              image={`${process.env.REACT_APP_API_BASE_URL}${getUserQuery?.data?.data.photo_url}`}
              shape="circle"
              size="large"
              className="p-mb-3"
            />
          ) : (
            <Avatar
              icon="pi pi-user"
              shape="circle"
              size="large"
              className="p-mb-3"
              style={{ backgroundColor: "#007ad9", color: "#ffffff" }}
            />
          )}
          <div>
            <strong>Name:</strong> {getUserQuery?.data?.data?.name}
          </div>
          <div>
            <strong>Email:</strong> {getUserQuery?.data?.data?.email}
          </div>
          <div>
            <strong>Role:</strong> {getUserQuery?.data?.data?.role}
          </div>
          <div>
            <strong>Last Login:</strong> {getUserQuery?.data?.data?.lastlogin}
          </div>
          <Button
            severity="success"
            label="view profile"
            icon="pi pi-eye"
            className="p-button-text p-button-outlined p-button-sm"
            onClick={() => {
              navigate("/profile", {
                state: { user_detail: getUserQuery?.data?.data }
              });
              setProfileVisible(false);
            }}
          />

          <Button
            label={logoutMutation.isLoading ? "" : "Logout"}
            icon={
              logoutMutation.isLoading ? (
                <ProgressSpinner
                  style={{ width: "20px", height: "20px" }}
                  strokeWidth="8"
                />
              ) : (
                "pi pi-sign-out"
              )
            }
            className="p-mt-2"
            onClick={() => {
              logoutMutation.mutate();
              setProfileVisible(false);
            }}
            disabled={logoutMutation.isLoading}
          />
        </div>
      </Sidebar>
      <CartSidebar
        visible={cartVisible}
        position="right"
        onHide={() => setCartVisible(false)}
        style={{ width: "300px" }}
      />
    </React.Fragment>
  );
};

export default AppTopbar;
