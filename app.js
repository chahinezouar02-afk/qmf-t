console.log("QMF JS running");

let questions = [];
let userAnswers = [];
let current = 0;

const scoreMap = {
  "Très mal": 0,
  "Assez mal": 1,
  "Assez bien": 2,
  "Très bien": 3
};

// Grab HTML elements
const questionText = document.getElementById("question-text");
const questionIndex = document.getElementById("question-index");
const nextBtn = document.getElementById("next-btn");
const optionButtons = document.querySelectorAll(".option-button");
const progressBar = document.getElementById("time-bar");

// fetch questions
fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    console.log("Questions ready:", questions);
    showQuestion();
  });

// show current question
function showQuestion() {
  const currentQuestion = questions[current];

  questionText.innerText = currentQuestion.text;
  questionIndex.innerText = `${current + 1} / ${questions.length}`;
  updateProgressBar();

  optionButtons.forEach(b => {
    b.classList.remove("selected");
    b.innerText = "";
  });

  currentQuestion.options.forEach((option, idx) => {
    optionButtons[idx].innerText = option;
  });
}

// update progress bar
function updateProgressBar() {
  const pct = ((current + 1) / questions.length) * 100;
  progressBar.style.width = pct + "%";
}

// select option
optionButtons.forEach(button => {
  button.addEventListener("click", () => {
    optionButtons.forEach(b => b.classList.remove("selected"));
    button.classList.add("selected");

    const rawScore = scoreMap[button.innerText];
    const q = questions[current];

    userAnswers[current] = {
      rawScore: rawScore,
      category: q.category || "X",
      polarity: q.polarity || 1
    };
  });
});

// compute score with polarity
function computeFinalScore(answer) {
  if (answer.polarity === 2) return 3 - answer.rawScore;
  return answer.rawScore;
}

// handle next button
nextBtn.addEventListener("click", () => {
  if (!userAnswers[current]) {
    alert("Please select an answer before continuing.");
    return;
  }

  current++;

  if (current < questions.length) {
    showQuestion();
  } else {
    // calculate scores per dimension
    const scores = { P: 0, R: 0, C: 0 };
    const maxScores = { P: 0, R: 0, C: 0 };

    userAnswers.forEach((answer, idx) => {
      const cat = answer.category;
      if (cat in scores) {
        scores[cat] += computeFinalScore(answer);
        maxScores[cat] += 3; // max 3 per question
      }
    });

    const resultData = {
      P: scores.P,
      R: scores.R,
      C: scores.C,
      maxScores: maxScores
    };

    localStorage.setItem("qmfResult", JSON.stringify(resultData));

    // go to results page
    window.location.href = "qmf_result.html";
  }
});
