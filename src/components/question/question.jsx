import s from "./question.module.scss";

export function Question({
    // questionData это в данном случае именно
    questionData,
    // setCheckedAnswerId,
    setQuizData,
    quizData,
    checkedAnswerId,
}) {
    // console.log(questionData);
    // console.log(quizData);

    return (
        <div className={s.questionsBlock}>
            <p className={s.questionTitle}>{questionData.title}</p>
            <p className={s.questionText}>{questionData.questionText}</p>
            <form className={s.answersBlock}>
                {questionData.answers.map((el, index) => {
                    return (
                        <div
                            className={s.answerBlock}
                            key={index}
                            id={index}
                            onClick={(event) => {
                                // console.log(event.currentTarget.id);

                                // Зачем это нужно? event.currentTarget не работает, чтоб его,
                                // вне области видимости обработчика событий, поэтому костылим
                                // вот такое запоминание в переменную.
                                // Чтобы понять что не так, я потратил кучу времени.
                                const eventCurrentTarget = event.currentTarget;

                                // переключение выбранного варианта ответа
                                setQuizData((prev) => {
                                    // console.log(questionData.isSeveralAnswers);
                                    return {
                                        ...prev,
                                        // плюс поставил чтобы айдишник стал number
                                        // для дальнейшей проверки с другим number
                                        // уязвимо)))

                                        // либо массив выбранных вариантов, либо число
                                        checkedAnswerId:
                                            questionData.isSeveralAnswers
                                                ? // если несколько вариантов ответа---------------
                                                  prev.checkedAnswerId.includes(
                                                      +eventCurrentTarget.id
                                                  )
                                                    ? // если нажат уже выделенный input
                                                      // оставляем все, кроме нажатого
                                                      // ("отжимаем") его
                                                      prev.checkedAnswerId.filter(
                                                          (el, i) => {
                                                              return (
                                                                  el !==
                                                                  +eventCurrentTarget.id
                                                              );
                                                          }
                                                      )
                                                    : //   добавляем в массив новый input
                                                      [
                                                          ...prev.checkedAnswerId,
                                                          +eventCurrentTarget.id,
                                                      ]
                                                : // если один вариант ответа----------------------
                                                  // просто меняем айди на нажатый
                                                  +eventCurrentTarget.id,
                                    };
                                });
                                // console.log(questionData.checkedAnswerId);

                                // setCheckedAnswerId(+event.target.id);
                                // console.log(event.currentTarget.id);
                            }}
                        >
                            <input
                                className={s.answerInput}
                                // изначально я сделал измененение инпута чисто на
                                // onChange на самом инпуте, но потом переделал
                                // так, чтобы выделение инпута висело на всём
                                // блоке ответа, а не на кружке самого инпута
                                // мне пока не ясно, правильно ли это. По идее
                                // выделение инпута и сбор данных об ответе у меня
                                // привязан к стейтам, так что всё должно работать,
                                // но меня не покидает чувство, что что-то тут не так
                                onChange={(event) => {
                                    //     // переключение выбранного варианта ответа
                                    //     console.log(event.target);
                                    //     setQuestionsData((prev) => {
                                    //         return {
                                    //             ...prev,
                                    //             // плюс поставил чтобы айдишник стал number
                                    //             // для дальнейшей проверки с другим number
                                    //             // уязвимо)))
                                    //             checkedAnswerId: +event.target.id,
                                    //         };
                                    //     });
                                    //     // setCheckedAnswerId(+event.target.id);
                                }}
                                type={
                                    questionData.isSeveralAnswers
                                        ? "checkbox"
                                        : "radio"
                                }
                                id={index}
                                name="answer"
                                // Всё гениальное просто. Я не мог додуматься до
                                // этого несколько часов. Добиться контроля над
                                // выбранным инпутом оказалось легко, с помощью
                                // сопоставления стейта выбранного айди и его
                                // уникального индекса.
                                // (то есть сами кнопки становятся активными
                                // сугубо в зависимости от стейта, который уже
                                // меняется кликом)
                                // допилить функцию, чтобы если ответов несколько,
                                // то не один чекбокс активировался, а все в
                                // массиве выбраннх
                                // checked={checkedAnswerId === index}
                                checked={
                                    questionData.isSeveralAnswers
                                        ? quizData.checkedAnswerId.includes(
                                              index
                                          )
                                        : quizData.checkedAnswerId === index
                                }
                            />
                            {/* текст ответов */}
                            <label
                                className={s.answerLabel}
                                htmlFor={index}
                            >
                                {el}
                            </label>
                        </div>
                    );
                })}
            </form>
        </div>
    );
}
