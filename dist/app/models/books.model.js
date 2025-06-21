"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookModel = void 0;
const mongoose_1 = require("mongoose");
const books_interface_1 = require("../interfaces/books.interface");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true },
    genre: {
        type: String,
        enum: Object.values(books_interface_1.Genre),
        required: true,
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String, maxlength: 500 }, // character limit to enforce data validation
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
}, {
    versionKey: false,
    timestamps: true,
});
exports.BookModel = (0, mongoose_1.model)("Book", bookSchema);
