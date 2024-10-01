import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { ColorPicker } from "primereact/colorpicker";
import { Galleria } from "primereact/galleria";

const ProductOverview = () => {
  const productSizes = [
    { label: "Small", value: "S" },
    { label: "Medium", value: "M" },
    { label: "Large", value: "L" }
    // Add more sizes as needed
  ];

  // Replace with product images
  const productImages = [
    {
      itemImageSrc: "path/to/image1.jpg",
      thumbnailImageSrc: "path/to/small/image1.jpg"
    }
    // Add more images as needed
  ];

  // This would be your product object
  const product = {
    title: "Product Title Placeholder",
    price: "$120",
    description: "Product Highlights",
    details: "Some details about the product..."
  };

  return (
    <div className="product-overview">
      <Card>
        <div className="p-grid p-nogutter">
          <div className="p-col-12 p-md-6">
            {/* Image Carousel */}
            <Galleria
              value={productImages}
              responsiveOptions={[]}
              numVisible={5}
              style={{ maxWidth: "640px" }}
            />
          </div>
          <div className="p-col-12 p-md-6">
            <h2>{product.title}</h2>
            <h3>{product.price}</h3>
            <h5>Color</h5>
            {/* Color Picker */}
            <ColorPicker inline />
            <h5>Size</h5>
            {/* Size Selection */}
            <Dropdown options={productSizes} placeholder="Select Size" />
            <Button label="Add to Cart" icon="pi pi-shopping-cart" />
            <p>{product.description}</p>
            <div>{product.details}</div>
            {/* Add more product details as needed */}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductOverview;
