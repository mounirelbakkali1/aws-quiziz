<?php


abstract class DB
{
    private static $host = "localhost";
    private static $db_name = "quiziz-app";
    private static $username = "root";
    private static $pwd = "";
    public static function connect()
    {
        $dsn = 'mysql:host=' . self::$host . ';dbname=' . self::$db_name . ';';
        $pdo = new PDO($dsn, self::$username, self::$pwd);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    }
}
