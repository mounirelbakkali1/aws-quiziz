let holderUserAnswersArray;
window.onbeforeunload = function (event) {
  return confirm("Confirm refresh");
};
$(document).ready(async function () {
  loadQuize();
});
let randomArr;

async function loadQuize() {
  hideScore();
  document.getElementById("questionaire").classList.remove("active");
  document.getElementById("result_part").classList.remove("active");
  var quizzes = $.ajax({
    type: "GET",
    url: "../Models/RequestHandler.php",
    data: {
      loadQuizes: true,
    },
    cache: false,
    async: false,
  });
  quizzes = JSON.parse(quizzes.responseText);
  afficher(quizzes);
  function afficher(data) {
    let output = "";
    data.forEach((quiz) => {
      output += `
		   <div class="quiz-box" style='margin-top:20px'>
		   <h3>${quiz.quiz.title}</h3>
		   <p>${quiz.numOfQuestions} questions</p>
		   <p>${quiz.quiz.description}</p>
		   <button class='btn btn-orange bold'onclick='startQuiz(${quiz.quiz.id},${quiz.numOfQuestions})'>start quiz</button>
		   </div>
		   `;
    });
    $(".container").html(output);
  }
  return;
}

function startQuiz(idQuiz, numOfQuestions) {
  randomArr = random(numOfQuestions, 0);
  document.getElementById("questionaire").classList.add("active");
  document.getElementById("result_part").classList.remove("active");
  document.querySelector(".score").style.opacity = "0";
  document.querySelector(".score").style.visibility = "hidden";
  holderUserAnswersArray = [];
  $(".container").animate({
    height: "+=200px",
    padding: "30px",
  });
  var questions = $.ajax({
    type: "GET",
    url: "../Models/RequestHandler.php",
    data: { questions: true, quizId: idQuiz },
    dataType: "json",
    cache: false,
    async: false,
  });
  questions = JSON.parse(questions.responseText);
  diplayquestions(questions, idQuiz);
}
function diplayquestions(quiz, idQuiz) {
  function processQuestions(question) {
    let options = "";
    let u = 1;
    let alphabet = ["A", "B", "C", "D"];
    question.options.forEach((option) => {
      options += `
          <div class="option" style="position:relative;">
            <div style="display:flex">
              <span>${alphabet[u - 1]}</span>
              <input type="radio" name="response" class="radio" value="${
                option.id
              }">
              <p style="margin:10px">${option.content}</p>
            </div>
          </div>`;
      u++;
    });
    let template = `<div id="quiz-questions-box" style="position:relative">
        <div><i class="bi bi-box" style="margin-right:10px"></i>AWS - QUIZ</div>
        <div style="display:flex;justify-content:space-between;">
        <p>Question ${index + 1}/${quiz.length}</p>
        <p id="seconds"></p>
        </div>
        <h3 style="padding:0px">${question.question}</h3>
        <form id="questions_form">
        <div style="display:grid;gap:10px">
        <input type="hidden" name="quizeID" value="${quiz.id}">
        <input type="hidden" name="questionID" value="${question.id}">
          ${options}
          <div style="margin-top:30px;text-align:end;">
          <button style="border-radius:10px;" type="submit" class="btn btn-orange bold">submit</button>
          </div>
          </form>
          </div>
        <progress max="100" value="100"></progress>
        </div>`;
    $(".container").html(template);
  }
  let index = 0; // The index of the next element to show
  function doNext() {
    processQuestions(quiz[randomArr[index]]); // affichage des questions
    /*
	------------------------ TIMER ---------------
	*/

    var t = new Date();
    t.setSeconds(t.getSeconds() + 30);
    var distance;

    secondsCounter = setInterval(() => {
      var now = new Date().getTime();
      distance = t - now;
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      $("#seconds").text(seconds + ` seconds`);
      $("progress").val(seconds * 3.3);
      if (distance <= 0) {
        clearInterval(secondsCounter);
        secondsCounter = null;
        $("#seconds").text("Time out !");
        passed = false;
        holderUserAnswersArray.push({
          questionId: form.questionID.value,
          resId: 0,
          quizId: form.quizeID.value,
        });
        if (index == quiz.questions.length) showresult(quiz, idQuiz);
      }
    }, 1000);
    ++index;
    var form = document.forms.namedItem("questions_form");
    form.reset();
    form.addEventListener("submit", function processQuiz(e) {
      e.preventDefault();
      const val = Object.values(form.response).filter((input) => input.checked); // convert Object to array
      if (val.length == 0) {
        alert("select an option");
        return;
      }

      holderUserAnswersArray.push({
        questionId: form.questionID.value,
        resId: val[0].value,
        quizId: form.quizeID.value,
      });

      clearInterval(secondsCounter);
      secondsCounter = null;
      passed = true;
      if (index == quiz.length) {
        showresult(quiz, idQuiz);
        return;
      } else {
        clearInterval(timer);
        doNext();
      }
    });
    var radios = document.querySelectorAll(".radio");
    radios.forEach((radio) => {
      radio.addEventListener(
        "change",
        function () {
          form.response.forEach((input) => {
            input.parentElement.parentElement.classList.remove("selected");
          });
          this.parentElement.parentElement.classList.add("selected");
        },
        false
      );
    });
    if (index < quiz.length) {
      var timer = setTimeout(doNext, 30000); // 5000 for a five-second delay
    }
  }
  var passed;
  var secondsCounter;
  doNext();
}

function showresult(data, idQuiz) {
  document.getElementById("result_part").classList.add("active");
  holderUserAnswersArray.sort((a, b) => a.questionId - b.questionId);
  var responseJSON = $.ajax({
    type: "GET",
    url: "../Models/RequestHandler.php",
    data: {
      userAnswers: JSON.stringify(holderUserAnswersArray),
      quizId: idQuiz,
      username: sessionStorage.getItem("name"),
    },
    cache: false,
    async: false,
  });
  responseJSON = JSON.parse(responseJSON.responseText);
  let template = responseJSON.template;
  template += `<button class="btn btn-orange bold" style="width: 100%;margin-top: 100px;padding: 20px;" onclick="loadQuize()">Retake quiz</button>`;
  $(".container").empty();
  $(".container").removeAttr("style");
  $(".container").css({ color: "white" });
  $("body").css({ height: "fit-content", overflow: "auto" });
  $(".container").html(template);
  $("#username").html(
    responseJSON.feedback + " " + sessionStorage.getItem("name")
  );
  document.querySelector(".score").style.opacity = "1";
  document.querySelector(".score").style.visibility = "visible";
  $("#score").html(responseJSON.score + "%  Score");
  $("#score_details").html(`
  You attempt<span style="color:blue"><b> ${data.length} question</b></span> from that <span style="color:#72d561"><b>${responseJSON.correctOnes} answer </b></span> are correct`);
}

function random(max, min) {
  arr = [];
  for (i = 0; i < max; i++) {
    x = Math.floor(Math.random() * max) + min;
    if (arr.includes(x) == true) {
      i = i - 1;
    } else {
      if (x > max == false) {
        arr.push(x);
      }
    }
  }
  return arr;
}
function hideScore() {
  $(".score").css({ opacity: 0, visibility: "hidden" });
}
