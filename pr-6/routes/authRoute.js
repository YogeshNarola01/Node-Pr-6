const express = require('express')
const { LoginPage, RegisterPage, AddUser, Loginuser, Dash ,addblogpage,addblogs,DeleteBlog,UpdateBlog,showblog} = require('../controllers/authcontroller')
const router = express.Router()
const IsLogin = (req,res,next) => {
    const token = req.cookies.token
    if(!token){
      return res.redirect('/')
    }
    next()
}
const Isloggedinuser = (req,res,next) => {
    const token = req.cookies.token
    if(token){
        res.redirect('/dash')
    }
    next()
}
router.get('/',Isloggedinuser,LoginPage)
router.get('/register',Isloggedinuser,RegisterPage)
router.post('/adduser',AddUser)
router.post('/Loginuser',Loginuser)
router.get('/dash',IsLogin,Dash)
router.get('/add',IsLogin,addblogpage)
router.get('/show',IsLogin,showblog)
router.post('/addblogs',addblogs)
router.post('/DeleteBlog',DeleteBlog)
router.post('/UpdateBlog',UpdateBlog)
module.exports = router