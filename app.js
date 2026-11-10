let currentSubject = 'science';
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let totalPoints = parseInt(localStorage.getItem('edu_points') || '0');
let timerInterval = null;
let timeLeft = 25;

// DOM Elements
const subjectBtns = document.querySelectorAll('.btn-subject');
const lessonSelect = document.getElementById('lesson-select');
const startBtn = document.getElementById('start-quiz-btn');
const selectionSection = document.getElementById('selection-section');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');
const pointsCountEl = document.getElementById('points-count');

const quizTag = document.getElementById('quiz-tag');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const explanationBox = document.getElementById('explanation-box');
const explanationText = document.getElementById('explanation-text');
const nextBtn = document.getElementById('next-btn');
const timerEl = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');

// Init
document.addEventListener('DOMContentLoaded', () => {
    pointsCountEl.textContent = totalPoints;
    populateLessons();

    subjectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            subjectBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSubject = btn.dataset.subject;
            populateLessons();
        });
    });

    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    document.getElementById('restart-btn').addEventListener('click', resetQuiz);
});

function populateLessons() {
    lessonSelect.innerHTML = '';
    const lessons = CURRICULUM[currentSubject];
    lessons.forEach(l => {
        const option = document.createElement('option');
        option.value = l.lessonId;
        option.textContent = l.lessonTitle;
        lessonSelect.appendChild(option);
    });
}

function startQuiz() {
    const selectedLessonId = lessonSelect.value;
    const lesson = CURRICULUM[currentSubject].find(l => l.lessonId === selectedLessonId);
    
    if (!lesson || !lesson.questions.length) return;

    currentQuestions = lesson.questions;
    currentQuestionIndex = 0;
    score = 0;

    quizTag.textContent = lesson.lessonTitle;
    selectionSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    quizSection.classList.remove('hidden');

    loadQuestion();
}

function loadQuestion() {
    clearInterval(timerInterval);
    timeLeft = 25;
    timerEl.textContent = timeLeft;
    
    explanationBox.classList.add('hidden');
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = '';

    const q = currentQuestions[currentQuestionIndex];
    questionText.textContent = q.q;

    // Update progress bar
    const progress = ((currentQuestionIndex) / currentQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => selectAnswer(idx));
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            autoSelectWrong();
        }
    }, 1000);
}

function autoSelectWrong() {
    const q = currentQuestions[currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.answer) btn.classList.add('correct');
    });
    showExplanation(q.explanation);
}

function selectAnswer(index) {
    clearInterval(timerInterval);
    const q = currentQuestions[currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    
    buttons.forEach(btn => btn.disabled = true);

    if (index === q.answer) {
        buttons[index].classList.add('correct');
        score++;
        addPoints(10);
    } else {
        buttons[index].classList.add('wrong');
        buttons[q.answer].classList.add('correct');
    }

    showExplanation(q.explanation);
}

function showExplanation(exp) {
    explanationText.textContent = exp;
    explanationBox.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    document.getElementById('final-score').textContent = score;
    document.getElementById('total-questions').textContent = currentQuestions.length;

    // Sync score to Supabase if available
    if (window.supabase) {
        console.log("إرسال النتيجة إلى Supabase...");
        // Call Supabase saving logic here
    }
}

function addPoints(pts) {
    totalPoints += pts;
    localStorage.setItem('edu_points', totalPoints);
    pointsCountEl.textContent = totalPoints;
}

function resetQuiz() {
    resultSection.classList.add('hidden');
    selectionSection.classList.remove('hidden');
}
