console.log("QMF JS running");

fetch("questions.json")
  .then(response => response.json())
  .then(data => {
    questions = data;
    console.log("Questions ready:", questions);

    // start the test only AFTER data exists
    showQuestion();
  });
function showQuestion() {
  let currentQuestion = questions[current];

  questionText.innerText = currentQuestion.text;
  questionIndex.innerText = (current + 1) + " / " + questions.length;
  updateProgressBar();

  // clear old selection
  optionButtons.forEach(b => {
    b.classList.remove("selected");
    b.innerText = "";
  });

  // fill options
  currentQuestion.options.forEach((option, index) => {
    optionButtons[index].innerText = option;
  });
} 

// score math
const scoreMap = {
  "Très mal": 0,
  "Assez mal": 1,
  "Assez bien": 2,
  "Très bien": 3
};

// the reverse score function
function applyPolarity(rawScore, polarity) {
  if (polarity === 2) {
    return 3 - rawScore;
  }
  return rawScore;
}

//empty score buckets
let scores = {
  P: 0,
  R: 0,
  C: 0
};





// the progress bar element
let progressBar = document.getElementById("time-bar");
function updateProgressBar() {
  let percentage = ((current +1) / questions.length) * 100;
  progressBar.style.width = percentage + "%";
}



// store user answers
let userAnswers = [];

let questions = [];


let current = 0;

// Grab HTML elements
let questionText = document.getElementById("question-text");
let questionIndex = document.getElementById("question-index");
let nextBtn = document.getElementById("next-btn");
let optionButtons = document.querySelectorAll(".option-button");


// OPTION BUTTONS logic (ONLY selection)
optionButtons.forEach(button => {
  button.addEventListener("click", () => {
    optionButtons.forEach(b => b.classList.remove("selected"));
    button.classList.add("selected");

    const rawScore = scoreMap[button.innerText];

    userAnswers[current] = {
      rawScore: rawScore,
      category: questions[current].category || "X",
      polarity: questions[current].polarity || 1
    };

    console.log("Answer stored:", userAnswers[current]);
  });
});


//to calculate score according to polarity
function computeFinalScore(answer) {
  if (answer.polarity === 2) {
    return 3 - answer.rawScore;
  }
  return answer.rawScore;
}









// NEXT BUTTON logic
nextBtn.addEventListener("click", () => {

  if (userAnswers[current] === undefined) {
    alert("Please select an answer before continuing.");
    return;
  }

  //  score the CURRENT question
  let final = computeFinalScore(userAnswers[current]);
  console.log("Final score:", final);

  current++;

  if (current < questions.length) {
    showQuestion();
  } else {
    alert("Test finished");
    console.log("All answers:", userAnswers);
  }
});
