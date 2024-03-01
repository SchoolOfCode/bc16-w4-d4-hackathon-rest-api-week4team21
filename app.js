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
	// res.status(404).json({ message: "ID not found" });
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

app.patch("/questions/:id", async function (req, res) {
	const questionsJSON = await fs.readFile(filePath, "utf-8");
	const questions = JSON.parse(questionsJSON);
	const questionID = req.params.id;
	const newQuestion = req.body.question;
	const newAnswer = req.body.answer;
	const newCategory = req.body.category;

	let question = null;

	for (let i = 0; i < questions.length; i++) {
		if (questions[i].id === questionID) {
			question = questions[i];
			questions[i].question = newQuestion ?? questions[i].question;
			questions[i].answer = newAnswer ?? questions[i].answer;
			questions[i].category = newCategory ?? questions[i].category;
			break;
		}
	}
	await fs.writeFile(filePath, JSON.stringify(questions, null, 2), "utf-8");

	res.json(question);
});

app.delete("/questions/:id", async function (req, res) {
	const questionID = req.params.id;
	const questionsJSON = await fs.readFile(filePath, "utf-8");
	const questions = JSON.parse(questionsJSON);

	let questionIndex = null;

	for (let i = 0; i < questions.length; i++) {
		if (questions[i].id === questionID) {
			questionIndex = i;
			break;
		}
	}
	if (questionIndex !== null) {
		const deletedQuestion = questions.splice(questionIndex, 1);
		await fs.writeFile(filePath, JSON.stringify(questions, null, 2), "utf-8");
		res.json(deletedQuestion[0]);
	}
	res.status(404).json({ message: "Index not found" });
});

app.listen(PORT, function () {
	console.log(`Server is now listening on http://localhost:${PORT}`);
});
