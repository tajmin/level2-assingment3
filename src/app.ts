import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/controllers/books.controller";

const app: Application = express();

app.use(express.json());

app.use("/api/books", bookRoutes);
// app.use("/users", usersRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Library");
});

export default app;
