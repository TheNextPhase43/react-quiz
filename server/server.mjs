// Настоящий бэкэнд уффф

// не работает, походу устарело или не уместно
// const http = require("http");

import { createServer } from "http";
import { quizTestsArray } from "./questions.js";

import * as fs from "node:fs/promises";
// import fs from 'fs/promises';

// сделать обработку запросов get для получения данных о
// вопросах для отображения

// сделать обработку запросов get результатов для вывода
// данных о userAnswers

// сделать обработку запросов post для добавления в json
// объект данных userAnswer

const server = createServer(async (req, res) => {
    // что бы получать точное значение реальных запросов
    // без иконки
    // if (request.url !== "/favicon.ico") {
    //     requestCounter++;
    // }

    // console.log(req.headers);

    function parseDataFromServer(request) {
        // тело пост запроса
        const body = [];
        // парсинг требует асинхронности,
        // как можно заметить
        return new Promise((res, rej) => {
            // я пока не разобрался в методах запроса
            // но по идее мы превращаем чанки в текст,
            // ничего сложного
            request
                .on("data", (chunk) => body.push(chunk.toString()))
                .on("end", () => {
                    // сами данные, которые мы выслали с фронта
                    // может их и не надо вовсе в объект js
                    // превращать, и оставить в json, но да
                    // ладно, если что уберу
                    const parsedData = JSON.parse(body.join());
                    // console.log("in:", parsedData);
                    res(parsedData);
                });
        });
    }

    switch (req.url) {
        // так, это у нас ответ на запрос вопросов
        case "/questions":
            res.setHeader("Content-Type", "application/json");
            // конкретно это нужно пока я не понял для чего именно,
            // но без него json не проходит
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.write(JSON.stringify(quizTestsArray));
            res.end();
            break;
        case "/answers":
            if (req.method === "POST") {
                // Там внутри сборка js объекта из body запроса
                // с фронта, так что вынос в отдельную функцию
                // потребовал немного асинхронности (возможно
                // делать этого и не стоило, или можно было
                // как то этого избежать... возможно...)
                // а ещё может и не стоило делать всю функцию async,
                // а накрутить тут всё черещ промисы и then'ы, но я
                // пока не нашёл причин избегать await'ов тут,
                // а они весьма удобные
                let recievedData = await parseDataFromServer(req);
                // о да, этот дебаг через консоль логи
                console.log("Incoming data:", recievedData);

                // перед записью теперь добавить чтение файла, сохранение
                // в объект, объединение имеющегося объекта, и нового,
                // который пришёл с фронта. Далее снова преобразовать
                // в json, и записать
                await fs.writeFile(
                    "./answers.json",
                    JSON.stringify(recievedData),
                    {
                        encoding: "utf-8",
                        flag: "w",
                    }
                );
            }
            // вот это вот тут возможно и не нужно,
            // но я написал res.end() (хз нужен ли вообще res.end
            // в пост запросе) и оно начало выкидывать ошибку что
            // и в гет запросе ругаясь на политику безопасности
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end();
            break;
        default:
            res.write("Not found");
            res.end();
    }
});

server.listen(3003);
