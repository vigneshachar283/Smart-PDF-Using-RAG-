const express=require('express');
const app=express();

const multer=require('multer');
const upload=multer({dest:'uploads/'});

app.get('/',(req,res)=>{
    res.send("Hello World");
})


app.post('/upload',upload.single('pdf'),(req,res)=>{
    console.log(req.file);
    res.send("File uploaded successfully");
})



app.listen(3000,()=>{
    console.log("server is running on port 3000");
})