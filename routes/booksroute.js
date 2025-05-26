const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /books - Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();

    // Convert Mongoose docs to plain objects with virtuals
    const formattedBooks = books.map(book => book.toJSON());

    res.status(200).json(formattedBooks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// POST /books - Create a new book
router.post('/', async (req, res) => {
  try {
    const { title, price, author, publishDate } = req.body;

    // Validate required fields
    if (!title || !price || !author || !publishDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const book = new Book({
      title,
      price,
      author,
      publishDate: new Date(publishDate)
    });

    const savedBook = await book.save();

    // Send JSON with virtuals included
    res.status(201).json(savedBook.toJSON());
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
});

// PUT /books/:id - Update a book by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, author, publishDate } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, price, author, publishDate: new Date(publishDate) },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(updatedBook.toJSON());
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
});

// DELETE /books/:id - Delete a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
});

module.exports = router;
