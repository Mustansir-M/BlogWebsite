const express=require('express');
const cors=require('cors');
const app=express();
const User=require("./models/User");
const Post=require("./models/Post")
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt= require("jsonwebtoken");
const cookieParser=require("cookie-parser");
const multer=require("multer");
const uploadMiddleware=multer({dest:"uploads/"});
const fs=require("fs");



const salt=bcrypt.genSaltSync(10); //can be anything
const secret="adnkjkdkfjds"; // some random string for jwt


app.use(express.json()) // to parsee json from request
app.use(cors({credentials:true,origin:"http://localhost:3000"}));  //neccessary when storing cookie
app.use(cookieParser());
app.use("/uploads",express.static(__dirname+"/uploads"));


mongoose.connect("{yourid}",{
    dbName:"mernblog",
}).then(()=>console.log("Database Connected"))
    .catch((e)=>console.log(e));


//registration
app.post("/register",async (req,res)=>{
    const {username,password}=req.body;
    try {
        const userDoc=await User.create({
            username,
            password:bcrypt.hashSync(password,salt)
        });
        res.json(userDoc);
    } catch (error) {
        res.status(400).json(error)
    }
})


//login
app.post("/login",async (req,res)=>{
    const {username,password}=req.body;

    const userDoc=await User.findOne({username:username});

    const passOk=bcrypt.compareSync(password,userDoc.password);

   if(passOk){
    //logged in
    jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
        if(err) throw err;
        res.cookie("token",token).json({
            id:userDoc._id,
            username,
        });
        
    })
   }
   else{
    res.status(400).json("Passwords do not match!")
   }
})




//profile information
app.get("/profile",(req,res)=>{
    const {token}=req.cookies;
    jwt.verify(token,secret,{},(err,info)=>{
        if(err) throw err;                
        res.json(info);
        //iat means issued at

    })
})



//logout
app.post("/logout",(req,res)=>{
    res.cookie('token',"").json('ok');
})


//to post
app.post("/post",uploadMiddleware.single("file"),async (req,res)=>{

    //changing the name of the file and adding .webp extension
    const {originalname,path}=req.file;
    const parts=originalname.split(".");
    const ext=parts[parts.length-1];
    const newPath=path+"."+ext
    fs.renameSync(path,newPath);

    const {token}=req.cookies;
    jwt.verify(token,secret,{},async (err,info)=>{
        if(err) throw err;                
        const{title,summary,content}=req.body;
        const postDoc= await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id,
        })
        res.json(postDoc);
        //iat means issued at

    })

   
})


//edit endpoint
app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if (req.file) {
      const {originalname,path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path+'.'+ext;
      fs.renameSync(path, newPath);
    }
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('You are not the author');
      }
    //   await postDoc.update({
    //     title,
    //     summary,
    //     content,
    //     cover: newPath ? newPath : postDoc.cover,
    //   }); 
    await Post.updateOne({ _id: postDoc._id }, {
        $set: {
          title,
          summary,
          content,
          cover: newPath ? newPath : postDoc.cover,
        }
      });
  
      res.json(postDoc);
    });
  
  });





//to get posts from database
app.get("/post",async (req,res)=>{
    res.json(
        await Post.find()
            .populate("author",["username"])
            .sort({createdAt:-1}) // sorting so that latest is at top
            .limit(20)   // limiting to only 20 posts
    );
})




app.get("/post/:id",async (req,res)=>{
    const {id}=req.params;
    const postDoc=await Post.findById(id).populate("author",["username"])   //not making password visible at the devtools
    res.json(postDoc)
})

app.listen(4000);