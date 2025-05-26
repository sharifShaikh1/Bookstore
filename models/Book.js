const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  publishDate: {
    type: Date,
    required: true
  }
});

// ✅ Virtual to format the publishDate
bookSchema.virtual('formattedDate').get(function () {
  const date = this.publishDate;
  return date.toLocaleDateString('en-GB'); // dd/mm/yyyy format
});

// Ensure virtuals are included in JSON output
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
