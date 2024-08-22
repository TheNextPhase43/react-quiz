import { arrayOfQuestions } from "../../questions.js";
import { Question } from "../question/question.jsx";
import { Result } from "../result/result.jsx";
import { useState, useEffect, useRef } from "react";
import s from "./App.module.scss";

export function App() {
    const [questionsData, setQuestionsData] = useState({
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
        // (да, я сам забыл что это делает ппц я идиот)
        if (questionsData.checkedAnswerId.length === 0) return;

        const currentQuestion =
            arrayOfQuestions[questionsData.currentQuestionId];

        // обновляем данные о вопросе
        setQuestionsData((prev) => {
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
                        // лапшичка)
                        questionId: prev.currentQuestionId,

                        // здесь идёт проверка есть ли в массиве айди верных ответов
                        // айди, который сейчас выбрал пользователь
                        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        // допилить совместимость с несколькими вариантами ответа,
                        // сделать проверку не просто есть ли в массиве верных выбранный,
                        // а совпадают ли все ответы юзера с айди в массиве верных ответов
                        // для этого сначала допилить добавление в "чекнутые" ответы юзера,
                        // если их много
                        isUserAnswerCorrect:
                        currentQuestion.correctAnswerId.includes(prev.checkedAnswerId),

                        userAnswer:
                            currentQuestion.answers[prev.checkedAnswerId],

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
                    prev.currentQuestionId === arrayOfQuestions.length - 1,
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
            // setIsQuizCompleted(currentQuestionId === arrayOfQuestions.length - 1);
        }
    }

    return (
        <>
            <div className={s.page}>
                {!questionsData.isQuizCompleted ? (
                    // questions part-----------------------------------------------------------------------------
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
                                        arrayOfQuestions[
                                            questionsData.currentQuestionId
                                        ]
                                    }
                                    // а вот это информация по всему quiz'у
                                    // (я обосрался с неймнингом)
                                    setQuizData={setQuestionsData}
                                    quizData={questionsData}
                                    checkedAnswerId={
                                        questionsData.checkedAnswerId
                                    }
                                />
                                <button
                                    className={`
                                    ${s["qusetion-window__next-button"]}
                                    `}
                                    onClick={() => handleNextButtonClick()}
                                >
                                    next
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // results part-------------------------------------------------------------------------------
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
                                    arrayOfQuestions={arrayOfQuestions}
                                    userAnswers={questionsData.userAnswers}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
