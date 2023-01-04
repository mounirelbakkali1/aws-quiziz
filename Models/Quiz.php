<?php
include_once 'Config/DB.php';

class Quiz
{

 public static function getQuizes()
 {
  $ststm = DB::connect()->prepare("SELECT * FROM quizes");
  $ststm->execute();
  return $ststm->fetchAll();
 }
}
