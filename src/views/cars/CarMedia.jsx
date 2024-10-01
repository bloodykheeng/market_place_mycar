import React from "react";
import { ProgressBar } from "primereact/progressbar";
import { Image } from "primereact/image";
import { Galleria } from "primereact/galleria";
import { Carousel } from "primereact/carousel";
import { Panel } from "primereact/panel";

function CarMedia({ selectedProduct }) {
  //

  const mediaStyle = {
    height: "300px", // Fixed height for all media containers
    width: "100%", // Full width within its parent container
    marginBottom: "1rem",
    overflow: "hidden", // Prevents overflow if media is larger than the container
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative" // Needed for proper positioning of the media
  };

  const imageStyle = {
    width: "auto",
    height: "100%",
    objectFit: "cover" // Cover the area of the div without distorting aspect ratio
  };

  const videoStyle = {
    width: "100%", // Ensure video fills the container width
    height: "100%", // Ensure video fills the container height
    objectFit: "cover" // Cover the area of the div without distorting aspect ratio
  };

  //=============== Galleria ============================

  const itemTemplate = (item) => {
    return (
      <img
        src={`${process.env.REACT_APP_API_BASE_URL}${item.photo_url}`}
        alt={item.caption}
        style={{ width: "100%" }}
      />
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img
        src={`${process.env.REACT_APP_API_BASE_URL}${item.photo_url}`}
        alt={item.caption}
        style={{ width: "80px", height: "56px" }}
      />
    );
  };

  const videoItemTemplate = (video) => {
    return (
      <div>
        <video controls style={{ width: "100%", maxHeight: "100%" }}>
          <source
            src={`${process.env.REACT_APP_API_BASE_URL}${video.video_url}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <p>{video.caption}</p>
      </div>
    );
  };

  // Define responsive options if needed
  const galleriaResponsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 5
    },
    {
      breakpoint: "768px",
      numVisible: 3
    },
    {
      breakpoint: "560px",
      numVisible: 1
    }
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}
    >
      <Panel header="Photos">
        <center>
          {selectedProduct?.photos && selectedProduct?.photos.length > 0 ? (
            <Galleria
              value={selectedProduct?.photos}
              responsiveOptions={galleriaResponsiveOptions}
              numVisible={5}
              circular
              autoPlay
              transitionInterval={3000}
              item={itemTemplate}
              thumbnail={thumbnailTemplate}
              style={{ maxWidth: "640px" }}
            />
          ) : (
            <p>No photos available.</p>
          )}
        </center>
      </Panel>
      <Panel header="Videos">
        <center>
          {" "}
          {selectedProduct?.videos && selectedProduct?.videos.length > 0 ? (
            <Carousel
              value={selectedProduct.videos}
              numVisible={3}
              numScroll={1}
              itemTemplate={videoItemTemplate}
            />
          ) : (
            <p>No videos available.</p>
          )}
        </center>
      </Panel>
    </div>
  );
}

export default CarMedia;
