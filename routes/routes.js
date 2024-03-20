const express = require("express");
const router = express.Router();
const User = require("../models/users");
// const Category = require("../models/category");
const Role=require('../models/roles')
const multer = require("multer");
const fs = require('fs');



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("image");


router.get("/users",async (req, res) => {
  const title = "Add User";
  const message = req.session.message;
  var roles = await User.find({}).populate('role_id');

  // Clear the session message
  req.session.message = null;

  res.render("index", { title, message,roles,users });
});

router.get("/add-user", async (req, res) => {
 
  var title= "Add User"
  const message = req.session.message;
  //  var listes = await Post.find({});
  // Clear the session message
  req.session.message = null;
  var roles = await Role.find({});
  var users = await User.find({});

  res.render("backend/add-user", { title, message,users,roles});
});



router.post('/save-user', upload, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'No file uploaded',
      type: 'danger'
    });
  }

  // Create a new user instance
  const user = new User({
    name: req.body.name,
    role_id: req.body.role_id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    image: req.file.filename,
  });

  // Save the user to the database
  user.save()
    .then(result => {
      // Set success message in session
      req.session.message = {
        type: 'success',
        message: 'User added successfully'
      };
      // Redirect to the appropriate route
      res.redirect('/users');
    })
    .catch(err => {
      // If an error occurs during saving, send an error response with the specific error message
      res.status(500).json({
        message: err.message,
        type: 'danger'
      });
    });
});


//  router.post('/save-user', upload, (req, res) => {
//   const user = new User({
//     name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone,
//     password: req.body.password,
//     image: req.file.filename,
//   });

//   user.save()
//     .then(result => {
//       req.session.message = {
//         type: 'success',
//         message: 'User added successfully'
//       };
//       res.redirect('/');
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: err.message,
//         type: "danger",
//       });
//     });
// });

// router.get("/", (req, res) => {
// const message = req.session.message;
  
//   // Clear the session message
//   req.session.message = null;

// User.find({}).then(users => {
//   res.render('index', {
//     title: "Home Page",
//     message: message,
//     users: users
//   });
// }).catch(err => {
//   // handle error
//     res.json({message:err.message})
//   console.error(err);
// });
// })


var testdata = await User.find({});

testdata.forEach(function(t, i) {
console.log(t.name)
})

var singleData = await User.findOne({phone: "13123126727", email: "viveksinghranghar@gamil.com"});
if(singleData){
  singleData.name
}

console.log(singleData)


// User.find().exec((err,users)=>{
//   if(err){
//     res.json({message:err.message})
//   }else{
//     res.render('index',{
//       title:"Home Page",
//       users:users
//     })
//   }
// })
router.get('/edit-user/:id', (req, res) => {

  let id = req.params.id;

  User.findById(id)
    .then(user => {
      if (!user) {
        req.session.message = {
          type: 'danger',
          message: 'Invalid ID',
        };
        res.redirect('/users');
      } else {
        res.render('edit-user', {
          title: "Edit User",
          user: user,
          
        });
      }
    })
    .catch(err => {
      req.session.message = {
        type: 'danger',
        message: 'Invalid ID',

      };
      res.redirect('/users');
      console.error(err);
    });
});





User.findByIdAndUpdate(id,{
  name:req.body.name,
  email:req.body.email,
  phone:req.body.phone,
  image:new_image,
},(err,result)=>{
if(err){
res.json({message:err.message,type:'danger'})
}else{
req.session.message={
  tyep:'success',
  message:'User update successfully'
}
res.redirect('/')
}
})
  



User.findByIdAndUpdate(id,{
  name:req.body.name,
  email:req.body.email,
  phone:req.body.phone,
  image:new_image,
},(err,result)=>{
if(err){
  res.json({message:err.message,type:'danger'})
}else{
  req.session.message={
    type:'success', // corrected typo
    message:'User update successfully'
  }
  res.redirect('/')
}
})

router.post("/update-user/:id", upload, (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;

    // Delete old image if new image is uploaded
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
      console.log('Old image deleted successfully.');
    } catch (err) {
      console.log('Error occurred while deleting old image:', err);
    }
  } else {
    new_image = req.body.old_image;
  }

  // Update user details
  User.findByIdAndUpdate(id, {
    name: req.body.name,
    role_id: req.body.role_id, // Assuming the input field name for permissions is "permissions"
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password, // Corrected to 'req.body.password' from 'req.body.phone'
    image: new_image,
  })
  .then(result => {
    req.session.message = {
      type: 'success',
      message: 'User updated successfully'
    };
    res.redirect('/users');
  })
  .catch(err => {
    res.status(500).json({ message: err.message, type: 'danger' }); // Sending error response
  });
});




router.get('/delete-user/:id', (req, res) => {
  let id = req.params.id;
console.log(id)
  // Assuming you have a User model
  User.findByIdAndDelete(id)
    .then(deletedUser => {
      if (!deletedUser) {
        req.session.message = {
          type: 'danger',
          message: 'User not found or already deleted'
        };
      } else {
        req.session.message = {
          type: 'success',
          message: 'User deleted successfully'
        };
      }
      res.redirect('/users');
    })
    .catch(err => {
      req.session.message = {
        type: 'danger',
        message: err.message || 'Error occurred while deleting user'
      };
      res.redirect('/users');
    });
});




router.get("/", (req, res) => {
  const message = req.session.message;
  req.session.message = "";
  
  const isError = req.session.isError;
  req.session.isError = false;

  res.render("login_users", { title: "Login Users", message, isError });
});

// Route to handle login form submission
// router.post("/login", upload, (req, res) => {
//   const { email, password } = req.body;

//   // Check if email and password match
//   if (email === "admin" && password === "123") {
//     // Set success message to session
//     req.session.message = {
//       type: 'success',
//       message: 'Login successful'
//     };
//     // Redirect to homepage after successful login
//     res.redirect("/");
//   } else {
//     // Set error message to session
//     req.session.message = {
//       type: 'danger',
//       message: 'Invalid username or password'
//     };
//     // Set error flag to indicate authentication error
//     req.session.isError = true;
//     // Redirect back to login page
//     res.redirect("/login");
//   }
// });

module.exports = router;







