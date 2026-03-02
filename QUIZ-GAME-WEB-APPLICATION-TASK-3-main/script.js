document.addEventListener('DOMContentLoaded', () => {
    // --- NEW Quiz Data for 5th Grade Maths & Science ---
    const easyQuestions = [
        {
            question: "What is the process by which plants make their own food called?",
            type: 'single-select',
            options: ['Photosynthesis', 'Respiration', 'Transpiration', 'Germination'],
            answer: 'Photosynthesis'
        },
        {
            question: "Fill in the blank: A shape with 5 sides is called a ____.",
            type: 'fill-in-the-blank',
            answer: 'Pentagon'
        },
        {
            question: "Which of these are states of matter?",
            type: 'multi-select',
            options: ['Solid', 'Liquid', 'Light', 'Gas'],
            answer: ['Solid', 'Liquid', 'Gas']
        },
        {
            question: "What is 15 multiplied by 4?",
            type: 'single-select',
            options: ['50', '60', '70', '80'],
            answer: '60'
        },
        {
            question: "Which is the largest planet in our Solar System?",
            type: 'single-select',
            options: ['Earth', 'Jupiter', 'Saturn', 'Mars'],
            answer: 'Jupiter'
        }
    ];
    
    const hardQuestions = [
        {
            question: "What is the area of a rectangle with a length of 8 cm and a width of 5 cm?",
            type: 'single-select',
            options: ['13 cm²', '26 cm²', '40 cm²', '35 cm²'],
            answer: '40 cm²'
        },
        {
            question: "Fill in the blank: The force that pulls objects towards the center of the Earth is called ____.",
            type: 'fill-in-the-blank',
            answer: 'Gravity'
        },
        {
            question: "Which of these numbers are prime numbers?",
            type: 'multi-select',
            options: ['9', '11', '15', '17'],
            answer: ['11', '17']
        },
        {
            question: "What is the chemical symbol for water?",
            type: 'single-select',
            options: ['H2O', 'CO2', 'O2', 'NaCl'],
            answer: 'H2O'
        },
        {
            question: "If a pizza is divided into 8 equal slices and you eat 3 slices, what fraction of the pizza is left?",
            type: 'single-select',
            options: ['3/8', '5/8', '1/2', '3/5'],
            answer: '5/8'
        }
    ];

    // --- DOM Elements ---
    const difficultyScreen = document.getElementById('difficulty-screen');
    const quizContent = document.getElementById('quiz-content');
    const resultsScreen = document.getElementById('results-screen');
    const easyBtn = document.getElementById('easy-btn');
    const hardBtn = document.getElementById('hard-btn');
    const showAnswersBtn = document.getElementById('show-answers-btn');
    const answerSummaryContainer = document.getElementById('answer-summary-container');
    const answerSummary = document.getElementById('answer-summary');
    const questionArea = document.getElementById('question-area');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const restartBtn = document.getElementById('restart-btn');
    const homeBtn = document.getElementById('home-btn');
    const topBackBtn = document.getElementById('top-back-btn');
    const scoreText = document.getElementById('score-text');
    const scoreMessage = document.getElementById('score-message');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const timerDisplay = document.getElementById('timer-display');
    const timeEl = document.getElementById('time');
    const validationError = document.getElementById('validation-error');
    
    // --- Quiz State ---
    let currentQuestions = [];
    let currentDifficulty = '';
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let answerCorrectness = [];
    let questionTimer;
    const TIME_PER_QUESTION = 15;

    // --- Screen Management ---
    const allScreens = [difficultyScreen, quizContent, resultsScreen];
    const showScreen = (screenToShow) => {
        allScreens.forEach(screen => {
            if (screen === screenToShow) {
                screen.classList.remove('hidden');
                screen.classList.add('active');
            } else {
                screen.classList.add('hidden');
                screen.classList.remove('active');
            }
        });
    };

    // --- Timer Functions ---
    const startTimer = () => {
        clearInterval(questionTimer); 
        let timeLeft = TIME_PER_QUESTION;
        timeEl.textContent = timeLeft;
        timerDisplay.classList.remove('hidden');

        questionTimer = setInterval(() => {
            timeLeft--;
            timeEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(questionTimer);
                navigate('next', { timeUp: true });
            }
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(questionTimer);
        timerDisplay.classList.add('hidden');
    };

    // --- Quiz Flow Functions ---
    const startQuiz = (difficulty) => {
        currentDifficulty = difficulty;
        currentQuestions = difficulty === 'easy' ? easyQuestions : hardQuestions;
        
        stopTimer();
        answerSummaryContainer.classList.add('hidden');
        showAnswersBtn.classList.remove('hidden');

        currentQuestionIndex = 0;
        userAnswers = new Array(currentQuestions.length).fill(null);
        showQuestion();
        showScreen(quizContent);
    };
    
    const goToHome = () => {
        stopTimer();
        // quiz lives in a subdirectory – go back to root index.html
        // previous path ('../Homepage/index.html') was incorrect and caused the button to fail
        window.location.href = '../index.html';
    };

    const showQuestion = () => {
        validationError.classList.add('hidden');
        const question = currentQuestions[currentQuestionIndex];
        questionArea.innerHTML = ''; 

        const questionText = document.createElement('h3');
        questionText.id = 'question-text';
        questionText.textContent = question.question;
        questionArea.appendChild(questionText);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'answer-options';

        if (question.type === 'single-select' || question.type === 'multi-select') {
            question.options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'answer-btn';
                button.textContent = option;
                if (userAnswers[currentQuestionIndex]?.includes(option)) {
                    button.classList.add('selected');
                }
                button.addEventListener('click', () => handleSelection(button, option, question.type));
                optionsContainer.appendChild(button);
            });
        } else if (question.type === 'fill-in-the-blank') {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'fill-in-blank-input';
            input.placeholder = 'Type your answer here...';
            input.value = userAnswers[currentQuestionIndex] || '';
            input.addEventListener('input', () => {
                userAnswers[currentQuestionIndex] = input.value;
                validationError.classList.add('hidden');
            });
            optionsContainer.appendChild(input);
        }
        questionArea.appendChild(optionsContainer);
        updateNavigation();
        startTimer();
    };
    
    const handleSelection = (button, option, type) => {
        validationError.classList.add('hidden');
        if (type === 'single-select') {
            userAnswers[currentQuestionIndex] = [option];
            document.querySelectorAll('.answer-btn').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        } else if (type === 'multi-select') {
            const currentSelections = userAnswers[currentQuestionIndex] || [];
            if (currentSelections.includes(option)) {
                userAnswers[currentQuestionIndex] = currentSelections.filter(item => item !== option);
            } else {
                userAnswers[currentQuestionIndex] = [...currentSelections, option];
            }
            button.classList.toggle('selected');
        }
    };
    
    const updateNavigation = () => {
        prevBtn.classList.toggle('hidden', currentQuestionIndex === 0);
        nextBtn.textContent = currentQuestionIndex === currentQuestions.length - 1 ? 'Finish Quiz' : 'Next';
    };

    const navigate = (direction, options = {}) => {
        if (direction === 'next') {
            const userAnswer = userAnswers[currentQuestionIndex];
            const isAnswered = userAnswer && (userAnswer.length > 0 && userAnswer[0] !== '' || typeof userAnswer === 'string' && userAnswer.trim() !== '');

            if (!isAnswered && !options.timeUp) {
                validationError.textContent = "Please provide an answer before continuing.";
                validationError.classList.remove('hidden');
                return;
            }
            
            if (currentQuestionIndex < currentQuestions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                calculateScoreAndShowResults();
            }
        } else if (direction === 'prev') {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                showQuestion();
            }
        }
    };

    const calculateScoreAndShowResults = () => {
        stopTimer();
        let score = 0;
        answerCorrectness = [];

        currentQuestions.forEach((q, index) => {
            const userAnswer = userAnswers[index];
            let isCorrect = false;

            if (userAnswer) {
                 if (q.type === 'multi-select') {
                    const sortedUserAnswer = [...userAnswer].sort();
                    const sortedCorrectAnswer = [...q.answer].sort();
                    if (JSON.stringify(sortedUserAnswer) === JSON.stringify(sortedCorrectAnswer)) {
                        isCorrect = true;
                    }
                } else if (q.type === 'fill-in-the-blank') {
                    if (typeof userAnswer === 'string' && userAnswer.trim().toLowerCase() === q.answer.toLowerCase()) {
                        isCorrect = true;
                    }
                } else {
                    if (Array.isArray(userAnswer) && userAnswer[0] === q.answer) {
                        isCorrect = true;
                    }
                }
            }
            
            if(isCorrect) score++;
            answerCorrectness.push(isCorrect);
        });
        
        showScreen(resultsScreen);
        scoreText.textContent = `${score} / ${currentQuestions.length}`;
        
        const percentage = (score / currentQuestions.length) * 100;
        if (percentage === 100) {
            scoreMessage.textContent = "Outstanding! You got a perfect score!";
        } else if (percentage >= 75) {
            scoreMessage.textContent = "Excellent work! You really know your stuff.";
        } else if (percentage >= 50) {
            scoreMessage.textContent = "Good job! A very respectable score.";
        } else {
            scoreMessage.textContent = "Nice try! Every quiz is a chance to learn something new.";
        }
    };
    
    const displayAnswerSummary = () => {
        answerSummaryContainer.classList.remove('hidden');
        answerSummary.innerHTML = ''; 

        currentQuestions.forEach((q, index) => {
            const reviewBlock = document.createElement('div');
            reviewBlock.className = 'answer-review';
            
            const questionText = `<p class="question-text">${index + 1}. ${q.question}</p>`;
            
            const userAnswer = userAnswers[index];
            let userAnswerText = '';
            if(!userAnswer || userAnswer.length === 0 || (typeof userAnswer === 'string' && userAnswer.trim() === '')){
                userAnswerText = `<p class="user-answer incorrect">Your answer: Not Answered</p>`;
            } else {
                const correctnessClass = answerCorrectness[index] ? 'correct' : 'incorrect';
                const formattedUserAnswer = Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer;
                userAnswerText = `<p class="user-answer ${correctnessClass}">Your answer: ${formattedUserAnswer}</p>`;
            }

            const correctAnswerText = answerCorrectness[index] ? '' : `<p class="correct-answer">Correct answer: ${Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}</p>`;

            reviewBlock.innerHTML = questionText + userAnswerText + correctAnswerText;
            answerSummary.appendChild(reviewBlock);
        });
        showAnswersBtn.classList.add('hidden');
    };

    // --- Theme Switcher ---
    const toggleTheme = () => {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        }
    };
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // --- Event Listeners ---
    easyBtn.addEventListener('click', () => startQuiz('easy'));
    hardBtn.addEventListener('click', () => startQuiz('hard'));
    restartBtn.addEventListener('click', () => startQuiz(currentDifficulty));
    homeBtn.addEventListener('click', goToHome);
    if (topBackBtn) topBackBtn.addEventListener('click', goToHome);
    showAnswersBtn.addEventListener('click', displayAnswerSummary);
    nextBtn.addEventListener('click', () => navigate('next'));
    prevBtn.addEventListener('click', () => navigate('prev'));
    themeToggleBtn.addEventListener('click', toggleTheme);
});