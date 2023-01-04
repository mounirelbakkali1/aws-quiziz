<?php
include_once 'Config/DB.php';

class Quiz
{
 private static $quizes = array();

 public static function getQuizes()
 {
  if (null != self::$quizes) {
   return self::$quizes;
  }
  $ststm = DB::connect()->prepare("SELECT * FROM quizes");
  $ststm->execute();
  $resultSet = $ststm->fetchAll();
  self::$quizes = $resultSet;
  return $resultSet;
 }
}
