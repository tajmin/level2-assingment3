import express, { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { BorrowModel } from "../models/borrows.model";
import { BookModel } from "../models/books.model";
import { createError } from "../utils/error.utils";

export const borrowRoutes = express.Router();

export const CreateBorrowZodSchema = z.object({
  book: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid book ID format",
  }),
  quantity: z
    .number()
    .int("Quantity must be an number")
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

borrowRoutes.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
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
      if (error instanceof z.ZodError) {
        return next(createError(400, "Validation failed", error.errors));
      }
      next(error);
    }
  }
);

borrowRoutes.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const borrowSummary = await BorrowModel.aggregate([
        {
          $lookup: {
            from: "books",
            localField: "book",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        {
          $unwind: "$bookDetails",
        },
        {
          $group: {
            _id: "$book",
            totalQuantity: { $sum: "$quantity" },
            book: {
              $first: {
                title: "$bookDetails.title",
                isbn: "$bookDetails.isbn",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            book: 1,
            totalQuantity: 1,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        message: "Borrowed books summary retrieved successfully",
        data: borrowSummary,
      });
    } catch (error) {
      next(error);
    }
  }
);
