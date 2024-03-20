const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Book = require("../models/book");
const Author = require("../models/authors");
const Publish = require("../models/publish");

const Category = require("../models/category");

const Post = require("../models/post");

const multer = require("multer");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("image");

router.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

router.get("/aboutus", (req, res) => {
  var firstname = "Vivek";
  var lastname = "Ranghar";
  var title = "About";

  res.render("aboutus", { title, firstname, lastname });
});

router.get("/contact", (req, res) => {
  var firstname = "Vivek";
  var lastname = "Ranghar";
  var title = "Contact";

  res.render("contactpage", { title, firstname, lastname });
});

router.get("/categories", async (req, res) => {
  var firstname = "Vivek";
  var lastname = "Ranghar";
  var title = "Contact";
  const message = req.session.message;

  // Clear the session message
  req.session.message = null;

  var categories = await Category.find({});

  res.render("categorylist", {
    title,
    firstname,
    lastname,
    message,
    categories,
    listes,
  });
});

router.get("/add-category", async (req, res) => {
  var title = "Add Category";
  const message = req.session.message;
  //  var listes = await Post.find({});

  // Clear the session message
  req.session.message = null;

  res.render("add-category", { title, message });
});

router.post("/save-category", async (req, res) => {
  var title = "Add Category";
  const category = new Category({
    name: req.body.name,
    slug: req.body.slug,
    content: req.body.content,
  });

  category
    .save()
    .then((result) => {
      req.session.message = {
        type: "success",
        message: "Category added successfully",
      };
      res.redirect("/categories");
    })
    .catch((err) => {
      res.json({
        message: err.message,
        type: "danger",
      });
    });
});

router.get("/edit-category/:id", (req, res) => {
  let id = req.params.id;
  const message = req.session.message;
  // const name= id;
  // console.log(name)
  // Clear the session message
  req.session.message = null;

  Category.findById(id)
    .then((category) => {
      if (!category) {
        req.session.message = {
          type: "danger",
          message: "Invalid ID",
        };
        res.redirect("/");
      } else {
        res.render("edit-category", {
          title: "Edit category",
          message,
          category: category,
          // name
        });
      }
    })
    .catch((err) => {
      req.session.message = {
        type: "danger",
        message: "Invalid ID",
      };
      res.redirect("/categories");
      console.error(err);
    });
});

router.post("/update-category/:id", (req, res) => {
  const id = req.params.id; // Extracting the category ID from the request parameters

  Category.findByIdAndUpdate(id, {
    category_id: req.body.name,
    tag_id: req.body.tag_id,
    name: req.body.name,
    slug: req.body.slug,
    content: req.body.content,
  })
    .then((result) => {
      req.session.message = {
        type: "success",
        message: "Category updated successfully",
      };
      res.redirect("/categories"); // Redirecting to category listing page after successful update
    })
    .catch((err) => {
      req.session.message = {
        type: "danger",
        message: "Error updating category",
      };
      res.redirect("/categories"); // Redirecting to category listing page if update fails
    });
});

router.get("/delete/:id", (req, res) => {
  let id = req.params.id;

  // Assuming you have a User model
  Category.findByIdAndDelete(id)
    .then((deletedCategory) => {
      if (!deletedCategory) {
        req.session.message = {
          type: "danger",
          message: "Category not found or already deleted",
        };
      } else {
        req.session.message = {
          type: "success",
          message: "Category deleted successfully",
        };
      }
      res.redirect("/categories");
    })
    .catch((err) => {
      req.session.message = {
        type: "danger",
        message: err.message || "Error occurred while deleting user",
      };
      res.redirect("/categories");
    });
});


router.get("/books", async (req, res) => {
  var firstname = "Vivek";
  var lastname = "Ranghar";
  var title = "Contact";
  const message = req.session.message;

  // Clear the session message
  req.session.message = null;

  try {
    var books = await Book.find({}).populate('author').populate('publish');
    res.render("booklist", {
      title,
      firstname,
      lastname,
      message,
      books,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/add-book", async (req, res) => {
  var title = "Add Book";
  const message = req.session.message;

  // Clear the session message
  req.session.message = null;

  try {
    var authors = await Author.find({});
    var publishers = await Publish.find({});

    res.render("add-book", { title, message,publishers,authors
     });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/save-book", async (req, res) => {
  var title = "Add Book";

  const book = new Book({
    name: req.body.name,
    total_pages: req.body.total_pages,
    author: req.body.author,
    publish: req.body.publish,
    price: req.body.price
  });

  try {
    await book.save();
    req.session.message = {
      type: "success",
      message: "Book added successfully",
    };
    res.redirect("/books");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error adding book",
    };
    res.redirect("/add-book");
  }
});

router.get("/edit-book/:id", async (req, res) => {
  let id = req.params.id;
  const message = req.session.message;
  var authors = await Author.find({});
  var publishers = await Publish.find({});

  // Clear the session message
  req.session.message = null;

  try {
    const book = await Book.findById(id);
    if (!book) {
      req.session.message = {
        type: "danger",
        message: "Invalid ID",
      };
      res.redirect("/books");
    } else {
      res.render("edit-book", {
        title: "Edit Book",
        message,
        book,
        authors,
        publishers 
      });
    }
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error editing book",
    };
    res.redirect("/books");
  }
});

router.post("/update-book/:id", async (req, res) => {
  const id = req.params.id; // Extracting the book ID from the request parameters

  try {
    await Book.findByIdAndUpdate(id, {
      name: req.body.name,
      total_pages: req.body.total_pages,
      author: req.body.author,
      publish: req.body.publish,
      price: req.body.price
    });
    req.session.message = {
      type: "success",
      message: "Book updated successfully",
    };
    res.redirect("/books"); // Redirecting to book listing page after successful update
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error updating book",
    };
    res.redirect(`/edit-book/${id}`); // Redirecting to edit book page if update fails
  }
});

router.get("/delete-book/:id", async (req, res) => {
  let id = req.params.id;

  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      req.session.message = {
        type: "danger",
        message: "Book not found or already deleted",
      };
    } else {
      req.session.message = {
        type: "success",
        message: "Book deleted successfully",
      };
    }
    res.redirect("/books");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error occurred while deleting book",
    };
    res.redirect("/books");
  }
});








