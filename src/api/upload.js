import { createClient } from "contentful-management";

export default async function upload(req, res) {
  console.log(req.files[0]);
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
          "en-US": file.originalname,
        },
        description: {
          "en-US": "Back",
        },
        file: {
          "en-US": {
            contentType: file.mimetype,
            fileName: file.fieldname,
            file: file.buffer,
          },
        },
      },
    });
    const processedAsset = await asset.processForAllLocales();
    await processedAsset.publish();
    console.log("測試成功");
    res.send("成功上傳");
  } catch (error) {
    console.log(error);
    res.send("上傳失敗");
  }
}
