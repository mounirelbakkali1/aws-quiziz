<?php
include_once 'Config/DB.php';

class Question
{


 public static function getQuestions($id_quiz)
 {
  $ststm = DB::connect()->prepare("SELECT * from questions where quiz_id=?");
  $ststm->execute(array($id_quiz));
  return $ststm->fetchAll();
 }
}
