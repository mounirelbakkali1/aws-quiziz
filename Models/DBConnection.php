<?php


abstract class DBConnection
{
    private $host = "localhost";
    private $db_name = "quiziz-app";
    private $username = "root";
    private $pwd = "";
    protected function connect()
    {
        $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->db_name . ';';
        $pdo = new PDO($dsn, $this->username, $this->pwd);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        // var_dump($pdo->prepare("select * from questions")->fetchAll());
        // die;
        //  echo "hello";
        return $pdo;
    }
}
