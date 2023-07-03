import express from "express";
import { authorService } from "./authorService.js";
import { bookService } from "./bookService.js";
import { categoryService } from "./categoryService.js";
import EventBus from "./eventBus.js";

const app = express();
const port = 5000;

app.use(express.json());

// Routes pour le microservice Author
app.get("/authors", (req, res) => {
  const allAuthors = authorService.getAllAuthors();
  res.send(JSON.stringify(allAuthors));
});

app.get("/authors/:id", (req, res) => {
  const authorId = parseInt(req.params.id);
  const author = authorService.getAuthorById(authorId);
  if (author) {
    res.send(JSON.stringify(author));
  } else {
    res.status(404).send("Auteur non trouvé");
  }
});

app.post("/authors", (req, res) => {
  const { name } = req.body;
  if (name) {
    const newAuthor = authorService.createAuthor(name);
    res.send(JSON.stringify(newAuthor));
  } else {
    res.status(400).send("Le nom de l'auteur est requis");
  }
});

// Routes pour le microservice Book
app.get("/books", (req, res) => {
  const allBooks = bookService.getAllBooks();
  res.send(JSON.stringify(allBooks));
});

app.get("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = bookService.getBookById(bookId);
  if (book) {
    res.send(JSON.stringify(book));
  } else {
    res.status(404).send("Livre non trouvé");
  }
});

app.post("/books", (req, res) => {
  const { title, authorId, categoryId } = req.body;
  if (title && authorId && categoryId) {
    const newBook = bookService.createBook(title, authorId, categoryId);
    res.send(JSON.stringify(newBook));
  } else {
    res
      .status(400)
      .send("Le titre, l'ID de l'auteur et l'ID de la catégorie sont requis");
  }
});

// Routes pour le microservice Category
app.get("/categories", (req, res) => {
  const allCategories = categoryService.getAllCategories();
  res.send(JSON.stringify(allCategories));
});

app.get("/categories/:id", (req, res) => {
  const categoryId = parseInt(req.params.id);
  const category = categoryService.getCategoryById(categoryId);
  if (category) {
    res.send(JSON.stringify(category));
  } else {
    res.status(404).send("Catégorie non trouvée");
  }
});

app.post("/categories", (req, res) => {
  const { name } = req.body;
  if (name) {
    const newCategory = categoryService.createCategory(name);
    res.send(JSON.stringify(newCategory));
  } else {
    res.status(400).send("Le nom de la catégorie est requis");
  }
});
//authorCreated...
EventBus.subscriber("authorCreated", (author) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(author)
  };

  fetch("http://localhost:5001/authors", options)
    .then((response) => response.json())
    .then((data) => {
      console.log("Auteur créé dans le microservice Author :", data);
    })
    .catch((error) => {
      console.error("Erreur lors de la création de l'auteur :", error);
    });
});

// BookCreated
EventBus.subscriber("BookCreated", (book) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book)
  };

  fetch("http://localhost:5002/books", options)
    .then((response) => response.json())
    .then((data) => {
      console.log("Livre créé dans le microservice Book :", data);
    })
    .catch((error) => {
      console.error("Erreur lors de la création du livre :", error);
    });
});

//'CategoryCreated'
EventBus.subscriber("CategoryCreated", (category) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category)
  };

  fetch("http://localhost:5003/categories", options)
    .then((response) => response.json())
    .then((data) => {
      console.log("Catégorie créée dans le microservice Category :", data);
    })
    .catch((error) => {
      console.error("Erreur lors de la création de la catégorie :", error);
    });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
