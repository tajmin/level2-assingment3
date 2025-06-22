import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrows.interface";
import { BookModel } from "./books.model";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quanitity is a required field"],
      min: [1, "Quantity must be a positive number"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
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
  if (!book) {
    throw new Error("Book not found");
  }

  if (book.copies < this.quantity) {
    throw new Error("Not enough copies available");
  }

  book.copies -= this.quantity;
  await book.save();
  next();
});

export const BorrowModel = model<IBorrow>("Borrow", borrowSchema);
