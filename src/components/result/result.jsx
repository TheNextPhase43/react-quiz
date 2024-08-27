import s from "./result.module.scss";

export function Result({ arrayOfQuestions, userAnswers }) {
    // console.log(userAnswers);

    const amountOfCorrectUserAnswers = userAnswers.filter(
        (el) => el.isUserAnswerCorrect
    ).length;

    return (
        <div className={s.answers}>
            <div className={s.answersBlock}>
                {userAnswers.map((el, index) => {
                    return (
                        <ul key={index}>
                            <li>{arrayOfQuestions[index].title}</li>
                            <li>{arrayOfQuestions[index].questionText}</li>
                            {/* вот эта проверочка через длину внушает доверие конечно))*/}
                            <li>
                                Your answer{el.userAnswer.length > 1 ? "s" : ""}
                                : {el.userAnswer.map((el) => el + " ")}
                            </li>
                            <li>
                                {/* изначально я в самом файле questions.js
                                поставил лишние скобки напротив значения
                                correctAnswer, и в итоге даже сплитая или
                                мэпая массив возвращал всегда целый массив,
                                что стало причиной лишней запятой, пофиксить
                                которую как, я додумался спустя 40 минут */}
                                Correct answer
                                {el.correctAnswer.length > 1 ? "s" : ""}:{" "}
                                {el.correctAnswer.join(" ")}
                            </li>
                            <li>
                                Your answer is{" "}
                                {el.isUserAnswerCorrect ? (
                                    <span className={s.correct}>correct</span>
                                ) : (
                                    <span className={s.wrong}>wrong</span>
                                )}
                                .
                            </li>
                        </ul>
                    );
                })}
            </div>
            <div>
                Total amount of correct answers is {amountOfCorrectUserAnswers}{" "}
                of {userAnswers.length}
            </div>
            <div>
                Your result is{" "}
                {Math.floor(
                    (amountOfCorrectUserAnswers / userAnswers.length) * 100
                )}
                %
            </div>
        </div>
    );
}
