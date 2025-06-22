import express, { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { Genre } from "../interfaces/books.interface";
import { BookModel } from "../models/books.model";
import { createError } from "../utils/error.utils";

export const bookRoutes = express.Router();

export const CreateBookZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genre: z.nativeEnum(Genre, {
    errorMap: () => ({ message: "Invalid genre selection" }),
  }),
  isbn: z
    .string()
    .min(10, "ISBN must be at least 10 characters")
    .regex(/^[0-9-]+$/, "ISBN must contain only numbers and hyphens"),
  description: z.string().optional(),
  copies: z.number().int().nonnegative("Copies must be a positive integer"),
  available: z.boolean().optional().default(true),
});

bookRoutes.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = CreateBookZodSchema.parse(req.body);
      const book = await BookModel.create(validatedData);

      res.status(201).json({
        succcess: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(createError(400, "Validation failed", error.errors));
      }
      next(error);
    }
  }
);

bookRoutes.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filter, sortBy, sort, limit } = req.query;

    const filterCondition = filter ? { genre: filter } : {};
    const sortCondition: Record<string, 1 | -1> = {};

    if (sortBy) {
      if (sort === "desc") {
        sortCondition[sortBy.toString()] = -1;
      } else {
        sortCondition[sortBy.toString()] = 1; // Default ascending
      }
    }

    const books = await BookModel.find(filterCondition)
      .sort(sortCondition)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    next(error);
  }
});

bookRoutes.get(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;

      if (!Types.ObjectId.isValid(bookId)) {
        throw createError(400, "Invalid book ID format");
      }

      const book = await BookModel.findById(bookId);

      if (!book) {
        throw createError(404, "Book not found");
      }

      res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);

bookRoutes.delete(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;

      if (!Types.ObjectId.isValid(bookId)) {
        throw createError(400, "Invalid book ID format");
      }

      const book = await BookModel.findByIdAndDelete(bookId);

      if (!book) {
        throw createError(404, "Book not found");
      }

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
);

bookRoutes.put(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;
      const updatedBody = req.body;

      if (!Types.ObjectId.isValid(bookId)) {
        throw createError(400, "Invalid book ID format");
      }

      if (Object.keys(updatedBody).length === 0) {
        throw createError(400, "No fields to update");
      }

      const updatedBook = await BookModel.findByIdAndUpdate(
        bookId,
        updatedBody,
        {
          new: true,
        }
      );

      if (!updatedBook) {
        throw createError(404, "Book not found");
      }

      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
      });
    } catch (error) {
      next(error);
    }
  }
);
