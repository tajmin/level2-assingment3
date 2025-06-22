import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrows.interface";
import { BookModel } from "./books.model";
import { createError } from "../utils/error.utils";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: IBorrow, date: Date) {
          return date > new Date();
        },
        message: "Due date must be in the future",
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

borrowSchema.pre("save", async function (next) {
  const book = await BookModel.findById(this.book);
  if (!book) throw createError(404, "Book not found");

  if (book.copies < this.quantity) {
    throw createError(400, `Only ${book.copies} copies available`);
  }

  book.copies -= this.quantity;
  await book.save();
  next();
});

export const BorrowModel = model<IBorrow>("Borrow", borrowSchema);
