'use strict';
let current = 0;
let questions;
let score = 0;
let total = 0;
const categorySelect = document.getElementById('category-select');
fetch('https://opentdb.com/api_category.php').then((response) => response.json()).then(({ trivia_categories }) => {
	trivia_categories.forEach((category) => {
		categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
	});
});

document.getElementById('trivia-filters-form').addEventListener('submit', function(e) {
	e.preventDefault();
	const category = document.getElementById('category-select').value;
	const amount = document.getElementById('amount').value;
	const difficulty = document.getElementById('difficulty-select').value;
	const type = document.getElementById('type-select').value;
	const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;
	this.reset();
	this.classList.add('d-none');
	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			if (data.response_code === 1)
				throw new Error(
					'No hay información en la base de datos que coincida con los parámetros otorgados. Intente con otros, por favor.'
				);
			questions = data.results;
			document.getElementById('trivia-container').classList.remove('d-none');
			printQuestions();
		})
		.catch((err) => {
			alert(err);
			this.classList.remove('d-none');
		});
});

function printQuestions() {
	const triviaQuestion = document.getElementById('trivia-question');
	const answersContainer = document.getElementById('answers-container');
	answersContainer.innerHTML = '';
	triviaQuestion.innerHTML = `<span id="question">${questions[current].question}</span>`;

	const answers = [
		...questions[current].incorrect_answers,
		questions[current].correct_answer
	];
	shuffle(answers);
	answers.forEach((answer) => {
		answersContainer.innerHTML += `<label><input type="radio" name="${question.question}" value="${answer}" required/>   ${answer}</label><br>`;
	});
}

function shuffle(answers) {
	for (let i = 0; i < answers.length; i++) {
		const randIdx = Math.floor(Math.random() * answers.length);
		const temp = answers[i];
		answers[i] = answers[randIdx];
		answers[randIdx] = temp;
	}
}

document.getElementById('trivia-form').addEventListener('submit', function(e) {
	e.preventDefault();
	const userAnswer = document.querySelector('input[type="radio"]:checked').value;
	const correctAnswer = questions[current].correct_answer;
	if (userAnswer === correctAnswer) score++;
	total++;
	console.log('User answer:', userAnswer, 'Correct answer:', correctAnswer);
	current++;
	if (questions[current]) {
		this.reset();
		printQuestions();
	}
	else {
		document.getElementById('trivia-container').classList.add('d-none');
		alert(`Tuviste ${score} aciertos de ${total}`);
		location.reload();
	}
});
