import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";
import 'dotenv/config';
import express from 'express';
import cors from "cors";

console.log(process.env.GEMINI_API_KEY); // for debug 

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Enter Your GEMINI API HERE 
const History = [];

app.use(express.json());
app.use(cors())

app.post("/api/chat" , async (req , res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }
        
        console.log("Message: ", message);
        
        History.push({ role: 'user' , parts: [ {text: message} ] }) 

        const result = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: History,
            config: {
                systemInstruction: process.env.GEMINI_SYSTEM_INSTRUCTION // Enter Your SYSTEM INSTRUCTION HERE 
            }
        });

        const responseText = result.text;

        if (responseText) {
            console.log("Gemini Response: ", responseText);
            History.push({
                role: "model", 
                parts: [{ text: responseText }] 
            });
            
            return res.json({ response: responseText });
        } else {
            console.log("No response received from Gemini.");
            return res.status(500).json({ error: "No response from AI" });
        }
    } catch (error) {
        console.error("Error in chat endpoint:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

app.use( (err , req , res , next) => {
    console.error("Error: ", err.message);
    return res.status(500).json({ error: "Internal server error" });
});

app.listen(3001, () => {
    console.log("Server started on port 3001");
});
