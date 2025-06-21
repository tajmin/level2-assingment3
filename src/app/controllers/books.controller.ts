import express, { Request, Response } from "express";
import { z } from "zod";
import { Genre } from "../interfaces/books.interface";
import { BookModel } from "../models/books.model";
import { Types } from "mongoose";

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

/**
 * Create book
 * method: POST
 */
bookRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const validatedData = CreateBookZodSchema.parse(req.body);
    const book = await BookModel.create(validatedData);

    res.status(201).json({
      succcess: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * Return books
 * method: GET
 */
bookRoutes.get("/", async (req: Request, res: Response) => {
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

    res.status(201).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * Get book
 * method: GET
 */
bookRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;

    // if (!Types.ObjectId.isValid(bookId)) {
    //   res.status(400).json({
    //     success: false,
    //     message: "Invalid book ID format",
    //   });
    // }

    const book = await BookModel.findById(bookId);

    // if (!book) {
    //   res.status(404).json({
    //     success: false,
    //     message: "Book not found",
    //   });
    // }

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * Delete book
 * method: DELETE
 */
bookRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const book = await BookModel.findByIdAndDelete(bookId);

    res.status(201).json({
      success: true,
      message: "Book deleted successfully",
      data: book,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * Update book
 * method: PATCH
 */
bookRoutes.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const updatedBody = req.body;

    const updatedBook = await BookModel.findByIdAndUpdate(bookId, updatedBody, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {}
});
