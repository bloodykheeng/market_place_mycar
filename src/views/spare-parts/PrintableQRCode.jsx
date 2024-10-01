import React from "react";
import QRCode from "react-qr-code";

const PrintableQRCode = React.forwardRef(({ value }, ref) => {
  const qrCodeContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // height: "100vh", // Full height of the viewport
    // width: "100%", // Full width of the container
    padding: "20px",
    // backgroundColor: "#ffffff",
    // border: "1px solid #000",
    boxSizing: "border-box"
  };

  return (
    <div ref={ref} style={qrCodeContainerStyle}>
      <QRCode value={value} size={256} />
    </div>
  );
});

export default PrintableQRCode;
