import express from "express";

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});

export { apiRouter };
