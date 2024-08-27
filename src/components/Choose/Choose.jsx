import s from "./Choose.module.scss";

export function Choose({ quizTestsArray, quizData, setQuizData }) {
    function testHandleClick(test) {
        setQuizData((prev) => {
            return {
                ...prev,
                choosenTest: test,
                isTestChoosen: true,
                arrayOfQuestions: test.questions,
            };
        });
    }
    return (
        <div className={s.chooseBlock}>
            <div className={s.chooseTitle}>Choose test</div>
            <div className={s.chooseTests}>
                {quizTestsArray.map((el, index) => {
                    return (
                        <div
                            className={s.test}
                            onClick={() => {
                                testHandleClick(el);
                            }}
                            key={index}
                        >
                            <div>{el.title}</div>
                            <div>
                                {el.questions.length}{" "}
                                {el.questions.length > 1
                                    ? "questions"
                                    : "question"}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
