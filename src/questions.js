class Question {
    constructor(title, questionText, answers, correctAnswerId) {
        this.title = title;
        this.questionText = questionText;
        this.answers = answers;
        this.correctAnswerId = correctAnswerId;
        this.correctAnswer = this.answers[this.correctAnswerId];
    }
}

const question1 = new Question("Question 1", "1 + 1", ["1", "2", "3"], 1);
const question2 = new Question("Question 2", "2 + 2", ["3", "5", "4"], 2);
const question3 = new Question("Question 2", "2 + 2", ["3", "5", "4"], 2);
const question4 = new Question("Question 2", "2 + 2", ["3", "5", "4"], 2);
const question5 = new Question("Question 2", "2 + 2", ["3", "5", "4"], 2);
const question6 = new Question("Question 2", "2 + 2", ["3", "5", "4"], 2);
const question7 = new Question("Question 2", "2 + 2", ["3", "5", "4"], 2);

const arrayOfQuestions = [];
arrayOfQuestions.push(question1, question2, question3, question4);

export { arrayOfQuestions };

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
