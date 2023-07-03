// bookService.js
import { books } from "./book.js";
import  EventBus  from "./eventBus.js";

export const bookService = {
  getAllBooks: () => {
    return books;
  },

  getBookById: (id) => {
    EventBus.publish('getAuthors','bookService')
    return books.find((book) => book.id === id);
  },

  createBook: (title, authorId, categoryId) => {
    const newBook = {
      id: books.length + 1,
      title,
      authorId,
      categoryId
    };
    books.push(newBook);
    EventBus.publish("BookCreated", newBook);
    return newBook;
  },

  updateBook: (id, title, authorId, categoryId) => {
    const book = books.find((book) => book.id === id);
    if (book) {
      book.title = title;
      book.authorId = authorId;
      book.categoryId = categoryId;
      return book;
    }
    return null;
  },

  deleteBook: (id) => {
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books.splice(index, 1);
      return true;
    }
    return false;
  }
};
