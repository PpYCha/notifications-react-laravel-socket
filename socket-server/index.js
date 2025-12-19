import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("HELLO WORLD FROM HOSTINGER");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Running on port", PORT);
});
