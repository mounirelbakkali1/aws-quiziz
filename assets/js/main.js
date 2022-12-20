let holderUserAnswersArray;
window.onbeforeunload = function (event) {
  return confirm("Confirm refresh");
};
$(document).ready(async function () {
  loadQuize();
});

async function loadQuize() {
  let url = "http://localhost:3000/quiz";
  let res = await fetch(url);
  const json = await res.json();
  let output = "";
  json.forEach((quiz) => {
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

function startQuiz(idQuiz) {
  holderUserAnswersArray = [];
  $(".container").animate({
    height: "+=200px",
    padding: "30px",
  });
  let questions = fetch("http://localhost:3000/quiz/" + idQuiz)
    .then((data) => data.json())
    .then((data) => diplayquestions(data));

  //$(".container").css("background-color", "#465568");
}

function diplayquestions(quiz) {
  console.log(Object.values(quiz.questions));

  function processQuestions(question) {
    // console.log(question.question);
    // console.log(question.options);
    let options = "";

    // The every() function behaves exactly like forEach(), except it stops iterating through the array whenever the callback function returns a falsy value.

    question.options.forEach((option) => {
      options += `<div class="option"><div><span>${option.id}</span><input type="radio" name="response" class="radio" value="${option.id}">${option.content}</div></div>`;
    });

    let template = `<div id="quiz-questions-box">
        <div><i class="bi bi-box" style="margin-right:10px"></i>AWS - QUIZ</div>
        <div style="display:flex;justify-content:space-between;">
        <p>Question ${question.id}/4</p>
        <p id="seconds"></p>
        </div>
        <h3 style="padding:30px 0px">${question.question}</h3>
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
        </div>`;
    $(".container").html(template);

    /*











    */
  }
  let index = 0; // The index of the next element to show
  function doNext() {
    console.log(index);
    processQuestions(Object.values(quiz.questions)[index]); // affichage des questions
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
      $("#seconds").text(seconds + ` seconds -${index}`);
      if (distance <= 0) {
        clearInterval(secondsCounter);
        secondsCounter = null;
        $("#seconds").text("Time out !");
        passed = false;
      }
    }, 1000);
    /*
	
	------------- TIMER ------------
	
	*/

    ++index;
    var form = document.forms.namedItem("questions_form");
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

      //console.log(holderUserAnswersArray);
      clearInterval(secondsCounter);
      secondsCounter = null;
      passed = true;
      //return index == 4 ? alert("done") : doNext();
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
          //console.log("cliked");
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

  // Object.values(quiz.questions).every((question) => {
  //   alert("question id" + question.id);

  //   setTimeout(function () {
  //     return true;
  //   }, 10000);
  // });
}
// let arr = [1, 2, 3, 4, 5];
// arr.forEach(async (e) => {
//   element = await new Promise((res, rej) => {
//     setTimeout(() => res(e), 2000);
//   }).then((data) => console.log(data));
// });
function showresult(data) {
  alert("done");
  console.log(holderUserAnswersArray);
  let arr = holderUserAnswersArray.sort((p1, p2) =>
    p1.questionId > p2.questionId ? 1 : p1.questionId < p2.questionId ? -1 : 0
  );
  let questions = Object.values(data.questions);
  let correctOnes = 0;
  for (let i = 1; i <= questions.length; i++) {
    const element = questions[i - 1].answers;
    console.log(
      "correct is " + element.correct + " comment : " + element.comment
    );
    console.log("answer equivalent " + arr[i - 1].resId);

    if (element.correct == arr[i - 1].resId) correctOnes++;
  }
  var score = (correctOnes / questions.length) * 100 + " %";
  $(".container").empty();

  // The every() function behaves exactly like forEach(), except it stops iterating through the array whenever the callback function returns a falsy value.
  let template = "";
  let i = 0;
  questions.forEach((question) => {
    let options = "";
    let _class = "";
    let test = false;
    question.options.forEach((option) => {
      if (
        holderUserAnswersArray[i].resId == question.answers.correct &&
        !test
      ) {
        _class = "success";
        test = true;
      } else _class = "";
      options += `<div class="option ${_class}"><div><span>${option.id}</span><input type="radio" name="response" class="radio" value="${option.id}">${option.content}</div></div>`;
    });

    template += `
        <div>
        <p>Question ${question.id}/4</p>
        <h3 style="padding:30px 0px">${question.question}</h3>
          ${options}
        </div>`;
    i++;
  });
  //document.getElementsByClassName(".container").$(selected).removeAttr('" attribute you want to remove "');
  $(".container").removeAttr("style");
  $(".container").css({ color: "white" });
  $("body").css({ height: "fit-content", overflow: "auto" });
  $(".container").html(template);
  $(".score").show();
  $("#score").text(score + " Score");
  $("#score_details").html(`
  You attempt<span style="color:blue"><b> ${questions.length} question</b></span> from that <span style="color:#72d561"><b>${correctOnes} answer </b></span> are correct`);
}
