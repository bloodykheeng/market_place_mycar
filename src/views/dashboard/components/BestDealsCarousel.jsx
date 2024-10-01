import React, { useState } from "react";
import { Carousel } from "primereact/carousel";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const BestDealsCarousel = () => {
  const [imageDialog, setImageDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const responsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: "768px",
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: "560px",
      numVisible: 1,
      numScroll: 1
    }
  ];

  const productTemplate = (product) => {
    return (
      <div
        style={{
          maxWidth: "300px",
          margin: "0.5em",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: "4px",
          overflow: "hidden"
        }}
      >
        <img
          src={product.photos[0]}
          alt={product.name}
          style={{ width: "100%", cursor: "pointer", marginBottom: "10px" }}
          onClick={() => {
            setSelectedProduct(product);
            setImageDialog(true);
          }}
        />
        <div style={{ padding: "1rem" }}>
          <h3>{product.name}</h3>
          <h4>${product.price}</h4>
          <Button
            icon="pi pi-shopping-cart"
            className="p-button-rounded p-button-outlined"
          />
          <Button
            icon="pi pi-eye"
            className="p-button-rounded p-button-outlined"
            onClick={() => console.log(product)}
          />
          <p>{product.sold} sold</p>
        </div>
      </div>
    );
  };

  const imageTemplate = (image) => {
    return (
      <img src={image} alt={selectedProduct.name} style={{ width: "100%" }} />
    );
  };

  const deals = [
    // Your deals array with photos key...
    // Example product with multiple photos:
    {
      name: "Lenovo Tab P10",
      price: 2099,
      oldPrice: 3490,
      rating: 4,
      sold: 321,
      photos: [
        "/assets/sample-cars/AutoWallpaper_300083.jpg",
        "/assets/sample-cars/AutoWallpaper_300084.jpg"
        // ... more photos
      ]
    }
    // ... other products
  ];

  return (
    <div>
      <Carousel
        value={deals}
        numVisible={3}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={productTemplate}
        header={<h2>Best Deals</h2>}
        circular
        autoplayInterval={3000}
      />
      {selectedProduct && (
        <Dialog
          visible={imageDialog}
          onHide={() => setImageDialog(false)}
          style={{ width: "auto", maxWidth: "80vw", backgroundColor: "white" }}
          modal
          showHeader={false}
          dismissableMask
        >
          <Carousel
            value={selectedProduct.photos}
            itemTemplate={imageTemplate}
          />
        </Dialog>
      )}
    </div>
  );
};

export default BestDealsCarousel;
