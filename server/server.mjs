// Настоящий бэкэнд уффф

// не работает, походу устарело или не уместно
// const http = require("http");

import { createServer } from "http";
import { quizTestsArray } from "./questions.js";

import * as fs from "node:fs/promises";
import { constants } from "fs";
// import fs from 'fs/promises';

// сделать обработку запросов get для получения данных о
// вопросах для отображения
// ok

// сделать обработку запросов post для добавления в json
// объект данных userAnswer

// сделать обработку запросов get результатов для вывода
// данных о userAnswers

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
        // ---------------------------------------------------------------------------
        // сохранение данных об ответе юзера
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

                // let currentlySavedAnswers = [];

                // это проверка на существование файла, чтобы если
                // его нет - создать его, и в дальнейшем записывать
                // в него ответы (по идее можно и не создавть тут,
                // он сам создаться потом, уже с данными, но для
                // понимания сделаю так)
                try {
                    await fs.access(
                        `./answers/answers${recievedData.sessionId}.json`,
                        constants.F_OK
                    );
                    console.log("file exists");
                } catch {
                    console.log("file doesn't exist, creating");
                    // создаём пустой json (важно чтобы был пустой
                    // вообще то можно проверки потом добавить чтобы
                    // не выкидывало ошибку если файл не пуст,
                    // но пока окей)
                    await fs.writeFile(
                        `./answers/answers${recievedData.sessionId}.json`,
                        JSON.stringify(""),
                        {
                            encoding: "utf-8",
                            flag: "w",
                        }
                    );
                }
                // await fs
                //     .access(
                //         `./answers/answers${recievedData.sessionId}.json`,
                //         constants.F_OK
                //     )
                //     .then(() => {
                //         console.log("file exists");
                //     })
                //     .catch(() => {
                //         console.log("file doesn't exist, creating");
                //         // создаём пустой json с объектом внутри
                //         fs.writeFile(
                //             `./answers/answers${recievedData.sessionId}.json`,
                //             JSON.stringify({}),
                //             {
                //                 encoding: "utf-8",
                //                 flag: "w",
                //             }
                //         );
                //     });

                // читаем файл
                let currentlySavedAnswers = await fs.readFile(
                    `./answers/answers${recievedData.sessionId}.json`
                );

                // !!!
                // только если файл не пустой парсим его в объект,
                // во избежания ошибок
                if (currentlySavedAnswers.length !== 0) {
                    currentlySavedAnswers = JSON.parse(currentlySavedAnswers);
                }

                // опять консоль дебаг
                // console.log("currentlySavedAnswers:", currentlySavedAnswers);

                // новые данные, полученные соединив
                // старые + новый объект ответа с фронта
                let newSavedAnswers = [
                    // по идее если условие выше не выполнено,
                    // то мы просто не парсим прочтённые данные
                    // из json, и я расчитывал что здесь сервер
                    // выкинет ошибку, но видимо он развёртывает
                    // <Bufer >, и просто ничего сюда не добавляет
                    // короче это не крашит систему, но если что
                    // можно добавить в условие else, чтобы если
                    // файл при чтении пустой, делать currentlySavedAnswers
                    // пустым объектом например
                    ...currentlySavedAnswers,
                    { ...recievedData.answer },
                ];

                // console.log("Currently saved answers:", currentlySavedAnswers);

                // console.log(currentlySavedAnswers);

                // const id = recievedData.questionId;

                // перед записью теперь добавить чтение файла, сохранение
                // в объект, объединение имеющегося объекта, и нового,
                // который пришёл с фронта. Далее снова преобразовать
                // в json, и записать
                await fs.writeFile(
                    `./answers/answers${recievedData.sessionId}.json`,
                    JSON.stringify(newSavedAnswers),
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
