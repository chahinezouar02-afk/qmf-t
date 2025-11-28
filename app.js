let questions = [];
let currentQuestion = 0;
let answers = [];

document.getElementById("start-btn").addEventListener("click", startTest);
document.getElementById("next-btn").addEventListener("click", nextQuestion);

function startTest() {
    fetch("questions.json")
        .then(res => res.json())
        .then(data => {
            questions = data;
            document.getElementById("start-screen").classList.add("hidden");
            document.getElementById("test-container").classList.remove("hidden");
            showQuestion();
        });
}

function showQuestion() {
    let q = questions[currentQuestion];
    document.getElementById("question-text").innerText = q.text;

    let optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach((opt, index) => {
        optionsDiv.innerHTML += `
            <label>
                <input type="radio" name="option" value="${index}">
                ${opt}
            </label><br>
        `;
    });
}

function nextQuestion() {
    let selected = document.querySelector('input[name="option"]:checked');

    if (!selected) {
        alert("Please select an answer.");
        return;
    }

    answers.push(parseInt(selected.value));

    currentQuestion++;

    if (currentQuestion >= questions.length) {
        finishTest();
    } else {
        showQuestion();
    }
}

function finishTest() {
    document.getElementById("test-container").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");

    // You will replace this when you get the official scoring formula
    let score = answers.reduce((a, b) => a + b, 0);

    document.getElementById("result-text").innerText =
        "Your raw score is: " + score;
}
