const UserModel = require('../models/user')
const Blogmodel = require('../models/blogs')
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
const LoginPage = (req,res) => {
    res.render('login')
}
const RegisterPage = (req,res) => {
    res.render('register')
}
const AddUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      console.log(req.body);
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }
      
      const newUser = new UserModel({ name, email, password });
      await newUser.save();
      return res.redirect('/')
    } catch (error) {
      res.status(500).json({ message: 'Failed to create user' });
    }
  };
  const Loginuser = async (req, res) => {
    try {
      const {  email, password } = req.body;
      console.log(req.body);
      const existingUser = await UserModel.findOne({ email });
      if(!existingUser){
        return res.status(409).json({ message: 'no user avliable' });
      }
      if (existingUser) {
        if(existingUser.password != password){
          return res.status(409).json({ message: 'Password Is Incorrect' });
        }
        else{
          const userData = JSON.stringify({
            email: existingUser.email,
            // Add any other non-sensitive data you need
          });
      
          res.cookie('token',userData)
          res.redirect('/dash')
        }
      }
    } catch (error) {
      console.log(error);
      
      res.status(500).json({ message: 'Failed to create user' });
    }
  };
  const Dash = async(req,res) => {
    res.render('dashboard')
  }
  const addblogpage = (req,res) => {
    res.render('add')
  }
  const addblogs = async(req,res) => {
      try {
        const {title,description} = req.body
        const image = req.file.filename
        const blog = Blogmodel.findOne({title:title})
        if(blog){
          return res.status(200).send({
            success : false,
            message : "Alredy Blog Exists"
          })
        }
        await new Blogmodel({
          title : title,
          image :image,
          description:description
        })
        await Blogmodel.save()
        res.redirect('/show')
      } catch (error) {
        console.log(error);
        return false
      }
  }
  const DeleteBlog = async(req,res) => {
    try {
      const id = req.query.id;
      const blog = await Blogmodel.findById(id);
  
      if (blog) {
       
        const imagePath = path.join(__dirname, '/uploads', blog.imageName)
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting image:', err);
          } else {
            console.log('Image deleted successfully');
          }
        });
  
        // Delete the blog document
        await Blogmodel.findByIdAndDelete(id);
        res.redirect('/show');
      } else {
        res.status(404).send('Blog not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  }
  const UpdateBlog = async(req,res) => {
    try {
      const { title, description } = req.body;
      const image = req.file ? req.file.filename : null;
      const id = req.query.id;
  
      const blog = await Blogmodel.findById(id);
  
      if (blog) {
        if (image) {
          // Delete the old image file
          const oldImagePath = path.join(__dirname, '/uploads', blog.imageName);
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error('Error deleting old image:', err);
            } else {
              console.log('Old image deleted successfully');
            }
          });
  
          // Update the blog with the new image
          blog.imageName = image;
        }
  
        // Update other fields
        blog.title = title;
        blog.description = description;
  
        await blog.save();
        res.redirect('/show');
      } else {
        res.status(404).send('Blog not found');
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  }
  const showblog = (req,res) => {
    res.render('/show')
  }
module.exports = {
    LoginPage,RegisterPage,AddUser,Loginuser,Dash,addblogpage,addblogs,DeleteBlog,UpdateBlog,showblog
}   