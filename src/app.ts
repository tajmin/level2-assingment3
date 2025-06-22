import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/controllers/books.controller";
import { borrowRoutes } from "./app/controllers/borrows.controller";

const app: Application = express();

app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Library");
});

export default app;
