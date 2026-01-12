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

// DOM elements
const questionText = document.getElementById("question-text");
const questionIndex = document.getElementById("question-index");
const nextBtn = document.getElementById("next-btn");
const optionButtons = document.querySelectorAll(".option-button");
const progressBar = document.getElementById("time-bar");

// fetch questions from JSON
fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    console.log("Questions loaded:", questions);
    showQuestion();
  })
  .catch(err => console.error("Error loading questions:", err));

// ========== FUNCTIONS ==========

// show current question
function showQuestion() {
  const q = questions[current];

  questionText.innerText = q.text;
  questionIndex.innerText = `${current + 1} / ${questions.length}`;
  updateProgressBar();

  // fill options
  optionButtons.forEach((btn, idx) => {
    btn.innerText = q.options[idx] || "";
    btn.classList.remove("selected");
  });

  // if last question, change Next button text
  if (current === questions.length - 1) {
    nextBtn.innerText = "Show Results";
  } else {
    nextBtn.innerText = "Next";
  }
}

// update progress bar
function updateProgressBar() {
  const pct = ((current + 1) / questions.length) * 100;
  progressBar.style.width = pct + "%";
}

// compute final score with polarity
function computeFinalScore(answer) {
  if (answer.polarity === 2) return 3 - answer.rawScore;
  return answer.rawScore;
}

// ========== OPTION BUTTONS ==========
optionButtons.forEach(button => {
  button.addEventListener("click", () => {
    // mark selected
    optionButtons.forEach(b => b.classList.remove("selected"));
    button.classList.add("selected");

    const rawScore = scoreMap[button.innerText];
    const q = questions[current];

    userAnswers[current] = {
      rawScore,
      category: q.category || "X",
      polarity: q.polarity || 1
    };

    console.log("Selected answer:", userAnswers[current]);
  });
});

// ========== NEXT BUTTON ==========
nextBtn.addEventListener("click", () => {
  // must select an option
  if (!userAnswers[current]) {
    alert("Please select an answer before continuing.");
    return;
  }

  current++;

  if (current < questions.length) {
    showQuestion();
  } else {
    // finished all questions, save results and redirect
    const scores = { P: 0, R: 0, C: 0 };
    const maxScores = { P: 0, R: 0, C: 0 };

    userAnswers.forEach(answer => {
      const cat = answer.category;
      if (cat in scores) {
        scores[cat] += computeFinalScore(answer);
        maxScores[cat] += 3;
      }
    });

    localStorage.setItem("qmfResult", JSON.stringify({ ...scores, maxScores }));

    // redirect to result page
    window.location.href = "qmf_result.html";
  }
});

