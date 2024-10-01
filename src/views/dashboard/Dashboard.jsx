import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AppTopbar from "../../AppTopbar";
import CarouselContainer from "./components/CarouselContainer";
import ProductTypes from "./components/ProductTypes";
import AppFooter from "../../AppFooter";
import ServiceOfferings from "./components/ServiceOfferings";
import FeaturedProducts from "./components/FeaturedProducts";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Define animation variants for visibility transitions
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const variant = {
    visible: { scale: 1 },
    hidden: { scale: 0 }
  };

  return (
    <div style={{ width: "100%" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        variants={variants}
      >
        <CarouselContainer />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
        variants={variants}
      >
        <ServiceOfferings />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        variants={variants}
      >
        <ProductTypes />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        variants={variants}
      >
        <FeaturedProducts />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        variants={variants}
      >
        <AppFooter />
      </motion.div>
    </div>
  );
};

export default Dashboard;
