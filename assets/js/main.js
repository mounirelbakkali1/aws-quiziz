let holderUserAnswersArray;
window.onbeforeunload = function (event) {
  return confirm("Confirm refresh");
};
$(document).ready(async function () {
  loadQuize();
});
let randomArr = random(10, 0);

async function loadQuize() {
  let url = "http://localhost:3000/quiz";
  let res = await fetch(url)
    .then((data) => data.json())
    // .then((data) => console.log(data.quiz))
    .then((data) => afficher(data))
    .catch(async () => {
      let res = await fetch("../data/db.json")
        .then((data) => data.json())
        // .then((data) => console.log(data.quiz))
        .then((data) => afficher(data.quiz));
    });
  function afficher(data) {
    let output = "";
    data.forEach((quiz) => {
      output += `
		   <div class="quiz-box">
		   <h3>${quiz.title}</h3>
		   <p>${quiz.questions.length} questions</p>
		   <p>${quiz.description}</p>
		   <button class='btn btn-orange bold'onclick='startQuiz(${quiz.id})'>start quiz</button>
		   </div>
		   `;
    });
    $(".container").html(output);
  }
  return;
}

function startQuiz(idQuiz) {
  document.getElementById("questionaire").classList.add("active");
  document.getElementById("result_part").classList.remove("active");
  document.querySelector(".score").style.opacity = "0";
  document.querySelector(".score").style.visibility = "hidden";
  holderUserAnswersArray = [];
  $(".container").animate({
    height: "+=200px",
    padding: "30px",
  });
  let questions = fetch("http://localhost:30000/quiz/" + idQuiz)
    .then((data) => data.json())
    .then(() => {
      throw new Error("jjeze");
    })
    .then((data) => diplayquestions(data))
    .catch(() => {
      let qts = fetch("../data/db.json")
        .then((data) => data.json())
        // .then((data) => console.log(data.quiz[idQuiz - 1]))
        .then((data) => diplayquestions(data.quiz[idQuiz - 1]));
    });
}
function diplayquestions(quiz) {
  function processQuestions(question) {
    let options = "";
    // The every() function behaves exactly like forEach(), except it stops iterating through the array whenever the callback function returns a falsy value.

    question.options.forEach((option) => {
      options += `
          <div class="option" style="position:relative;">
            <div style="display:flex">
              <span>${option.id}</span>
              <input type="radio" name="response" class="radio" value="${option.id}">
              ${option.content}
            </div>
          </div>`;
    });

    let template = `<div id="quiz-questions-box" style="position:relative">
        <div><i class="bi bi-box" style="margin-right:10px"></i>AWS - QUIZ</div>
        <div style="display:flex;justify-content:space-between;">
        <p>Question ${index + 1}/${quiz.questions.length}</p>
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
          <script>
          
        </script>
        <progress max="100" value="100"></progress>
        </div>`;
    $(".container").html(template);

    /*











    */
  }
  let index = 0; // The index of the next element to show
  function doNext() {
    processQuestions(Object.values(quiz.questions)[randomArr[index]]); // affichage des questions
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
        if (index == quiz.questions.length) showresult(quiz);
      }
    }, 1000);
    /*
	
	------------- TIMER ------------
	
	*/

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
      if (index == quiz.questions.length) {
        showresult(quiz);
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
    if (index < Object.values(quiz.questions).length) {
      var timer = setTimeout(doNext, 30000); // 5000 for a five-second delay
    }
  }
  var passed;
  var secondsCounter;
  doNext();
}
function showresult(data) {
  document.getElementById("result_part").classList.add("active");
  let arr = holderUserAnswersArray.sort((p1, p2) =>
    p1.questionId > p2.questionId ? 1 : p1.questionId < p2.questionId ? -1 : 0
  );
  let questions = Object.values(data.questions);
  let correctOnes = 0;
  for (let i = 1; i <= questions.length; i++) {
    const element = questions[i - 1].answers;
    if (element.correct == arr[i - 1].resId) correctOnes++;
  }
  var score = (correctOnes / questions.length) * 100;
  let feedBack =
    score < 30 ? "Not Bad" : score < 60 ? "Good results" : "Exellent keep up";
  $(".container").empty();

  // The every() function behaves exactly like forEach(), except it stops iterating through the array whenever the callback function returns a falsy value.
  let template = "";
  let i = 0;
  questions.forEach((question) => {
    let options = "";
    let _class = "";
    //let test = false;
    question.options.forEach((option) => {
      if (
        holderUserAnswersArray[i].resId == question.answers.correct &&
        question.answers.correct == option.id
      ) {
        _class = "success";
      } else if (
        holderUserAnswersArray[i].resId != question.answers.correct &&
        holderUserAnswersArray[i].resId == option.id
      )
        _class = "wrong";
      else _class = "";
      options += `<div class="option ${_class}"><div style="display:flex"><span>${option.id}</span>${option.content}</div></div>`;
    });

    template += `
        <div>
        <p>Question ${question.id}/${data.questions.length}</p>
        <h3 style="padding:30px 0px">${question.question}</h3>
          ${options}
          <p class='score_question_comment'><img src='../assets/img/icons8-ok-48.png'>${question.answers.comment}</p>
        </div>`;
    i++;
  });
  // template += `
  // <button class="btn btn-orange bold" style="width: 100%;height:50px;margin-top:100px" onclick="startQuiz(1)">Retake quiz</button>
  // `;
  //document.getElementsByClassName(".container").$(selected).removeAttr('" attribute you want to remove "');
  $(".container").removeAttr("style");
  $(".container").css({ color: "white" });
  $("body").css({ height: "fit-content", overflow: "auto" });
  $(".container").html(template);
  $("#username").text(feedBack + " " + sessionStorage.getItem("name"));
  document.querySelector(".score").style.opacity = "1";
  document.querySelector(".score").style.visibility = "visible";
  //$(".score").animate({ display: "block" }, 1000, "swing");
  $("#score").text(score + "%  Score");
  $("#score_details").html(`
  You attempt<span style="color:blue"><b> ${questions.length} question</b></span> from that <span style="color:#72d561"><b>${correctOnes} answer </b></span> are correct`);
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
