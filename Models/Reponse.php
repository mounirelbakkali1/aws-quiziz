<?php
include_once 'Config/DB.php';

class Reponse
{
 public static function getCorrection($id_quiz)
 {
  $ststm = DB::connect()->prepare("SELECT responses.id ,responses.question_id,responses.comment FROM responses INNER join questions on responses.question_id = questions.id where questions.quiz_id =? and responses.isCorrect=1;");
  $ststm->execute(array($id_quiz));
  return $ststm->fetchAll();
 }
 public static function getResponses($id_quiz)
 {
  $ststm = DB::connect()->prepare("SELECT responses.id ,responses.response as content,responses.question_id FROM responses INNER join questions on responses.question_id = questions.id where questions.quiz_id =? ;");
  $ststm->execute(array($id_quiz));
  return $ststm->fetchAll();
 }
}
