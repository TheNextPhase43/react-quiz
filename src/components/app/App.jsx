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
import { Results } from "../results/results.jsx";
import { useState, useEffect, useRef } from "react";
import s from "./App.module.scss";

export function App() {
    // const [quizTestsArrayState, setQuizTestsArrayState] = useState(undefined);

    // я сделал разделение для стейтов
    // так как первый тип для данных относительно
    // всего приложения, и доступа к работе самого теста
    const [quizWindowsState, setQuizWindowsState] = useState({
        quizTestsArray: undefined,
        resultsWindowState: false,
    });

    const [resultsState, setResultsState] = useState({
        savedAnswersPageFromDB: undefined,
        pageId: 1,
    });

    // а второй уже для конкретных данных внутри
    // теста
    const [quizData, setQuizData] = useState({
        isTestChoosen: false,
        isResultsBlockStateActive: false,
        choosenTest: null,
        arrayOfQuestions: null,
        currentQuestionId: 0,
        isQuizCompleted: false,
        checkedAnswerId: [],
        userAnswers: [],
        sessionId: undefined,
    });

    // мне пришлось вытащить запрос из файла requests.js,
    // потому что получилось затруднённое изменение стейта из файла
    // не являющимся компонентом (не пробросить сеттер через пропсы)
    // а данный стейт является массивом тестов, которые запрашиваются
    // с сервера, и мне нужно отобразить окно загрузки, если стейт
    // в данный момент undefined, однако когда ответ от сервера будет
    // получен, стейт должен принять значения объекта, и отрендериться
    // на странице, поэтому собственно и пришлось запрос перетащить в
    // компонент app.jsx
    function fetchTests() {
        fetch("http://localhost:3003/tests", {
            method: "GET",
            // вот это вот не работает с флагом "Access-Control-Allow-Origin", "*",
            // mode: "no-cors",
        })
            .then((data) => {
                return data.json();
            })
            .then((jsonData) => {
                // console.log(jsonData);
                setQuizWindowsState((prev) => {
                    return {
                        ...prev,
                        quizTestsArray: jsonData,
                    };
                });
            });
    }

    // +- тоже самое
    function getNewSessionId() {
        fetch(`http://localhost:3003/sessions`, {
            method: "GET",
        })
            .then((data) => {
                return data.json();
            })
            .then((jsonData) => {
                // console.log(jsonData);
                setQuizData((prev) => {
                    return {
                        ...prev,
                        sessionId: jsonData,
                    };
                });
            });
    }

    function fetchResults(pageNumber) {
        fetch(`http://localhost:3003/answerspage${pageNumber}`, {
            method: "GET",
        })
            .then((data) => {
                return data.json();
            })
            .then((jsonData) => {
                // console.log(jsonData);
                console.log(jsonData);

                setResultsState((prev) => {
                    return {
                        ...prev,
                        savedAnswersPageFromDB: jsonData,
                    };
                });
            });
    }

    // чтобы запустилось лишь раз
    useEffect(() => {
        fetchTests();
        // getNewSessionId();
    }, []);

    // реализация загрузки страницы результатов
    useEffect(() => {
        // изначально savedAnswersPageFromDB === undefined
        // когда приходят данные с бека, переменная больше
        // не undefined, и условие срабатывает собственно
        // меняется стейт, и теперь вместо загрузки
        // отображаются данные с бека в компоненте
        if (resultsState.savedAnswersPageFromDB !== undefined) {
            setQuizWindowsState((prev) => {
                return {
                    ...prev,
                    resultsWindowState: true,
                };
            });
        }
    }, [resultsState.savedAnswersPageFromDB]);

    // я вообще то не уверен что стоит делать
    // обновление данных на сервере через useEffect,
    // но пока что вполне работает, и не вижу причин
    // этого не делать.
    // Собственно тут у нас при обновлении ответов
    // юзера, последний данный ответ отправляется на
    // сервер для записи в json файл
    useEffect(() => {
        // миунс найден, при объявлении стейта
        // он также отрабатывает, поэтому
        // тут теперь костыль с условием
        if (quizData.userAnswers.length === 0) {
            // console.log(0);
        } else {
            // console.log(1);
            postAnswer({
                // вот это должен быть айдишник "сессии"
                // чтобы дальше отличать результаты
                // для каждой сессии в БД создаётся
                // уникальный json файл, в котором далее
                // и хранятся данные об ответах юзера
                // во время конкретной сессии
                // вообще то можно наверное записать всё
                // в один json файл, но я решил сделать
                // разделение и пока не вижу минусов
                // (возможно в дальнейшем переделаю,
                // но пока версия с разными файлами мне
                // нравится больше в виду удобства)
                sessionId: quizData.sessionId,
                answer: quizData.userAnswers[quizData.userAnswers.length - 1],
                countOfQuestionsInTest: quizData.choosenTest.questions.length,
            });
        }
    }, [quizData.userAnswers]);

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

    // тут та же история, я пока не приудмал как лучше
    // сделать менеджмент запросов, и в итоге он идёт
    // на сервер, тогда, когда стейт получает значение
    // true, вот только делать это через useEffect
    // мне кажется не правильным из за отработки
    // в самом начале. Однако это всё ещё лучше,
    // чем вставлять в функцию handleNextButtonClick
    // то же условие, что стоит тут
    // useEffect(() => {
    //     if (quizData.isQuizCompleted) {
    //         // тут добавить гибкость выбора сессии
    //         // fetchResults(0);
    //         // тут не выведется ввиду асинхронности,
    //         // а её в useEffect оказалось прикрутить
    //         // не так просто, реакт ругается на async,
    //         // в передаваемой функции в хук, поэтому
    //         // пофиг (возможно всё же нужно если)
    //         // будет задержка сильная, но может и нет
    //         console.log(userAnswers);
    //     }
    // }, [quizData.isQuizCompleted]);

    return (
        <>
            <div className={s.page}>
                {/* вообще говоря мне не внушает доверия вложенность
                с условиями для рендера определённой части приложения.
                вероятно это можно сделать простым условием, без вложения,
                но в принципе, одинарная вложенность пока не образовала
                тернарный ад, так что пусть будет */}
                {/* выбор теста ----------------------------------------------------------------------*/}
                {/* если не выбран */}
                {!quizData.isTestChoosen ? (
                    // есть идея, что это всё тоже можно закинуть
                    // компонент выбора
                    <div
                        className={`
                            ${s["page__menu-block"]} 
                            ${s["menu-block"]}
                            `}
                    >
                        <div
                            className={`
                                ${s["menu-block__container"]} 
                                ${s["_container"]}
                                `}
                        >
                            <div
                                className={`
                                ${s["menu-block__window"]}
                                `}
                            >
                                {/*

                                это было не просто смело, это было
                                пиздец как смело
                                - Т

                                я таки начал путаться в тернарных операторах
                                ? :
                                и решил закинуть условие в обычный if/else,
                                для большей читаемости. Писать отдельную
                                функцию и вызывать её тут я не захотел, но
                                спасибо комменататору на хабре, который
                                подкинул идею, как вызвать функцию с условием
                                прямо внутри JSX. На мой взгляд это выглядит
                                как то совсем неправильно, но что уж, раз
                                работает, то почему бы и нет!

                                */}
                                {(function () {
                                    // если не активен блок, где можно
                                    // смотреть результаты тестов
                                    // то будет сначала загрузка, а потом
                                    // предложение выбора теста для прохождения
                                    if (!quizData.isResultsBlockStateActive) {
                                        return (
                                            <>
                                                {quizWindowsState.quizTestsArray ==
                                                undefined ? (
                                                    <div>loading...</div>
                                                ) : (
                                                    <Choose
                                                        quizTestsArray={
                                                            quizWindowsState.quizTestsArray
                                                        }
                                                        quizData={quizData}
                                                        setQuizData={
                                                            setQuizData
                                                        }
                                                        getNewSessionId={
                                                            getNewSessionId
                                                        }
                                                    />
                                                )}
                                            </>
                                        );
                                    }
                                    // иначе будет собственно компонент,
                                    // где можно выбрать уже, в свою очередь
                                    // какой результат посмотреть
                                    else {
                                        return (
                                            <>
                                                <Results
                                                    quizWindowsState={
                                                        quizWindowsState
                                                    }
                                                    setQuizWindowsState={
                                                        setQuizWindowsState
                                                    }
                                                    resultsState={resultsState}
                                                    setResultsState={
                                                        setResultsState
                                                    }
                                                />
                                            </>
                                        );
                                        return (
                                            <>
                                                {quizWindowsState.resultsWindowState ==
                                                undefined ? (
                                                    <div>loading...</div>
                                                ) : (
                                                    <Results />
                                                )}
                                            </>
                                        );
                                    }
                                })()}

                                <div
                                    className={`
                                ${s["menu-block__results-block"]}
                                ${s["results-block"]}
                                `}
                                >
                                    <button
                                        onClick={() => {
                                            if (
                                                !quizData.isResultsBlockStateActive
                                            ) {
                                                // аругмент это номер страницы
                                                // в теории должен быть
                                                fetchResults(
                                                    resultsState.pageId
                                                );
                                            }
                                            setQuizData((prev) => {
                                                return {
                                                    ...prev,
                                                    isResultsBlockStateActive:
                                                        !prev.isResultsBlockStateActive,
                                                };
                                            });
                                        }}
                                    >
                                        {quizData.isResultsBlockStateActive ? (
                                            <>Back to menu</>
                                        ) : (
                                            <>Check out the results</>
                                        )}
                                    </button>
                                </div>
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
