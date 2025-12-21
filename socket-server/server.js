const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000; // Hostinger will set PORT

app.get("/", (req, res) => {
  res.send("Hello from Hostinger Node.js app!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
