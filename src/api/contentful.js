import * as contentful from "contentful-management";

export default async function Post(req, res) {
  const { text } = req.body;
  console.log(text);
}
