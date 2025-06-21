"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookZodSchema = exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const books_interface_1 = require("../interfaces/books.interface");
const books_model_1 = require("../models/books.model");
exports.bookRoutes = express_1.default.Router();
exports.CreateBookZodSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    author: zod_1.z.string().min(1, "Author is required"),
    genre: zod_1.z.nativeEnum(books_interface_1.Genre, {
        errorMap: () => ({ message: "Invalid genre selection" }),
    }),
    isbn: zod_1.z
        .string()
        .min(10, "ISBN must be at least 10 characters")
        .regex(/^[0-9-]+$/, "ISBN must contain only numbers and hyphens"),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().int().nonnegative("Copies must be a positive integer"),
    available: zod_1.z.boolean().optional().default(true),
});
/**
 * Create book
 * method: POST
 */
exports.bookRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = exports.CreateBookZodSchema.parse(req.body);
        const book = yield books_model_1.BookModel.create(validatedData);
        res.status(201).json({
            succcess: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        console.log(error);
    }
}));
/**
 * Return books
 * method: GET
 */
exports.bookRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy, sort, limit } = req.query;
        const filterCondition = filter ? { genre: filter } : {};
        const sortCondition = {};
        if (sortBy) {
            if (sort === "desc") {
                sortCondition[sortBy.toString()] = -1;
            }
            else {
                sortCondition[sortBy.toString()] = 1; // Default ascending
            }
        }
        const books = yield books_model_1.BookModel.find(filterCondition)
            .sort(sortCondition)
            .limit(Number(limit));
        res.status(201).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        console.log(error);
    }
}));
/**
 * Get book
 * method: GET
 */
exports.bookRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        // if (!Types.ObjectId.isValid(bookId)) {
        //   res.status(400).json({
        //     success: false,
        //     message: "Invalid book ID format",
        //   });
        // }
        const book = yield books_model_1.BookModel.findById(bookId);
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
    }
    catch (error) {
        console.log(error);
    }
}));
/**
 * Delete book
 * method: DELETE
 */
exports.bookRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield books_model_1.BookModel.findByIdAndDelete(bookId);
        res.status(201).json({
            success: true,
            message: "Book deleted successfully",
            data: book,
        });
    }
    catch (error) {
        console.log(error);
    }
}));
/**
 * Update book
 * method: PATCH
 */
exports.bookRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updatedBody = req.body;
        const updatedBook = yield books_model_1.BookModel.findByIdAndUpdate(bookId, updatedBody, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
        });
    }
    catch (error) { }
}));
