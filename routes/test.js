const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const Tag = require("../models/tag");
const User = require("../models/users");
const Role=require("../models/roles")

const multer = require("multer");

const fs = require("fs");
const Category = require("../models/category");

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

router.get("/listes", async (req, res) => {
  var firstname = "Vivek";
  var lastname = "Ranghar";
  var title = "Contact";
  const message = req.session.message;

  try {
    // Populate both category_id and tag_id fields
    var listes = await Post.find({}).populate('category_id tag_id user_id');

    // Clear the session message
    req.session.message = null;

    res.render("postlist", { title, firstname, lastname, message, listes });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: 'danger',
      message: 'Error fetching posts'
    };
    res.redirect('/listes');
  }
});

router.get("/add-post", async (req, res) => {
  var title = "Add Post";
  var categories = await Category.find({});
  var tags = await Tag.find({});
  var users = await User.find({});


  const message = req.session.message;

  // Clear the session message
  req.session.message = null;

  res.render("add-post", { title, message ,categories,tags,users });
});




router.post("/index-list", async (req, res) => {
  const { category_id, tag_id, user_id, name, slug, content } = req.body;

  try {
    const post = new Post({
      category_id,
      tag_id,
      user_id,
      name,
      slug,
      content,
    });

    await post.save();

    req.session.message = {
      type: 'success',
      message: 'Post added successfully'
    };

    res.redirect('/listes'); // Correcting the redirection URL
  } catch (err) {
    res.status(500).json({
      message: err.message,
      type: 'danger'
    });
  }
});











router.get("/edit-list/:id", async(req, res) => {
  let id = req.params.id;
  const message = req.session.message;
  var categories = await Category.find({});
  var tags = await Tag.find({});
  var users = await User.find({});

  // const name= id;
  // console.log(name)
  // Clear the session message
  req.session.message = null;

  Post.findById(id)
    .then((list) => {
      if (!list) {
        req.session.message = {
          type: "danger",
          message: "Invalid ID",
        };
        res.redirect("/");
      } else {
        res.render("edit-list",          
        {
          categories,
          tags,
          users,

          title: "Edit list",
          message,
          list: list,
          // name
        });
      }
    })
    .catch((err) => {
      req.session.message = {
        type: "danger",
        message: "Invalid ID",
      };
      res.redirect("/listes");
      console.error(err);
    });
});

router.post("/update-post/:id", (req, res) => {
  const id = req.params.id; // Extracting the category ID from the request parameters

  Post.findByIdAndUpdate(id, {
    category_id: req.body.category_id,
    tag_id: req.body.tag_id,
    user_id: req.body.user_id,
    name: req.body.name,
    slug: req.body.slug,
    content: req.body.content,
  })
    .then((result) => {
      req.session.message = {
        type: "success",
        message: "Liste updated successfully",

      };
      res.redirect("/listes"); // Redirecting to category listing page after successful update
    })
    .catch((err) => {
      req.session.message = {
        type: "danger",
        message: "Error updating list",
      };
      res.redirect("/listes"); 
    });
});

router.get("/delete/:id", (req, res) => {
  let id = req.params.id;

  // Assuming you have a User model
  Post.findByIdAndDelete(id)
    .then((deletedlist) => {
      if (!deletedlist) {
        req.session.message = {
          type: "danger",
          message: "post not found or already deleted",
        };
      } else {
        req.session.message = {
          type: "success",
          message: "Listes deleted successfully",
        };
      }
      res.redirect("/listes");
    })
    .catch((err) => {
      req.session.message = {
        type: "danger",
        message: err.message || "Error occurred while deleting user",
      };
      res.redirect("/listes");
    });
});







router.get("/tags", async (req, res) => {
  var firstname = "Vivek";
  var lastname = "Ranghar";
  var title = "Contact";
  const message = req.session.message;

  // Clear the session message
  req.session.message = null;
  const tags = await Tag.find();

  res.render("taglist", { title, firstname, lastname, message,tags });
});

router.get("/add-tag", async (req, res) => {
  var title = "Add Tag";
  const message = req.session.message;
  // const tags = await Tag.find();
  // const tags = await Tag.find();

  // Clear the session message
  req.session.message = null;

  res.render("add-tag", { title, message, });
});

