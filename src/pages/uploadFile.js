import React, { useRef } from "react";
import { createClient } from "contentful-management";
import axios from "axios";

const Upload = () => {
  const inputRef = useRef(null);
  const handleUpload = async () => {
    const file = inputRef.current.files[0];
    const client = createClient({
      accessToken: "CFPAT-HUff-EDrdIbTmXX4JsJIhRoSVgePgQZXtR3IYr9As40",
    });
    try {
      const space = await client.getSpace("zu7mvllbia1d");
      const environment = await space.getEnvironment("master");
      const asset = await environment.createAssetFromFiles({
        fields: {
          title: {
            "en-US": file.name,
          },
          description: {
            "en-US": file.name,
          },
          file: {
            "en-US": {
              contentType: file.type,
              fileName: file.name,
              file: file,
            },
          },
        },
      });
      const processedAsset = await asset.processForAllLocales();
      await processedAsset.publish();
      console.log("測試成功");
    } catch (error) {
      console.log(error);
    }
  };
  const handleUploadBackend = async () => {
    const file = inputRef.current.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/api/upload", formData);
    console.log(res);
  };
  return (
    <div>
      <input type="file" ref={inputRef} />
      <button className="px-2 py-1 border-2" onClick={handleUpload}>
        從前端上傳檔案
      </button>
      <button className="px-2 py-1 border-2" onClick={handleUploadBackend}>
        上傳檔案至後端
      </button>
    </div>
  );
};

export default Upload;
