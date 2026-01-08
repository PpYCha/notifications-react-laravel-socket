import express, { Request, Response } from "express";

const app = express();

// ✅ Use env PORT for hosting, fallback to 3000
const PORT = Number(process.env.PORT) || 3000;

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
