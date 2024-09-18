// запрос в "бд" за имеющимися тестами
function fetchTests() {
    fetch("http://localhost:3003/questions", {
        method: "GET",
        // вот это вот не работает с флагом "Access-Control-Allow-Origin", "*",
        // mode: "no-cors",
    })
        .then((data) => {
            return data.json();
        })
        .then((jsonData) => {
            // console.log(jsonData);
            quizTestsArray = jsonData;
        });
}

// вот это вот помещается в глобальную
// область видимости и далее используется
// в app.jsx (в дальнейшем переведётся
// в export вероятнее всего)
let quizTestsArray;
fetchTests();

function postAnswer(answerToSend) {
    fetch("http://localhost:3003/answers", {
        method: "POST",
        body: JSON.stringify(answerToSend),
    });
}
