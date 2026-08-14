let questions = [];

let quizQuestions = [];

let currentQuestion = 0;

let score = 0;

let selectedAnswers = [];


// =========================
// ELEMENTOS DA PÁGINA
// =========================

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startButton = document.getElementById("start-button");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");

const questionCountSelect = document.getElementById("question-count");

const questionText = document.getElementById("question-text");
const questionNumber = document.getElementById("question-number");

const questionCounter = document.getElementById("question-counter");

const optionsContainer = document.getElementById("options-container");

const progressBar = document.getElementById("progress-bar");

const scoreElement = document.getElementById("score");


// =========================
// CARREGAR JSON
// =========================

async function loadQuestions() {

    try {

        const response = await fetch("data/questions.json");

        if (!response.ok) {
            throw new Error("Não foi possível carregar as questões.");
        }

        const data = await response.json();

        questions = data.questions;

        document.getElementById("total-questions").textContent =
            questions.length;

    } catch (error) {

        console.error(error);

        alert("Erro ao carregar o arquivo de questões.");

    }

}


// =========================
// INICIAR QUIZ
// =========================

function startQuiz() {

    const amount = Number(questionCountSelect.value);

    quizQuestions = [...questions];

    shuffleArray(quizQuestions);

    quizQuestions = quizQuestions.slice(0, amount);

    currentQuestion = 0;

    score = 0;

    selectedAnswers = [];

    startScreen.classList.add("hidden");

    resultScreen.classList.add("hidden");

    quizScreen.classList.remove("hidden");

    showQuestion();

}


// =========================
// MOSTRAR QUESTÃO
// =========================

function showQuestion() {

    const question = quizQuestions[currentQuestion];

    questionText.textContent = question.question;

    questionNumber.textContent = currentQuestion + 1;

    questionCounter.textContent =
        `Questão ${currentQuestion + 1} de ${quizQuestions.length}`;

    scoreElement.textContent =
        `Pontos: ${score}`;

    const progress =
        ((currentQuestion) / quizQuestions.length) * 100;

    progressBar.style.width = `${progress}%`;

    optionsContainer.innerHTML = "";

    const correctAnswer = question.answer;

    const multipleAnswers = Array.isArray(correctAnswer);


    // Criar alternativas

    Object.entries(question.options).forEach(([letter, text]) => {

        const option = document.createElement("div");

        option.classList.add("option");

        option.dataset.letter = letter;

        option.innerHTML = `
            <div class="option-letter">
                ${letter}
            </div>

            <div class="option-text">
                ${text}
            </div>
        `;

        option.addEventListener("click", () => {

            selectOption(option, multipleAnswers);

        });

        optionsContainer.appendChild(option);

    });


    // Alterar botão

    if (currentQuestion === quizQuestions.length - 1) {

        nextButton.textContent = "Finalizar simulado";

    } else {

        nextButton.textContent = "Próxima questão";

    }

}


// =========================
// SELECIONAR ALTERNATIVA
// =========================

function selectOption(option, multipleAnswers) {

    if (multipleAnswers) {

        option.classList.toggle("selected");

    } else {

        const options =
            document.querySelectorAll(".option");

        options.forEach(item => {

            item.classList.remove("selected");

        });

        option.classList.add("selected");

    }

}


// =========================
// PEGAR RESPOSTA
// =========================

function getSelectedAnswers() {

    const selected =
        document.querySelectorAll(".option.selected");

    return Array.from(selected).map(option =>
        option.dataset.letter
    );

}


// =========================
// PRÓXIMA QUESTÃO
// =========================

function nextQuestion() {

    const answers = getSelectedAnswers();

    if (answers.length === 0) {

        alert("Selecione uma alternativa antes de continuar.");

        return;

    }


    const question = quizQuestions[currentQuestion];

    const correctAnswer = Array.isArray(question.answer)
        ? question.answer
        : [question.answer];


    const userAnswer = [...answers];


    selectedAnswers.push({
        questionNumber: question.number,

        selected: userAnswer,

        correct: correctAnswer
    });


    // Ordenar para comparar corretamente

    userAnswer.sort();

    correctAnswer.sort();


    const isCorrect =
        JSON.stringify(userAnswer) ===
        JSON.stringify(correctAnswer);


    if (isCorrect) {

        score++;

    }


    currentQuestion++;


    if (currentQuestion >= quizQuestions.length) {

        finishQuiz();

    } else {

        showQuestion();

    }

}


// =========================
// FINALIZAR
// =========================

function finishQuiz() {

    quizScreen.classList.add("hidden");

    resultScreen.classList.remove("hidden");

    const total = quizQuestions.length;

    const percentage =
        Math.round((score / total) * 100);

    const wrong = total - score;


    document.getElementById("final-score").textContent =
        `${percentage}%`;

    document.getElementById("correct-answers").textContent =
        score;

    document.getElementById("wrong-answers").textContent =
        wrong;

    document.getElementById("total-answered").textContent =
        total;

}


// =========================
// EMBARALHAR
// =========================

function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
            [array[j], array[i]];

    }

}


// =========================
// EVENTOS
// =========================

startButton.addEventListener(
    "click",
    startQuiz
);

nextButton.addEventListener(
    "click",
    nextQuestion
);

restartButton.addEventListener(
    "click",
    () => {

        resultScreen.classList.add("hidden");

        startScreen.classList.remove("hidden");

    }
);


// =========================
// INICIALIZAÇÃO
// =========================

loadQuestions();