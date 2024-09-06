// это было нужно когда вопросы были во фронте просто
// в файлике
// import { quizTestsArray } from "../../questions0.js";

// это будет нужно когда я налажу стабильную работу,
// и сделаю requests.js модульным, а пока он в глобальной
// области видимости (для удобства дебага запросов из консоли)
// import { quizTestsArray } from "../../../requests.js";

import { Choose } from "../Choose/Choose.jsx";
import { Question } from "../question/question.jsx";
import { Result } from "../result/result.jsx";
import { useState, useEffect, useRef } from "react";
import s from "./App.module.scss";

export function App() {
    const [quizData, setQuizData] = useState({
        isTestChoosen: false,
        choosenTest: null,
        arrayOfQuestions: null,
        currentQuestionId: 0,
        isQuizCompleted: false,
        checkedAnswerId: [],
        userAnswers: [],
    });

    // const [currentQuestionId, setCurrentQuestionId] = useState(0);
    // const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    // const [checkedAnswerId, setCheckedAnswerId] = useState(null);
    // const [userAnswers, setUserAnswers] = useState([]);

    function handleNextButtonClick() {
        // по идее мне видится схема работы так:
        // по нажатию кнопки посылается post запрос на сервер
        // который отсылает укзанный пользователем ответ
        // и сохраняет в какой нибудь бд

        // далее при демонстрации результатов фронт запрашивает
        // сохранённые по ходу теста результаты у бэка, чтобы
        // показать их пользователю

        // проблема в том, что у меня (пока) нет бэка,
        // и хранить результаты придётся на фронте в
        // условном массиве или объекте (что как я подозреваю
        // не слишком то безопасно)

        // выход из функции если не выбран ответ
        if (quizData.checkedAnswerId.length === 0) return;

        const currentQuestion =
            quizData.arrayOfQuestions[quizData.currentQuestionId];

        // данные об ответе юзера для записи
        let newIsUserAnswerCorrect = null;
        let newUserAnswer = [];

        // лапшичка)
        // распределение данных для записи на вывод
        if (currentQuestion.isSeveralAnswers) {
            // Верный ли ответ юзера---------------------------------------------------------
            // Сортировка по возрастанию Чтобы сравнивать массивы было
            // удобнее. Мало ли в каком порядке придут айдишники верных
            // ответов из БД вопросов
            const sortedCorrectAnswersIds =
                currentQuestion.correctAnswerId.sort((a, b) => a - b);
            const sortedCheckedAnswersIds = quizData.checkedAnswerId.sort(
                (a, b) => a - b
            );
            // сравнение массивов айди верных ответов, и айди ответов,
            // которые выбрал юзер (может быть это можно сделать и
            // по элегантнее)
            newIsUserAnswerCorrect =
                sortedCorrectAnswersIds.toString() ===
                sortedCheckedAnswersIds.toString();
            // Ответ юзера ------------------------------------------------------------------
            // добавляем в строку все ответы по айди, выбранным пользователем
            // из массива ответов на вопрос
            sortedCheckedAnswersIds.forEach((el, i) => {
                newUserAnswer.push(currentQuestion.answers[el]);
            });
            // ------------------------------------------------------------------------------
        } else {
            // Верный ли ответ юзера---------------------------------------------------------
            // здесь идёт проверка есть ли в массиве айди верных ответов
            // айди, который сейчас выбрал пользователь
            newIsUserAnswerCorrect = currentQuestion.correctAnswerId.includes(
                quizData.checkedAnswerId
            );
            // Ответ юзера ------------------------------------------------------------------
            // newUserAnswer = currentQuestion.answers[quizData.checkedAnswerId];
            newUserAnswer.push(
                currentQuestion.answers[quizData.checkedAnswerId]
            );
            // ------------------------------------------------------------------------------
        }

        // обновляем данные о вопросе
        setQuizData((prev) => {
            // prev, это те же данные о вопросах,
            // но я думаю что использовать сам объект-стейт
            // в сеттере сомнительная идея
            return {
                // так как это объект с разными значениями
                // сначала разворачиваем его предыдущие
                // (если таковые имеются) значения
                // в принципе это тут и не нужно,
                // потому что итак все значения переписываются
                // отдельно
                ...prev,

                // сбор сведений об ответе
                userAnswers: [
                    // также как со всем объектом данных,
                    // сохраняем предыдущие ответы
                    ...prev.userAnswers,
                    // + новые данные в массив об ответе юзера
                    {
                        questionId: prev.currentQuestionId,

                        isUserAnswerCorrect: newIsUserAnswerCorrect,

                        userAnswer: newUserAnswer,

                        // у нас и так есть это в массиве вопросов, но я решил
                        // добавить полные сведения об ответе в объект, для
                        // удобства использования (использование опционально)
                        correctAnswer: currentQuestion.correctAnswer,
                    },
                ],

                // обнуление выбранного айди, чтобы убрать выделение инпута
                // Изначально я не мог придумать альтернативу решению простого
                // querySelector'а чтобы поймать инпут со свойством :checked
                // но потом я додумался взять под контроль состояние checked
                // всех инпутов, установив в него условие, что cheked будет true,
                // только при совпадении его индекса со стейтом checkedAnswerId
                checkedAnswerId: [],

                // переключение на следующий вопрос
                currentQuestionId: prev.currentQuestionId + 1,

                // переключение на результаты
                isQuizCompleted:
                    prev.currentQuestionId ===
                    quizData.arrayOfQuestions.length - 1,
            };
        });
        // --------------   outdated
        {
            // ---------------------------------------------------
            // ниже идёт много стейтов, выше я объединил
            // их в один большой объект стейтов, чтобы одним
            // сеттером можно было обновить сразу всё
            // ---------------------------------------------------
            // сбор сведений об ответе
            // setUserAnswers([
            //     ...userAnswers,
            //     {
            //         // лапшичка)
            //         questionId: currentQuestionId,
            //         isUserAnswerCorrect:
            //             checkedAnswerId === currentQuestion.correctAnswerId,
            //         userAnswer: currentQuestion.answers[checkedAnswerId],
            //         // у нас и так есть это в массиве вопросов, но я решил
            //         // добавить полные сведения об ответе в объект, для
            //         // удобства использования (использование опционально)
            //         correctAnswer: currentQuestion.correctAnswer,
            //     },
            // ]);
            // обнуление выбранного айди, чтобы убрать выделение инпута
            // Изначально я не мог придумать альтернативу решению простого
            // querySelector'а чтобы поймать инпут со свойством :checked
            // но потом я додумался взять под контроль состояние checked
            // всех инпутов, установив в него условие, что cheked будет true,
            // только при совпадении его индекса со стейтом checkedAnswerId
            // setCheckedAnswerId(null);
            // переключение на следующий вопрос
            // setCurrentQuestionId((prev) => prev + 1);
            // переключение на результаты
            // setIsQuizCompleted(currentQuestionId === quizData.arrayOfQuestions.length - 1);
        }
    }

    return (
        <>
            <div className={s.page}>
                {/* вообще говоря мне не внушает доверия вложенность
                с условиями для рендера определённой части приложения.
                вероятно это можно сделать простым условием, без вложения,
                но в принципе, одинарная вложенность пока не образовала
                тернарный ад, так что пусть будет */}
                {/* выбор теста ----------------------------------------------------------------------*/}
                {!quizData.isTestChoosen ? (
                    <div
                        className={`
                            ${s["page__choose-block"]} 
                            ${s["choose-block"]}
                            `}
                    >
                        <div
                            className={`
                                ${s["choose-block__container"]} 
                                ${s["_container"]}
                                `}
                        >
                            <div
                                className={`
                                ${s["choose-block__window"]}
                                `}
                            >
                                <Choose
                                    quizTestsArray={quizTestsArray}
                                    quizData={quizData}
                                    setQuizData={setQuizData}
                                />
                            </div>
                        </div>
                    </div>
                ) : // тест -----------------------------------------------------------------------------
                !quizData.isQuizCompleted ? (
                    // я пытался сделать вёрстку по БЭМ
                    // но мне начало казаться что это не слишком
                    // правильно, слишком много кода
                    // оставлю чисто для примера

                    // для ясности работы классов CSS:

                    // question-block в данном случае это контейнер
                    // занимающий всю ширину страницы, который просто
                    // разграничивает части страницы сверху-вниз

                    // question-block__container это более узкий контейнер
                    // который центрирован относительно родителя
                    // question-block (центрирован он кстати не силами
                    // самого класса, а силами модификатора _container)

                    // question-block__question-window это само окно вопросов
                    // оно уже имеет установленную ширину и задний фон

                    // по идее это всё немного избыточно, но для гибкости
                    // настройки я решил сделать так

                    <div
                        className={`
                            ${s["page__question-block"]} 
                            ${s["question-block"]}
                            `}
                    >
                        <div
                            className={`
                                ${s["question-block__container"]} 
                                ${s["_container"]}
                                `}
                        >
                            <div
                                className={`
                                ${s["question-block__question-window"]} 
                                ${s["qusetion-window"]}
                                `}
                            >
                                <Question
                                    // это именно данные текущего вопроса!!!
                                    // то есть текст, варианты ответа и
                                    // корректный ответ
                                    questionData={
                                        quizData.arrayOfQuestions[
                                            quizData.currentQuestionId
                                        ]
                                    }
                                    // а вот это информация по всему quiz'у
                                    // (я обосрался с неймнингом)
                                    setQuizData={setQuizData}
                                    quizData={quizData}
                                    checkedAnswerId={quizData.checkedAnswerId}
                                />
                                <div
                                    className={`
                                    ${s["qusetion-window__interaction-block"]}
                                    ${s["interaction-block"]}
                                    `}
                                >
                                    <button
                                        className={`
                                    ${s["interaction-block__next-button"]}
                                    `}
                                        onClick={() => handleNextButtonClick()}
                                    >
                                        next
                                    </button>
                                    <div
                                        className={`
                                    ${s["interaction-block__current-test"]}
                                    `}
                                    >
                                        Test: {quizData.choosenTest.title}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // результат ------------------------------------------------------------------------
                    <div
                        className={`
                        ${s["page__result-block"]}
                        ${s["result-block"]}
                    `}
                    >
                        <div
                            className={`
                                ${s["result-block__container"]} 
                                ${s["_container"]}
                                `}
                        >
                            <div
                                className={`
                                ${s["result-block__window"]}
                                `}
                            >
                                <Result
                                    arrayOfQuestions={quizData.arrayOfQuestions}
                                    userAnswers={quizData.userAnswers}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
