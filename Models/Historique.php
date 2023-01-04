<?php
include_once 'Config/DB.php';

class Historique
{
 public static function saveHistoric($username, $quizID, $score, $date, $user_ip, $user_browser, $user_os)
 {
  $ststm = DB::connect()->prepare("INSERT INTO `historique`(`username`, `quiz_id`, `score`, `date`, `user_ip`, `user_browser`, `user_os`) VALUES (?,?,?,?,?,?,?)");
  $ststm->execute(array($username, $quizID, $score, $date, $user_ip, $user_browser, $user_os));
  $resultSet = $ststm->fetchAll();
  return $resultSet;
 }
}
