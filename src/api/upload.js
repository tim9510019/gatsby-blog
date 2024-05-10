import { createClient } from "contentful-management";

export default async function upload(req, res) {
  const file = req.files[0];
  const client = createClient({
    accessToken: process.env.CONTENTFUL_CMA_TOKEN,
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
  res.send("連接upload成功");
}
