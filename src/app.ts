import express, { Application, NextFunction, Request, Response } from "express";
import { bookRoutes } from "./app/controllers/books.controller";
import { borrowRoutes } from "./app/controllers/borrows.controller";
import { errorMiddleware } from "./app/middlewares/errors.middleware";

const app: Application = express();

app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Library");
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Bad request: route Not found",
    success: false,
    error: {},
  });
});

app.use(errorMiddleware);

export default app;
