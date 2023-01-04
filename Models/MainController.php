<?php
require 'Quiz.php';
require 'Question.php';
require 'Reponse.php';
require 'Historique.php';
class Controller
{
    private static $Quiz_questions = array();
    public function getQuizzes()
    {
        $quizesfromDB = Quiz::getQuizes();
        $fullfilledArray = array();
        foreach ($quizesfromDB as $quiz) {
            $countQuestions = count(Question::getQuestions($quiz['id']));
            array_push($fullfilledArray, array("quiz" => $quiz, "numOfQuestions" => $countQuestions));
        }
        return $fullfilledArray;
    }
    public function getQuizQuestions($id_quiz)
    {
        if (isset(self::$Quiz_questions["$id_quiz"])) {
            return self::$Quiz_questions["$id_quiz"];
        };
        $questions = Question::getQuestions($id_quiz);
        $responses =  Reponse::getResponses($id_quiz);
        $new_array = array();
        for ($i = 0; $i < count($questions); $i++) {
            $sum_ofOptions = array();
            for ($j = 0; $j < count($responses); $j++) {
                if ($questions[$i]['id'] == $responses[$j]['question_id']) array_push($sum_ofOptions, $responses[$j]);
            }
            $new = array("id" => $questions[$i]['id'], "question" => $questions[$i]['question'], "options" => $sum_ofOptions);
            array_push($new_array, $new);
        }
        self::$Quiz_questions["$id_quiz"] = $new_array;
        return  $new_array;
    }

    public function compareAnswer($userAnswers, $id_quiz, $username)
    {
        $correctAnswers = Reponse::getCorrection($id_quiz);
        $correctOnes = 0;
        for ($i = 0; $i < count($correctAnswers); $i++) {
            $element = $correctAnswers[$i]['id'];
            if ($element == $userAnswers[$i]['resId']) $correctOnes++;
        }
        $score = ($correctOnes / count($userAnswers)) * 100;
        $feedBack = ($score < 30) ? "Not Bad keep learning" : (($score < 60) ? "GOOD :)<br> w're pround of you" : "Exellent keep it up");
        $template = $this->showFeedBack($userAnswers, $correctAnswers, $id_quiz);
        /* save historique */
        $date = date('Y-m-d H:i:s');
        $ip_address = $_SERVER['REMOTE_ADDR'];
        $browser_name = explode(" ", $_SERVER['HTTP_USER_AGENT'])[0];
        $userOS = $_SERVER['COMSPEC'];
        Historique::saveHistoric($username, $id_quiz, $score, $date, $ip_address, $browser_name, $userOS);
        /* save historique */
        return array("template" => $template, "feedback" => $feedBack, "score" => intval($score), "correctOnes" => $correctOnes);
    }


    private function showFeedBack($userAnswers, $correctAnswers, $id_quiz)
    {
        $template = "";
        $i = 0;
        $questions = Question::getQuestions($id_quiz);
        $optionsWIthqsts = $this->getQuizQuestions($id_quiz);
        foreach ($questions as $question) {
            $optionsTmplate = "";
            $_class = "";
            $u = 1;
            $alphabet = array("A", "B", "C", "D");
            foreach ($optionsWIthqsts[$i]['options'] as $option) {
                if (
                    $userAnswers[$i]['resId'] == $correctAnswers[$i]['id'] &&
                    $userAnswers[$i]['resId'] == $option['id']
                ) {
                    $_class = "success";
                } else if (
                    $userAnswers[$i]['resId'] != $correctAnswers[$i]['id'] &&
                    $userAnswers[$i]['resId'] == $option['id']
                ) {
                    $_class = "wrong";
                } else {
                    $_class = "";
                }
                $optionsTmplate .= "<div class='option $_class' style='margin-bottom:8px'><div style='display:flex'><span>" . $alphabet[$u - 1] . "</span>" . $option['content'] . "</div></div>";
                $u++;
            };
            $template .= "
                <div>
                <p>Question " . $question['id'] . "/" . count($questions) . "</p>
                <h3 style='padding:30px 0px'>" . $question['question'] . "</h3>
                $optionsTmplate
                <p class='score_question_comment'><img src='../assets/img/icons8-ok-48.png'>" . $correctAnswers[$i]['comment'] . "</p>
                </div>";
            $i++;
        };
        return $template;
    }
}
