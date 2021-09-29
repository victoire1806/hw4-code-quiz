const questionTime = 5;
const questionPointVal = 10;

const numQuestions = questionBank.length;
const quizTime = numQuestions * questionTime;
let quizTimer;
let timeRemaining;
let questionNum = -1;
let numQuestionRight = 0;
let quizScore = 0;


const shuffleArray = (array) => {

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


const renderTime = (timeSeconds) => {
  const minutes = Math.floor(timeSeconds / 60);
  let seconds = timeSeconds % 60;
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${seconds}`;
};


const startQuiz = () => {
  
  getQuestions();


  document.getElementById("num-questions").textContent = numQuestions;

  startTimer(quizTime);


  nextQuestion();
};


const getQuestions = () => {
  
  shuffleArray(questionBank);

  
  for (const question of questionBank) {
    question.choices = [question.answer, ...question.incorrect_answers];
    shuffleArray(question.choices);
  }
};

const nextQuestion = () => {

    questionNum++;

  
  if (questionNum < numQuestions && timeRemaining > 0) {

    questionCounter.textContent = questionNum + 1;
    question = questionBank[questionNum];


    questionText.textContent = question.question;


    for (let c = 0; c < question.choices.length; c++) {
      questionChoices[c].dataset.text = question.choices[c];
      questionChoices[c].textContent = question.choices[c];
    }
  } else if (timeRemaining === 0) {
    endQuiz("Times Up");
  } else {
    endQuiz("All Done!");
  }
};


const checkAnswer = (userAnswer) => {


    if (userAnswer === questionBank[questionNum].answer) {
    numQuestionRight++;
    showAlert("Correct", "success");
  } else {
    timeRemaining =
      timeRemaining > questionTime ? (timeRemaining -= questionTime) : 0;
    showAlert("Incorrect", "danger");
    showTimeDeduction(`-${questionTime}`);
  }


  nextQuestion();
};


const startTimer = (quizTime) => {

    timeRemaining = quizTime;
  quizTimerEl.textContent = renderTime(timeRemaining);


  quizTimer = setInterval(() => {
    if (timeRemaining > 0) {
      if (timeRemaining === 6) {
        quizTimerEl.classList.add("text-danger");
      }
      quizTimerEl.textContent = renderTime(--timeRemaining);
    } else {
      quizTimerEl.textContent = renderTime(timeRemaining);
      endQuiz("Times Up");
    }
  }, 1000);
};


const endQuiz = (quizMessage) => {

    clearInterval(quizTimer);
  quizTimerEl.textContent = renderTime(timeRemaining);
  quizScore += numQuestionRight * questionPointVal + timeRemaining;


  showQuizResult(quizMessage);
};


const showQuizResult = (quizMessage) => {

    questionCard.hidden = true;

  quizResultEl.hidden = false;
  quizMsgEl.textContent = quizMessage;
  quizScoreEl.textContent = quizScore;
};

// Save quiz result to session storage
const saveQuizResult = (quizResult) => {
  sessionStorage.setItem("newScore", JSON.stringify(quizResult));
};

// Show answer alert
const showAlert = (message, alertType) => {
  // Create alert div
  const alert = document.createElement("div");
  alert.className = `alert alert-${alertType} text-center mt-4`;
  alert.appendChild(document.createTextNode(message));

  // Insert alert div in DOM
  const elmnt = document.getElementById("quiz-result");
  elmnt.parentElement.insertBefore(alert, elmnt.nextElementSibling);

  // Timeout alert message after 1 second
  setTimeout(() => {
    document.querySelectorAll(".alert").forEach((e) => {
      e.remove();
    });
  }, 1000);
};

const showTimeDeduction = (message) => {
  
  const alert = document.createElement("p");
  alert.className = `alert text-danger navbar-text m-0 py-2`;
  alert.textContent = message;

  // Insert alert 
  const elmnt = document.getElementById("quiz-time");
  elmnt.insertAdjacentElement("afterend", alert);
};


// Query Selectors
const questionCounter = document.getElementById("question-num");
const quizTimerEl = document.getElementById("quiz-timer");
const questionCard = document.getElementById("question-card");
const questionText = document.getElementById("question-text");
const questionChoicesList = document.getElementById("choices-list");
const questionChoices = document.querySelectorAll(".choice");

const quizResultEl = document.getElementById("quiz-result");
const quizMsgEl = document.getElementById("quiz-message");
const quizScoreEl = document.getElementById("quiz-score");
const btnSubmitScore = document.getElementById("btn-submit-score");
const btnTryAgain = document.getElementById("btn-try-again");

// Event listener on answer choices
questionChoicesList.addEventListener("click", (e) => {
  const element = e.target;

  if (element.matches(".choice")) {
    checkAnswer(element.dataset.text);
  }
});

btnSubmitScore.addEventListener("click", (e) => {
  e.preventDefault();

  const initials = document.getElementById("initials").value;
  if (initials.length !== 2) {
    showAlert("Enter two letter initials", "danger");
    return;
  }

  quizResult = {
    initials: initials,
    quizScore: `${quizScore}`,
    numCorrect: `${numQuestionRight}/${numQuestions}`,
    quizTime: renderTime(quizTime - timeRemaining),
  };


  saveQuizResult(quizResult);

  // Redirect to quiz scores page
  // location.replace("/html/highscores.html");
  location.replace(
    "file:///Users/annejoseph/hw4-code-quiz/assets/html/highScore.html"
  );
});

// WEBPAGE EXECUTION:
startQuiz();
