import s from "./question.module.scss";

export function Question({
    questionData,
    // setCheckedAnswerId,
    setQuestionsData,
    checkedAnswerId,
}) {
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
                                // переключение выбранного варианта ответа
                                setQuestionsData((prev) => {
                                    return {
                                        ...prev,
                                        // плюс поставил чтобы айдишник стал number
                                        // для дальнейшей проверки с другим number
                                        // уязвимо)))
                                        
                                        checkedAnswerId: +event.target.id,
                                    };
                                });
                                // setCheckedAnswerId(+event.target.id);
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
                                type="radio"
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
                                checked={checkedAnswerId === index}
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
