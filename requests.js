// запрос в "бд" за имеющимися тестами
// при загрузке страницы
// function fetchTests() {
//     fetch("http://localhost:3003/tests", {
//         method: "GET",
//         // вот это вот не работает с флагом "Access-Control-Allow-Origin", "*",
//         // mode: "no-cors",
//     })
//         .then((data) => {
//             return data.json();
//         })
//         .then((jsonData) => {
//             // console.log(jsonData);
//             quizTestsArray = jsonData;
//         });
// }

// запрос на получение результатов,
// которые хранятся в json в папаке answers
function fetchResultsAnswers(sessionId) {
    fetch(`http://localhost:3003/results/answers${sessionId}`, {
        method: "GET",
        // вот это вот не работает с флагом "Access-Control-Allow-Origin", "*",
        // mode: "no-cors",
    })
        .then((data) => {
            return data.json();
        })
        .then((jsonData) => {
            // console.log(jsonData);
            userAnswers = jsonData;
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
        });
}

// вот это вот помещается в глобальную
// область видимости и далее используется
// в app.jsx (в дальнейшем переведётся
// в export вероятнее всего)
// let quizTestsArray;
// fetchTests();

// тоже дальше вероятно пойдёт
// в экспорт
let userAnswers;

// вызывается каждый раз когда юзер отвечает
// на вопрос через useEffect в app.jsx
function postAnswer(answerToSend) {
    fetch("http://localhost:3003/answers", {
        method: "POST",
        body: JSON.stringify(answerToSend),
    });
}
