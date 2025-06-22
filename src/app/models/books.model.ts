import { model, Schema, Types } from "mongoose";
import { BookStaticMethods, Genre, IBook } from "../interfaces/books.interface";
import { createError } from "../utils/error.utils";

const bookSchema = new Schema<IBook, BookStaticMethods>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true },
    genre: {
      type: String,
      enum: Object.values(Genre),
      required: true,
    },
    isbn: { type: String, required: true, unique: true },
    description: { type: String, maxlength: 500 },
    copies: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bookSchema.statics.updateAvailability = async function (
  bookId: Types.ObjectId
) {
  const book = await this.findById(bookId);
  if (!book) throw createError(404, "Book not found");

  book.available = book.copies > 0;
  await book.save();
  return book;
};

export const BookModel = model<IBook, BookStaticMethods>("Book", bookSchema);
