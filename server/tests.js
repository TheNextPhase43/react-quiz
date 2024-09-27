class Test {
    constructor(title, testId, questions) {
        this.title = title;
        this.testId = testId;
        this.questions = questions;
    }
}

class Question {
    constructor(
        title,
        questionText,
        answers,
        isSeveralAnswers,
        correctAnswerId
    ) {
        // вы только посмотрите, он изобрёл тайпскрипт
        // текст
        this.title = title;
        // текст
        this.questionText = questionText;
        // массив ответов
        this.answers = answers;
        // булевое, много ответов, или один
        this.isSeveralAnswers = isSeveralAnswers;
        // массив с айди правильного ответа (или нескольких!)
        this.correctAnswerId = correctAnswerId;
        // !!!!!!!!!!!!
        // и ответы, и айди правильного ответа, и в дальнейшем
        // (ниже) правильные ответы являются массивами (для удобства)
        // ответ то может быть и один, но для удобства всё всегда в массиве
        // воизбежании лишних условий
        this.correctAnswer = this.answers.filter((el, id) =>
            this.correctAnswerId.includes(id)
        );
        // this.correctAnswer = this.isSeveralAnswers
        //     ? // вот этот адаптив с разным количеством ответов был реально сложным
        //       // вообще по идее можно было бы всегда использовать для одного/нескольких
        //       // вариантов ответа массив, но я вот сделал что тут либо массив, либо число
        //       [
        //           this.answers.filter((el, id) =>
        //               this.correctAnswerId.includes(id)
        //           ),
        //       ]
        //     : this.answers[this.correctAnswerId];
    }
}

// вопросы для тестов
const question1 = new Question("Question 1", "1 + 1", ["1", "2", "3"], false, [
    1,
]);
const question2 = new Question(
    "Question 2",
    "2 + 2 (several answers)",
    ["3", "4", "4"],
    true,
    [1, 2]
);
const question3 = new Question("Question 3", "2 + 2", ["3", "5", "4"], false, [
    2,
]);
const question4 = new Question("Question 4", "2 + 2", ["3", "5", "4"], false, [
    2,
]);

// тесты для дальнейшего выбора
const arrayOfQuestions0 = [];
const arrayOfQuestions1 = [];
// одинаковые вопросы, потому что это просто пример
arrayOfQuestions0.push(question1, question2, question3, question4);
arrayOfQuestions1.push(question1, question2, question3, question4);

const test0 = new Test("Test 0", 0, arrayOfQuestions0);
const test1 = new Test("Test 1", 1, arrayOfQuestions1);

// массив с тестами на экспорт
const quizTestsArray = [];
quizTestsArray.push(test0, test1);

export { quizTestsArray };

// export const arrayOfQuestions = [
//     {
//         title: "Question 1",
//         questionText: "1 + 1",
//         answers: ["1", "2", "3"],
//         correctAnswerId: 1,
//         correctAnswer: this.answers[this.correctAnswerId],
//     },
//     {
//         title: "Question 2",
//         questionText: "2 + 2",
//         answers: ["3", "5", "4"],
//         correctAnswerId: 2,
//         correctAnswer: this.answers[this.correctAnswerId],
//     },
// ];
