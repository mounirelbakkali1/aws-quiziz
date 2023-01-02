<?php
include_once 'QuizController.php';
if (isset($_GET['questions'])) retreiveQuestions();
if (isset($_GET['userAnswers'])) retreiveCorrection();
if (isset($_GET['loadQuizes'])) loadQuizzes();






function loadQuizzes()
{
 $quize = new QuizController();
 echo json_encode($quize->getQuizzes());
}



function retreiveQuestions()
{
 $quize = new QuizController();
 $id_quiz = $_GET['quizId'];
 echo json_encode($quize->getQuizQuestions($id_quiz));
}


function  retreiveCorrection()
{
 $quize = new QuizController();
 $id_quiz = $_GET['quizId'];
 echo json_encode($quize->compareAnswer(json_decode($_GET['userAnswers'], true), $id_quiz));
}
