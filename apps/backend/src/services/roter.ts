import express from "express";

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});

apiRouter.use((req, res) => {
  const error = new Error("Not found");

  res.status(404).json({
    message: error.message,
  });
});

export { apiRouter };
