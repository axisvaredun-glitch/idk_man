export default async function handler(req: any, res: any) {
  const { body } = req;
  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body,
  });
  const data = await response.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(data);
}