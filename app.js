// Just a simple console message to check if the JS file is running
console.log("QMF JS running");

// ===== VARIABLES =====

// This will hold all the questions we load from JSON
let questions = [];

// This will store the answers the user selects
let userAnswers = [];

// This keeps track of which question the user is on (starts at 0)
let current = 0;

// Mapping of text options to scores
// For example, if user clicks "Très bien", they get 3 points
const scoreMap = {
  "Très mal": 0,
  "Assez mal": 1,
  "Assez bien": 2,
  "Très bien": 3
};

// ===== GET ELEMENTS FROM THE PAGE =====
// These are the things in your HTML we want to update or listen to

const questionText = document.getElementById("question-text"); // the <div> or <p> showing question text
const questionIndex = document.getElementById("question-index"); // shows "1 / 10" etc
const nextBtn = document.getElementById("next-btn"); // the "Next" button
const optionButtons = document.querySelectorAll(".option-button"); // all the buttons the user clicks for answers
const progressBar = document.getElementById("time-bar"); // the visual bar showing progress

// ===== LOAD QUESTIONS =====

// Fetch JSON file with questions
fetch("questions.json")
  .then(res => res.json())  // convert JSON file to JavaScript object
  .then(data => {
    questions = data; // store questions in our variable
    console.log("Questions loaded:", questions); // log to check
    showQuestion(); // show the first question
  })
  .catch(err => console.error("Error loading questions:", err)); // show error if file fails

// ===== FUNCTIONS =====

// Show the current question on screen
function showQuestion() {
  const q = questions[current]; // pick the current question

  // Update question text
  questionText.innerText = q.text;

  // Update question number display like "1 / 10"
  questionIndex.innerText = `${current + 1} / ${questions.length}`;

  // Update progress bar width
  updateProgressBar();

  // Fill each option button with the text of the question's options
  optionButtons.forEach((btn, idx) => {
    btn.innerText = q.options[idx] || ""; // if no option, show empty
    btn.classList.remove("selected"); // remove highlight from any previous selection
  });

  // If we are on the last question, change "Next" button to "Show Results"
  if (current === questions.length - 1) {
    nextBtn.innerText = "Show Results";
  } else {
    nextBtn.innerText = "Next";
  }
}

// Update the progress bar (visually showing how far user is)
function updateProgressBar() {
  const pct = ((current + 1) / questions.length) * 100; // calculate percentage
  progressBar.style.width = pct + "%"; // set the bar width
}

// Compute the final score, considering polarity
// Some questions are "reversed", so we subtract from 3
function computeFinalScore(answer) {
  if (answer.polarity === 2) return 3 - answer.rawScore; // reversed question
  return answer.rawScore; // normal question
}

// ===== OPTION BUTTONS =====

// Add click events for each option button
optionButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Remove highlight from all buttons
    optionButtons.forEach(b => b.classList.remove("selected"));

    // Highlight the one clicked
    button.classList.add("selected");

    // Get the score of the clicked button
    const rawScore = scoreMap[button.innerText];

    // Get current question object
    const q = questions[current];

    // Save user answer
    userAnswers[current] = {
      rawScore,             // points
      category: q.category || "X",  // category (like P, R, C)
      polarity: q.polarity || 1     // normal or reversed
    };

    // Log for debugging
    console.log("Selected answer:", userAnswers[current]);
  });
});

// ===== NEXT BUTTON =====

// When user clicks Next (or Show Results)
nextBtn.addEventListener("click", () => {

  // Make sure user selected an answer
  if (!userAnswers[current]) {
    alert("Please select an answer before continuing.");
    return; // stop function if no answer
  }

  // Go to next question
  current++;

  if (current < questions.length) {
    // If we still have questions, show the next one
    showQuestion();
  } else {
    // Otherwise, we are done with all questions
    // Calculate total scores
    const scores = { P: 0, R: 0, C: 0 };      // total points per category
    const maxScores = { P: 0, R: 0, C: 0 };   // maximum possible points per category

    userAnswers.forEach(answer => {
      const cat = answer.category;
      if (cat in scores) {
        scores[cat] += computeFinalScore(answer); // add points
        maxScores[cat] += 3;                     // maximum per question is 3
      }
    });

    // Save results in localStorage so result page can read it
    localStorage.setItem("qmfResult", JSON.stringify({ ...scores, maxScores }));

    // Go to result page
    window.location.href = "qmf_result.html";
  }
});

