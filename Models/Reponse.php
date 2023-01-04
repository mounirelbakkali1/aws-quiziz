<?php
include_once 'Config/DB.php';

class Reponse
{
 private static $responses = array();
 private static $correction = array();
 public static function getCorrection($id_quiz)
 {
  if (isset(self::$correction["$id_quiz"])) {
   return self::$correction["$id_quiz"];
  };
  $ststm = DB::connect()->prepare("SELECT responses.id ,responses.question_id,responses.comment FROM responses INNER join questions on responses.question_id = questions.id where questions.quiz_id =? and responses.isCorrect=1;");
  $ststm->execute(array($id_quiz));
  $corr = $ststm->fetchAll();
  self::$correction = $corr;
  return $corr;
 }
 public static function getResponses($id_quiz)
 {
  if (isset(self::$responses["$id_quiz"])) {
   return self::$responses["$id_quiz"];
  };
  $ststm = DB::connect()->prepare("SELECT responses.id ,responses.response as content,responses.question_id FROM responses INNER join questions on responses.question_id = questions.id where questions.quiz_id =? ;");
  $ststm->execute(array($id_quiz));
  $resultSet = $ststm->fetchAll();
  self::$responses["$id_quiz"] = $resultSet;
  return $resultSet;
 }
}
