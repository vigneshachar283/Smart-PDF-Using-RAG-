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


const qdrant = new QdrantClient({
    apiKey: process.env.QUADRANT_API_KEY,
    url: process.env.QUADRANT_URL
});


app.get('/',(req,res)=>{
    res.send("Hello World");
})

app.get("/create-collection",async (req,res)=>{
    try{
   await qdrant.createCollection("documenyts",{

    vectors:{
        size:3072,
        distance:'Cosine'
    }

   }
    
   )
   res.send("Collection created successfully");
    }catch(err){
            res.status(500).send(err.message);
    }
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
    const chunkEmbeddings = [];

for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk);
    chunkEmbeddings.push({ chunk, embedding });
}

const points = chunkEmbeddings.map((item, index) => ({
    id: index + 1,
    vector: item.embedding,
    payload: {
        text: item.chunk
    }
}));

await qdrant.upsert("documenyts", {
    wait: true,
    points: points
});

    const question =req.body.question;


const searchResult= await qdrant.search("documenyts",{
    vector: await createEmbedding(question),
    limit: 1
});

const bestChunk = searchResult[0].payload.text;

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