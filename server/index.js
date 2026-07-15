const express=require('express');
const app=express();


const multer=require('multer');
const upload=multer({dest:'uploads/'});

const pdfParse=require('pdf-parse');
const fs=require('fs');

const {GoogleGenAI} = require('@google/genai');

require('dotenv').config();


const ai= new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

app.get('/',(req,res)=>{
    res.send("Hello World");
})


app.post('/upload',upload.single('pdf'),async (req,res)=>{
    console.log(req.file);
try{
    const dataBuffer=  fs.readFileSync(req.file.path);
    const pdfData= await pdfParse(dataBuffer);

    const text=pdfData.text;

    const chunks =text.split("\n\n");

const response = await ai.models.generateContent({
 model: "models/gemini-3.1-flash-lite",
  contents: `Explain this pdf in simple text:\n\n${chunks[1]}`
});

res.send(response.text);
}
catch(err){
    console.error(err);
    res.status(500).json({
        message: err.message,
        error: err
    });
}

    
   
})




app.listen(3000,()=>{
    console.log("server is running on port 3000");
})