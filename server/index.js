const express=require('express');
const app=express();


const multer=require('multer');
const upload=multer({dest:'uploads/'});

const pdfParse=require('pdf-parse');
const fs=require('fs');

app.get('/',(req,res)=>{
    res.send("Hello World");
})


app.post('/upload',upload.single('pdf'),async (req,res)=>{
    console.log(req.file);

    const dataBuffer=  fs.readFileSync(req.file.path);
    const pdfData= await pdfParse(dataBuffer);

    const text=pdfData.text;

    const chunks =text.split("\n\n");
 


    
    res.json({
        totalchunks:chunks.length,
        chunks
    })
})




app.listen(3000,()=>{
    console.log("server is running on port 3000");
})