router.post("/save-tag", async (req, res) => {
  const item = new Tag({
    name: req.body.name,
    slug: req.body.slug,
    content: req.body.content,
  });

  item.save()
  .then(result => {
    req.session.message = {
      type: 'success',
      message: 'Tag added successfully'
    };
    res.redirect('/tags');
  })
  .catch(err => {
    req.session.message = {
      type: 'danger',
      message: err.message || 'Error occurred while saving tag'
    };
    res.redirect('/tags');
  });
});

router.get('/edit-tag/:id', (req, res) => {
  let id = req.params.id;
  const message = req.session.message;

  Tag.findById(id)
    .then(item => {
      if (!item) {
        req.session.message = {
          type: 'danger',
          message: 'Invalid ID'
        };
        res.redirect('/tags');
      } else {
        res.render('edit-tag', {
          title: "Edit tag",
          message,
          item: item
        });
      }
    })
    .catch(err => {
      req.session.message = {
        type: 'danger',
        message: 'Invalid ID'
      };
      res.redirect('/tags');
      console.error(err);
    });
});

router.post("/update-tag/:id", (req, res) => {
  const id = req.params.id;

  Tag.findByIdAndUpdate(id, {
    name: req.body.name,
    slug: req.body.slug,
    content: req.body.content,
  })
  .then(result => {
    req.session.message = {
      type: 'success',
      message: 'Tag updated successfully'
    };
    res.redirect('/tags');
  })
  .catch(err => {
    req.session.message = {
      type: 'danger',
      message: 'Error updating tag'
    };
    res.redirect('/tags');
  });
});

router.get('/delete-tag/:id', (req, res) => {
  let id = req.params.id;

  Tag.findByIdAndDelete(id)
    .then(deleteditem => {
      if (!deleteditem) {
        req.session.message = {
          type: 'danger',
          message: 'Tag not found or already deleted'
        };
      } else {
        req.session.message = {
          type: 'success',
          message: 'Tag deleted successfully'
        };
      }
      res.redirect('/tags');
    })
    .catch(err => {
      req.session.message = {
        type: 'danger',
        message: err.message || 'Error occurred while deleting tag'
      };
      res.redirect('/tags');
    });
});


router.get("/roles", async (req, res) => {
  const message = req.session.message;

  // Clear the session message
  req.session.message = null;
  
  const roles = await Role.find();

  res.render("rolelist", {  message,roles });
});



router.get("/add-role",async (req, res) => {
  const title = "Add Role";
  const message = req.session.message;
  const roles = await Role.find();

  res.render("add-role", { title, message,roles });
});

// Save a new role
router.post("/save-role", async (req, res) => {
  console.log(req.body)
  const role = new Role({
    name: req.body.name,
    role_id: req.body.role_id // Assuming the input field name for permissions is "permissions"
  });

  try {
    await role.save();
    req.session.message = {
      type: 'success',
      message: 'Role added successfully'
    };
    res.redirect('/roles');
  } catch (err) {
    req.session.message = {
      type: 'danger',
      message: err.message || 'Error occurred while saving role'
    };
    res.redirect('/roles');
  }
});

// Display form to edit a role
router.get('/edit-role/:id', async (req, res) => {
  const id = req.params.id;
  const message = req.session.message;

  try {
    const role = await Role.findById(id);
    if (!role) {
      req.session.message = {
        type: 'danger',
        message: 'Role not found'
      };
      res.redirect('/roles');
    } else {
      res.render('edit-role', {
        title: "Edit Role",
        message,
        role
      });
    }
  } catch (err) {
    req.session.message = {
      type: 'danger',
      message: 'Invalid ID'
    };
    res.redirect('/roles');
  }
});

// Update an existing role
router.post("/update-role/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await Role.findByIdAndUpdate(id, {
      name: req.body.name,
      permissions: req.body.permissions // Assuming the input field name for permissions is "permissions"
    });
    req.session.message = {
      type: 'success',
      message: 'Role updated successfully'
    };
    res.redirect('/roles');
  } catch (err) {
    req.session.message = {
      type: 'danger',
      message: 'Error updating rol'
    };
    res.redirect('/roles');
  }
});

// Delete a role
router.get('/delete-role/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      req.session.message = {
        type: 'danger',
        message: 'Role not found or already deleted'
      };
    } else {
      req.session.message = {
        type: 'success',
        message: 'Role deleted successfully'
      };
    }
  } catch (err) {
    req.session.message = {
      type: 'danger',
      message: err.message || 'Error occurred while deleting role'
    };
  }
  res.redirect('/roles');
});



module.exports = router;