// GET route for listing authors
router.get("/authors", async (req, res) => {
  try {
    const title = "Authors";
    const message = req.session.message;
    const authors = await Author.find({});

    // Clear the session message
    req.session.message = null;

    res.render("authorlist", { title, message, authors });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// GET route for adding an author
router.get("/add-author", async (req, res) => {
  try {
    const title = "Add Author";
    const message = req.session.message;

    // Clear the session message
    req.session.message = null;

    res.render("add-author", { title, message });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// POST route for saving an author
router.post("/save-author", async (req, res) => {
  try {
    const newAuthor = new Author({
      name: req.body.name,
      age: req.body.age,
    });

    await newAuthor.save();

    req.session.message = {
      type: "success",
      message: "Author added successfully",
    };
    res.redirect("/authors");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error adding author",
    };
    res.redirect("/add-author");
  }
});

// GET route for editing an author
router.get("/edit-author/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const message = req.session.message;
    const author = await Author.findById(id);

    if (!author) {
      req.session.message = {
        type: "danger",
        message: "Invalid ID",
      };
      return res.redirect("/authors");
    }

    res.render("edit-author", {
      title: "Edit Author",
      message,
      author,
    });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error editing author",
    };
    res.redirect("/authors");
  }
});

// POST route for updating an author
router.post("/update-author/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedAuthor = {
      name: req.body.name,
      age: req.body.age,
    };

    await Author.findByIdAndUpdate(id, updatedAuthor);

    req.session.message = {
      type: "success",
      message: "Author updated successfully",
    };
    res.redirect("/authors");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error updating author",
    };
    res.redirect(`/edit-author/${id}`);
  }
});

// POST route for deleting an author
router.get("/delete-author/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) {
      req.session.message = {
        type: "danger",
        message: "Author not found or already deleted",
      };
    } else {
      req.session.message = {
        type: "success",
        message: "Author deleted successfully",
      };
    }

    res.redirect("/authors");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error deleting author",
    };
    res.redirect("/authors");
  }
});


// Route to display publisher
router.get("/publish", async (req, res) => {
  try {
    const title = "Publishers";
    const message = req.session.message;
    const publishers = await Publish.find({});

    // Clear the session message
    req.session.message = null;

    res.render("publishlist", { title, message, publishers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to render the form for adding a new publisher
router.get("/add-publish", async (req, res) => {
  try {
    const title = "Add Publisher";
    const message = req.session.message;

    // Clear the session message
    req.session.message = null;

    res.render("add-publish", { title, message });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to handle saving a new publisher
router.post("/save-publish", async (req, res) => {
  try {
    const { name, address } = req.body; // Destructure the request body
    const newPublish = new Publish({
      name,
      address,
    });

    await newPublish.save();

    req.session.message = {
      type: "success",
      message: "Publisher added successfully",
    };
    res.redirect("/publish");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error adding publisher",
    };
    res.redirect("/add-publish");
  }
});

// Route to render the form for editing a publisher
router.get("/edit-publish/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const message = req.session.message;
    const publish = await Publish.findById(id);

    if (!publish) {
      req.session.message = {
        type: "danger",
        message: "Invalid ID",
      };
      return res.redirect("/publish");
    }

    res.render("edit-publish", {
      title: "Edit Publisher",
      message,
      publish,
    });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error editing publisher",
    };
    res.redirect("/publish");
  }
});

// Route to handle updating a publisher
router.post("/update-publish/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, address } = req.body; // Destructure the request body
    const updatedPublish = {
      name,
      address,
    };

    await Publish.findByIdAndUpdate(id, updatedPublish);

    req.session.message = {
      type: "success",
      message: "Publisher updated successfully",
    };
    res.redirect("/publish");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error updating publisher",
    };
    res.redirect(`/edit-publish/${id}`);
  }
});

// Route to handle deleting a publisher
router.get("/delete-publish/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPublish = await Publish.findByIdAndDelete(id);

    if (!deletedPublish) {
      req.session.message = {
        type: "danger",
        message: "Publisher not found or already deleted",
      };
    } else {
      req.session.message = {
        type: "success",
        message: "Publisher deleted successfully",
      };
    }

    res.redirect("/publish");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Error deleting publisher",
    };
    res.redirect("/publish");
  }
});


module.exports = router;
