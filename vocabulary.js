let questions = [];
let currentIndex = 0;
let totalScore = 0;
let selectedScore = null;

// تحميل الأسئلة من ملف JSON
fetch("vocabulary.json")
    .then(response => response.json())
    .then(data => {
        questions = data;
        showQuestion();
    });

// عرض السؤال
function showQuestion() {
    selectedScore = null;
    document.getElementById("next-btn").disabled = true;

    const question = questions[currentIndex];

    document.getElementById("question-word").textContent =
        `Word ${currentIndex + 1}: ${question.text}`;

    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    question.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option.text;
       btn.className = "option-button";

        btn.onclick = () => {
            selectedScore = option.score;
            document.getElementById("next-btn").disabled = false;

            // إزالة التحديد من كل الأزرار
            document.querySelectorAll(".option-button").forEach(b => {
                b.classList.remove("selected");
            });

            btn.classList.add("selected");
        };

        optionsContainer.appendChild(btn);
    });

    document.getElementById("progress").textContent =
        `${currentIndex + 1} / ${questions.length}`;
}

// زر التالي
document.getElementById("next-btn").addEventListener("click", () => {
    totalScore += selectedScore;
    currentIndex++;

    if (currentIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

// عرض النتيجة
function showResult() {
    // تخزين النتيجة في المتصفح
    localStorage.setItem("vocabularyScore", totalScore);

    // الانتقال إلى صفحة النتيجة
    window.location.href = "vocabulary_result.html";
}
