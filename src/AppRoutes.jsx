import React, { lazy, Suspense, useState } from "react";

//==================== my  routes ====================
// import NewUsersPage from "./views/users/UserPage";

// ============ Customm component routes ========================
const DashboardPage = lazy(() => import("./views/dashboard/Dashboard"));
const CarDetailPage = lazy(() => import("./views/cars/CarDetailPage"));
const CarListingsPage = lazy(() => import("./views/cars/CarListingsPage"));

const SparePartDetailPage = lazy(() =>
  import("./views/spare-parts/SparePartDetailPage")
);
const SparePartListingsPage = lazy(() =>
  import("./views/spare-parts/SparePartListingsPage")
);
const LoginPage = lazy(() => import("./views/Auth/Login"));
const ResetPasswordPage = lazy(() => import("./views/Auth/ResetPassword"));
const SignUpPage = lazy(() => import("./views/Auth/SignUp"));

const FAQPage = lazy(() => import("./views/Faq/FAQPage"));

const GarageList = lazy(() => import("./views/garage/GaragePage"));
const MotorThirdPartyPage = lazy(() =>
  import("./views/motor-third-party/MotorThirdPartyPage")
);
const ProfilePage = lazy(() => import("./views/profile/ProfilePage"));
const CarViewPage = lazy(() => import("./views/profile/cars/CarsViewPage"));
const CheckOutPage = lazy(() => import("./views/checkout/CheckOutPage"));
const UserProductsPage = lazy(() => import("./views/profile/UserProductsPage"));

const CarInspectors = lazy(() =>
  import("./views/car-inspectors/CarInspectorsPage")
);

const GarageDetailsPage = lazy(() =>
  import("./views/garage/GarageDetailsPage")
);

const CarInspectorDetailsPage = lazy(() =>
  import("./views/car-inspectors/CarInspectorDetailsPage")
);

function AppRoutes() {
  const privateDefaultRoutes = [
    {
      path: "/login",
      name: "login",
      element: LoginPage,
      layout: "/private"
    },
    {
      path: "/reset-password",
      name: "reset-password",
      element: ResetPasswordPage,
      layout: "/private"
    },

    {
      path: "/sign-up",
      name: "sign-up",
      element: SignUpPage,
      layout: "/private"
    },
    {
      path: "/",
      name: "dashboard",
      element: DashboardPage, // Replace with the actual component
      layout: "/private"
    },
    {
      path: "/profile",
      name: "profile",
      element: ProfilePage,
      layout: "/private"
    },
    {
      path: "/profile/products",
      name: "profile/products",
      element: UserProductsPage,
      layout: "/private"
    },
    {
      path: "/profile/products/car",
      name: "/profile/products/car",
      element: CarViewPage,
      layout: "/admin"
    },
    {
      path: "/car/detail/:slug",
      element: CarDetailPage
    },
    {
      path: "/car/listings/:car_type?",
      element: CarListingsPage
    },
    {
      path: "/spare/listings/:slug?",
      element: SparePartListingsPage
    },
    {
      path: "/spare/detail/:slug",
      element: SparePartDetailPage
    },
    {
      path: "/faq",
      element: FAQPage
    },
    {
      path: "/garage",
      element: GarageList
    },
    {
      path: "/garage/:slug",
      element: GarageDetailsPage
    },
    {
      path: "/motor",
      element: MotorThirdPartyPage
    },
    {
      path: "/checkout",
      element: CheckOutPage
    },
    {
      path: "/inspectors",
      element: CarInspectors
    },
    {
      path: "/inspectors/:slug",
      element: CarInspectorDetailsPage
    }
  ];

  const [privateRoutes, setPrivateRoutes] = useState(privateDefaultRoutes);

  return privateRoutes;
}

export default AppRoutes;
