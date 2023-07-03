import { authors } from "./author.js";
import  EventBus  from "./eventBus.js";

export const authorService = {
  getAllAuthors: () => {
    return authors;
  },

  getAuthorById: (id) => {
    return authors.find((author) => author.id === id);
  },

  createAuthor: (name) => {
    const newAuthor = {
      id: authors.length + 1,
      name
    };
    authors.push(newAuthor);
    EventBus.publish("authorCreated", newAuthor);
    return newAuthor;
  },

  updateAuthor: (id, name) => {
    const author = authors.find((author) => author.id === id);
    if (author) {
      author.name = name;
      return author;
    }
    return null;
  },

  deleteAuthor: (id) => {
    const index = authors.findIndex((author) => author.id === id);
    if (index !== -1) {
      authors.splice(index, 1);
      return true;
    }
    return false;
  }
};
