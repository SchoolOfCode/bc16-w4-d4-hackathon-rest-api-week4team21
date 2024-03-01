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
	res.json(questions);
});

app.get("/questions/:id", async function (req, res) {
	const questionID = req.params.id;
	const questionsJSON = await fs.readFile(filePath, "utf-8");
	const questions = JSON.parse(questionsJSON);
	for (const question of questions) {
		if (question.id === questionID) {
			res.json(question);
		}
	}
	res.status(404).json({ message: "ID not found" });
});

app.post("/questions", async function (req, res) {
	const reqBody = req.body;
	const { question, answer, category } = reqBody;
	const questionsJSON = await fs.readFile(filePath, "utf-8");
	const questions = JSON.parse(questionsJSON);

	const newQuestion = {
		id: uuidv4(),
		question,
		answer,
		category,
	};

	questions.push(newQuestion);
	await fs.writeFile(filePath, JSON.stringify(questions, null, 2), "utf-8");

	res.json(newQuestion);
});

app.listen(PORT, function () {
	console.log(`Server is now listening on http://localhost:${PORT}`);
});
