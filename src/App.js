import React from "react"
import Question from "./components/Question.js"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
  const [startNewGame, setStartNewGame] = React.useState(() => false)
  const [questions, setQuestions] = React.useState(() => [])
  const [checkAnswers, setCheckAnswers] = React.useState(() => false)
  const [correctAnswersCount, setCorrectAnswersCount] = React.useState(() => 0)

  React.useEffect(() => {
    async function getQuestionsFromAPI() {
      const res = await fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple&encode=url3986")
      const data = await res.json()
      console.log("new results"+data.results)      
      setQuestions(data.results.map(element => {
        let mixedAnswers = [element.correct_answer, ...element.incorrect_answers]
        console.log(mixedAnswers)
        mixedAnswers = shuffleArray(mixedAnswers)
        console.log(mixedAnswers)
        return {...element, id: nanoid(), selected_answer: "", mixed_answers: mixedAnswers, is_wrong: false, is_correct: false}
      }))
    }

    if(startNewGame) {
      getQuestionsFromAPI()
      setStartNewGame(false)
    }    
  }, [startNewGame])

  React.useEffect(() => {
    if(checkAnswers) {
      let numCorrectAnswer = 0
      for(let i = 0; i < questions.length ; i++) {
       if(questions[i].is_correct) {
        numCorrectAnswer++
       }
      }
      setCorrectAnswersCount(numCorrectAnswer)
      console.log("numCorrectAnswer: "+numCorrectAnswer)
    }        
  }, [questions])

  function shuffleArray(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  function startQuiz(event) {    
    setStartNewGame(true)
  }

  function handleSelectedAnswer(event, question_id, sel_answer) {
    console.log(question_id+" "+sel_answer)
    setQuestions(oldQuestions => (
      oldQuestions.map(element => (
        element.id===question_id ? {...element, selected_answer: sel_answer} : element
      ))
    ))
  }

  function handleVerifyAnswersOrPlayAgain(event) {
    if(checkAnswers) {
      console.log(checkAnswers)
      setStartNewGame(true)
      setCheckAnswers(false)
      setCorrectAnswersCount(0)
    } else {
      console.log(checkAnswers)
      setCheckAnswers(true)
      setQuestions(oldQuestions => (
        oldQuestions.map(element => (
          element.selected_answer!==element.correct_answer ? {...element, is_wrong: true} : {...element, is_correct: true}
        ))
      ))
    }
  }

  console.log(questions)
  const questionElements = questions.map(element => (
    <Question
      key={element.id}
      id={element.id}
      question={element.question}
      correct_answer={element.correct_answer}
      incorrect_answers={element.incorrect_answers}
      selected_answer={element.selected_answer}
      mixed_answers={element.mixed_answers}
      is_wrong={element.is_wrong}
      is_correct={element.is_correct}
      check_answers={checkAnswers}
      handleSelectedAnswer={handleSelectedAnswer}
    />    
  ))

  return (
    <main>
      {correctAnswersCount===5 && <Confetti />}
      {
        questions.length > 0
        ?
        <section className="questions--page">
          <div className="questions--only">
            {questionElements}
          </div>
          <div className="footer">
            {checkAnswers && <span className="footer--text">You scored {correctAnswersCount}/5 correct answers</span>}
            <button
              className="check--answers"
              onClick={handleVerifyAnswersOrPlayAgain}
            >
                {!checkAnswers ? "Check answers" : "Play again" }
            </button>
          </div>                    
        </section>
        :
        <section className="startquiz">
          <h1 className="startquiz--title">Quizzical</h1>
          <h3 className="startquiz--description">A simple quiz game</h3>
          <button className="startquiz--button" onClick={startQuiz}>Start quiz</button>
        </section>
      }      
    </main>
  )
}