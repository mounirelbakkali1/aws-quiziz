<?php
require 'DBConnection.php';
// if (isset($_GET['questions'])) getQuizQuestions();
class QuizController extends DBConnection
{

    public function getQuizzes()
    {
        $ststm = $this->connect()->prepare("SELECT * FROM quizes");
        $ststm->execute();
        $quizes = $ststm->fetchAll();
        $fullfilledArray = array();
        foreach ($quizes as $quiz) {
            $countQuestions = count($this->getQuestions($quiz['id']));
            array_push($fullfilledArray, array("quiz" => $quiz, "numOfQuestions" => $countQuestions));
        }
        return $fullfilledArray;
    }

    public function getQuizQuestions($id_quiz)
    {
        $questions = $this->getQuestions($id_quiz);
        $responses = $this->getResponses($id_quiz);
        $new_array = array();
        for ($i = 0; $i < count($questions); $i++) {
            $sum_ofOptions = array();
            for ($j = 0; $j < count($responses); $j++) {
                if ($questions[$i]['id'] == $responses[$j]['question_id']) array_push($sum_ofOptions, $responses[$j]);
            }
            $new = array("id" => $questions[$i]['id'], "question" => $questions[$i]['question'], "options" => $sum_ofOptions);
            array_push($new_array, $new);
        }
        return  $new_array;
    }

    public function compareAnswer($userAnswers, $id_quiz)
    {
        $correctAnswers = $this->getCorrection($id_quiz);
        $correctOnes = 0;
        // var_dump($correctAnswers);
        // var_dump($userAnswers);
        for ($i = 0; $i < count($correctAnswers); $i++) {
            $element = $correctAnswers[$i]['id'];
            // var_dump($element);
            // var_dump($userAnswers[$i]['resId']);
            // echo "<hr>";
            if ($element == $userAnswers[$i]['resId']) $correctOnes++;
        }
        $score = ($correctOnes / count($userAnswers)) * 100;
        $feedBack = ($score < 30) ? "Not Bad" : (($score < 60) ? "Good results" : "Exellent keep up");
        $template = $this->showFeedBack($userAnswers, $correctAnswers, $id_quiz);
        return array("template" => $template, "feedback" => $feedBack, "score" => $score, "correctOnes" => $correctOnes);
    }


    private function getResponses($id_quiz)
    {
        $ststm = $this->connect()->prepare("SELECT responses.id ,responses.response as content,responses.question_id FROM responses INNER join questions on responses.question_id = questions.id where questions.quiz_id =? ;");
        $ststm->execute(array($id_quiz));
        return $ststm->fetchAll();
    }

    private function getCorrection($id_quiz)
    {
        $ststm = $this->connect()->prepare("SELECT responses.id ,responses.question_id,responses.comment FROM responses INNER join questions on responses.question_id = questions.id where questions.quiz_id =? and responses.isCorrect=1;");
        $ststm->execute(array($id_quiz));
        return $ststm->fetchAll();
    }


    private function getQuestions($quizID)
    {
        $ststm = $this->connect()->prepare("SELECT * from questions where quiz_id=?");
        $ststm->execute(array($quizID));
        return $ststm->fetchAll();
    }
    private function showFeedBack($userAnswers, $correctAnswers, $id_quiz)
    {
        $template = "";
        $i = 0;
        $questions = $this->getQuestions($id_quiz);
        $optionsWIthqsts = $this->getQuizQuestions($id_quiz);
        // print_r(json_encode($userAnswers));
        // echo "<hr>";
        // print_r(json_encode($correctAnswers));
        // echo "<hr>";
        // print_r(json_encode($optionsWIthqsts));

        foreach ($questions as $question) {
            // var_dump($correctAnswers[$i]['id']);
            $optionsTmplate = "";
            $_class = "";
            $u = 1;
            foreach ($optionsWIthqsts[$i]['options'] as $option) {
                if (
                    $userAnswers[$i]['resId'] == $correctAnswers[$i]['id'] &&
                    $correctAnswers[$i]['id'] == $option['id']
                ) {
                    $_class = "success";
                } else if (
                    $userAnswers[$i]['resId'] != $correctAnswers[$i]['id'] &&
                    $correctAnswers[$i]['id'] == $option['id']
                ) {
                    $_class = "wrong";
                } else {
                    $_class = "";
                }
                $optionsTmplate .= "<div class='option $_class'><div style='display:flex'><span>" . $u . "</span>" . $option['content'] . "</div></div>";
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
