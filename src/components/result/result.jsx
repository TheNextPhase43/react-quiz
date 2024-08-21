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
                            <li>Your answer: {el.userAnswer}</li>
                            <li>
                                Correct answer:{" "}
                                {arrayOfQuestions[index].correctAnswer}
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
