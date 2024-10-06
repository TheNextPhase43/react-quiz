import s from "./Choose.module.scss";

export function Choose({ quizTestsArray, quizData, setQuizData, getNewSessionId }) {
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
                {/* проверка для адаптива в css */}
                {/* <div className={s.test}>
                    <div>1111111111111</div>
                    <div>111111111111111</div>
                </div>
                <div className={s.test}>
                    <div>2222222222</div>
                    <div>22222222</div>
                </div>
                <div className={s.test}>
                    <div>2222222222</div>
                    <div>22222222</div>
                </div>
                <div className={s.test}>
                    <div>2222222222</div>
                    <div>22222222</div>
                </div> */}

                {quizTestsArray.map((el, index) => {
                    return (
                        <div
                            className={s.test}
                            onClick={() => {
                                testHandleClick(el);
                                getNewSessionId();
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
