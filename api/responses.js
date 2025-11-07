export default function handler(req, res) {
  if (req.method === "POST") {
    const { category, text } = req.body;
    // Do something with input
    res.status(200).json({ message: "Success", category, text });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
