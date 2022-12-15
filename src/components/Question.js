import {nanoid} from "nanoid"

export default function Question(props) {
    const mixedAnswersElements = props.mixed_answers.map(answer => {
        const isWrongAnswer = props.is_wrong && (answer !== props.correct_answer) && (answer === props.selected_answer)
        const isCorrectAnswer = props.check_answers && (answer === props.correct_answer)
        //window.atob() //decode from base64
        return (
            <span
                key={nanoid()}
                className={
                    `question--answer
                    ${answer === props.selected_answer ? "selected--answer" : ""}
                    ${isWrongAnswer ? "wrong--answer" : ""}
                    ${isCorrectAnswer ? "correct--answer" : ""}
                    `
                }
                onClick={(event) => props.handleSelectedAnswer(event, props.id, answer)}                
            >
                {decodeURIComponent(answer)}
            </span>
        )
    })
    return (
        <div className="question">
            <h2 className="question--title">{decodeURIComponent(props.question)}</h2>
            <div className="question--answers">
                {mixedAnswersElements}                
            </div>            
        </div>
    )
}