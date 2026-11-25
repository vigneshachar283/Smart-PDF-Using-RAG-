# 📄 Smart PDF Using RAG

Smart PDF Using RAG is a backend application that allows users to upload a PDF document and ask questions based on its content. The application uses a **Retrieval-Augmented Generation (RAG)** pipeline to extract text from PDFs, generate vector embeddings, store them in a vector database, retrieve relevant context, and generate an AI-powered answer.

## 🚀 Features

* Upload PDF documents
* Extract text from PDFs
* Split extracted text into smaller chunks
* Generate vector embeddings using Google Gemini
* Store embeddings in Qdrant Vector Database
* Perform semantic similarity search
* Retrieve the most relevant PDF context
* Generate answers using Gemini based on the retrieved context

## 🛠️ Tech Stack

* **Node.js** – JavaScript runtime
* **Express.js** – Backend web framework
* **Multer** – PDF file upload handling
* **pdf-parse** – Extract text from PDF files
* **Google Gemini API** – Embedding generation and AI responses
* **Qdrant** – Vector database for storing and searching embeddings
* **dotenv** – Environment variable management

## 🧠 How RAG Works in This Project

The application follows this RAG pipeline:

**1. Upload PDF**

The user uploads a PDF along with a question.

**2. Extract Text**

`pdf-parse` extracts the text content from the uploaded PDF.

**3. Chunk the Document**

The extracted text is divided into smaller chunks.

**4. Generate Embeddings**

Each text chunk is converted into a numerical vector embedding using the Gemini embedding model.

**5. Store in Qdrant**

The generated embeddings and their corresponding text chunks are stored in a Qdrant collection.

**6. Embed the Question**

The user's question is also converted into a vector embedding.

**7. Semantic Search**

Qdrant compares the question embedding with the stored document embeddings and retrieves the most relevant text chunk.

**8. Generate Answer**

The retrieved context and the user's question are passed to Gemini, which generates the final answer.

### RAG Flow

PDF Upload
↓
Text Extraction
↓
Text Chunking
↓
Generate Embeddings
↓
Store Vectors in Qdrant
↓
User Question
↓
Generate Question Embedding
↓
Vector Similarity Search
↓
Retrieve Relevant Context
↓
Gemini LLM
↓
Final Answer

## 📁 Project Structure

```text
Smart-PDF-Using-RAG/
│
└── server/
    ├── index.js
    ├── package.json
    ├── package-lock.json
    ├── .gitignore
    └── uploads/
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Smart-PDF-Using-RAG/server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
QUADRANT_API_KEY=your_qdrant_api_key
QUADRANT_URL=your_qdrant_cluster_url
```

> Never commit your `.env` file or API keys to GitHub.

### 4. Start the server

```bash
node index.js
```

The server will run on:

```text
http://localhost:3000
```

## 📌 API Endpoints

### Test Server

```http
GET /
```

Used to check whether the Express server is running.

### Create Qdrant Collection

```http
GET /create-collection
```

Creates the Qdrant vector collection used to store document embeddings.

### Upload PDF and Ask a Question

```http
POST /upload
```

Send the request as `multipart/form-data`.

Fields:

```text
pdf       → PDF file
question  → Question about the PDF
```

Example:

```text
pdf: notes.pdf
question: What is the main topic discussed in this document?
```

The application retrieves relevant information from the uploaded PDF and returns an AI-generated answer.

## 🔐 Environment Variables

| Variable           | Description               |
| ------------------ | ------------------------- |
| `GEMINI_API_KEY`   | API key for Google Gemini |
| `QUADRANT_API_KEY` | API key for Qdrant        |
| `QUADRANT_URL`     | URL of the Qdrant cluster |

## 📦 Main Dependencies

```text
@google/genai
@qdrant/js-client-rest
express
multer
pdf-parse
dotenv
```

## 🎯 Learning Outcomes

This project demonstrates practical implementation of:

* Retrieval-Augmented Generation (RAG)
* Vector embeddings
* Vector databases
* Semantic search
* PDF processing
* REST API development
* AI integration with Node.js
* Google Gemini API integration
* Qdrant vector search

## 🔮 Future Improvements

* Add a frontend interface for PDF uploads and chat
* Support multiple PDF documents
* Implement better text chunking with chunk overlap
* Retrieve multiple relevant chunks instead of only one
* Add document-specific IDs to prevent vector collisions
* Add user authentication
* Add conversation history
* Delete uploaded temporary PDF files after processing
* Improve error handling and validation
* Add streaming AI responses

## 📜 License

This project is licensed under the ISC License.
