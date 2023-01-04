<?php
include_once 'Config/DB.php';

class Question
{
 private static $questions = array();
 public static function getQuestions($id_quiz)
 {
  if (isset(self::$questions["$id_quiz"])) {
   return self::$questions["$id_quiz"];
  };
  $ststm = DB::connect()->prepare("SELECT * from questions where quiz_id=?");
  $ststm->execute(array($id_quiz));
  $resultSet = $ststm->fetchAll();
  self::$questions["$id_quiz"] = $resultSet;
  return $resultSet;
 }
}
