import express from "express";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "node:fs";
import path from "node:path";

const app = express();
const PORT = 3000;

const filePath = path.resolve(process.cwd(), "questions.json");

app.use(express.json());

app.get("/", function (req, res) {
	res.send("Welcome to the questions API");
});

app.get("/questions", async function (req, res) {
	const questionsJSON = await fs.readFile(filePath, "utf-8");
	const questions = JSON.parse(questionsJSON);
	res.json(questions)
})


app.listen(PORT, function () {
	console.log(`Server is now listening on http://localhost:${PORT}`);
});
