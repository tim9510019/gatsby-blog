import React, { useRef } from "react";
import { createClient } from "contentful-management";

const CMA_TOKEN = process.env.CONTENTFUL_CMA_TOKEN;

const Upload = () => {
  const inputRef = useRef(null);
  const handleUpload = async () => {
    const file = inputRef.current.files[0];
    console.log(file);
    console.log(CMA_TOKEN);
    const client = createClient({
      accessToken: CMA_TOKEN,
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
  return (
    <div>
      <input type="file" ref={inputRef} />
      <button className="px-2 py-1 border-2" onClick={handleUpload}>
        上傳檔案
      </button>
    </div>
  );
};

export default Upload;
