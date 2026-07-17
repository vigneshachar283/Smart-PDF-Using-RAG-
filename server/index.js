const express=require('express');
const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const multer=require('multer');
const upload=multer({dest:'uploads/'});

const pdfParse=require('pdf-parse');
const fs=require('fs');

const {GoogleGenAI} = require('@google/genai');

const { QdrantClient } = require('@qdrant/js-client-rest');

require('dotenv').config();


const ai= new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

async function createEmbedding(text){
    
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: text,
    });

    return response.embeddings[0].values;
}

app.get('/',(req,res)=>{
    res.send("Hello World");
})

function cosineSimilarity(vectorA, vectorB) {
    
    let dotProduct = 0;
    for(let i=0;i<vectorA.length;i++){
        dotProduct += vectorA[i] * vectorB[i];
    }
    return dotProduct;
}

app.post('/upload',upload.single('pdf'),async (req,res)=>{
    console.log(req.body);
try{
    const dataBuffer=  fs.readFileSync(req.file.path);
    const pdfData= await pdfParse(dataBuffer);

    const text=pdfData.text;

    const chunks =text.split("\n\n").filter(chunk => chunk.trim() !== '');

    const embedding=await createEmbedding(chunks[0]);
    const chunkEmbeddings=[];

    for(const chunk of chunks){
        const embedding=await createEmbedding(chunk);
        chunkEmbeddings.push({chunk,embedding});
    }

    const question =req.body.question;

    const questionEmbedding =await createEmbedding(question);
   

    //  matchedChunk = chunks.find(chunk => chunk.toLowerCase().includes(question.toLowerCase()));

    let bestChunk=null;
    let bestScore=-Infinity;


    for(const item of chunkEmbeddings){
        const score=cosineSimilarity(questionEmbedding, item.embedding);

      if(score>bestScore){

    bestChunk =item.chunk;
    bestScore=score;


    }
}

console.log("Best Chunk:", bestChunk);
console.log("Best Score:", bestScore);

const response = await ai.models.generateContent({
 model: "models/gemini-3.1-flash-lite",
  contents: `Answer the question using the context ${bestChunk} and the question is ${question}`
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