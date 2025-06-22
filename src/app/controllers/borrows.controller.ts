import express, { Request, Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { BorrowModel } from "../models/borrows.model";
import { BookModel } from "../models/books.model";

export const borrowRoutes = express.Router();

export const CreateBorrowZodSchema = z.object({
  book: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid book ID format",
  }),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be at least 1"),
  dueDate: z
    .string()
    .transform((val) => new Date(val)) // Convert string to Date
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
    .refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    }),
});

borrowRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const validatedData = CreateBorrowZodSchema.parse(req.body);
    const borrow = await BorrowModel.create(validatedData);
    await BookModel.updateAvailability(borrow.book);

    res.status(201).json({
      succcess: true,
      message: "Book borrowed successfully",
      data: borrow,
    });
  } catch (error) {
    console.log(error);
  }
});
