import express from "express";
import cors from "cors";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route (temporary)
app.get("/", (req, res) => {
  res.send("API Running...");
});

export default app;
