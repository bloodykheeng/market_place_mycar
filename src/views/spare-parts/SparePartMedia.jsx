import React from "react";
import { ProgressBar } from "primereact/progressbar";
import { Image } from "primereact/image";

import { Panel } from "primereact/panel";

function SparePartMedia({ selectedProduct }) {
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
      <Panel header="Photo">
        <center>
          {selectedProduct?.photo_url ? (
            <div className="card flex justify-content-center">
              <Image
                src={`${process.env.REACT_APP_API_BASE_URL}${selectedProduct?.photo_url}`}
                alt="Image"
                width="250"
                preview
              />
            </div>
          ) : (
            <p>No photo available.</p>
          )}
        </center>
      </Panel>
    </div>
  );
}

export default SparePartMedia;
