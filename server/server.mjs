// Настоящий бэкэнд уффф

// не работает, походу устарело или не уместно
// const http = require("http");

import { createServer } from "http";
import { quizTestsArray } from "./tests.js";

import * as fs from "node:fs/promises";
import { constants } from "fs";
// import fs from 'fs/promises';

// сделать обработку запросов get для получения данных о
// вопросах для отображения
// ok

// сделать обработку запросов post для добавления в json
// объект данных userAnswer
// ok

// сделать обработку запросов get результатов для вывода
// данных о userAnswers

const server = createServer(async (req, res) => {
    // что бы получать точное значение реальных запросов
    // без иконки
    // if (request.url !== "/favicon.ico") {
    //     requestCounter++;
    // }

    console.log(req.url);

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
        case "/sessions":
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            // этот блок здесь только для проверки на наличие
            // самого файла
            try {
                await fs.access(`./sessions.json`, constants.F_OK);
            } catch {
                await fs.writeFile(`./sessions.json`, "", {
                    encoding: "utf-8",
                    flag: "w",
                });
            }
            const sessionIdBuffer = await fs.readFile("./sessions.json");
            let sessionIdArray = [];

            // короче по итогу у нас будет либо массив с одним нулём,
            // либо массив, прочитанный из файла sessions.json
            if (sessionIdBuffer.length !== 0) {
                sessionIdArray = JSON.parse(sessionIdBuffer);
            }

            const newSessionId =
                sessionIdArray.length === 0
                    ? 0
                    : sessionIdArray[sessionIdArray.length - 1] + 1;

            sessionIdArray.push(newSessionId);

            console.log(sessionIdArray);

            // из за строгого режима реакт dev,
            // при загрузке страницы компонент
            // отрисовывался дважды, и посылал
            // запрос за сессией тоже дважды
            // отключение строгого режма помогло,
            // но вероятно, это не слишком верно
            await fs.writeFile(
                `./sessions.json`,
                JSON.stringify(sessionIdArray),
                {
                    encoding: "utf-8",
                    flag: "w",
                }
            );

            res.write(JSON.stringify(newSessionId));
            res.end();
            break;

        case "/tests":
            res.setHeader("Content-Type", "application/json");
            // конкретно это нужно пока я не понял для чего именно,
            // но без него json не проходит
            res.setHeader("Access-Control-Allow-Origin", "*");

            await new Promise((resolve, reject) => {
                // это тест задержки на сервере
                setTimeout(() => {
                    res.write(JSON.stringify(quizTestsArray));
                    // console.log("Response write");
                    resolve();
                }, 0);
            });

            // console.log("Response end");
            res.end();
            break;

        // ---------------------------------------------------------------------------
        // сохранение данных об ответе юзера
        case "/answers":
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
            // console.log("Incoming data:", recievedData);

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
                // console.log("file doesn't exist, creating");
                // создаём пустой json (важно чтобы был пустой
                // вообще то можно проверки потом добавить чтобы
                // не выкидывало ошибку если файл не пуст,
                // но пока окей)
                await fs.writeFile(
                    `./answers/answers${recievedData.sessionId}.json`,
                    JSON.stringify({}),
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
            // console.log("just after read: ", currentlySavedAnswers.savedAnswers);

            // !!!
            // только если файл не пустой парсим его в объект,
            // во избежания ошибок
            if (currentlySavedAnswers.length !== 0) {
                currentlySavedAnswers = JSON.parse(currentlySavedAnswers);
            }
            // ужасающий костыль, нужен во избежания ошибок если файл
            // был пустым, или вовсе не существовал, в дальнейшем
            // это свойство должно и так появится, но при его развороте
            // выдаёт ошибку отсутствия возможности итерабельности
            // короче предусмотрено что свойство должно быть, но его
            // нет, поэтому костылём подпираем, чтобы было
            if (currentlySavedAnswers.savedAnswers == undefined) {
                currentlySavedAnswers.savedAnswers = [];
            }

            // опять консоль дебаг
            // console.log("currentlySavedAnswers:", currentlySavedAnswers);
            // console.log("after modifying: ",currentlySavedAnswers.savedAnswers);

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
                ...currentlySavedAnswers.savedAnswers,
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
                JSON.stringify({
                    sessionId: recievedData.sessionId,
                    savedAnswers: newSavedAnswers,
                }),
                {
                    encoding: "utf-8",
                    flag: "w",
                }
            );
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end();
            break;

        case `/answerspage${req.url.match(/\d/g)}`:
            const pageId = parseInt(req.url.match(/\d/g));
            const countOfPagesToSend = pageId * 5;

            // эти две грёбаные версии файл системы
            // у ноды (промисы/не промисы) меня с ума сведут



            // сделать выборку только пяти страниц
            async function readFilesInDirectory(dirName) {
                try {
                    let fileNames = await fs.readdir(dirName);

                    // адовая сортировочка
                    fileNames.sort((a, b) => {
                        // console.log(a, b);
                        return (
                            parseInt(a.match(/\d/g).join("")) -
                            parseInt(b.match(/\d/g).join(""))
                        );
                    });

                    const filesPromises = fileNames.map((fileName) => {
                        return fs.readFile(dirName + fileName, "utf-8");
                    });

                    // вот на этом этапе это массив json'ов (почти)
                    let files = await Promise.all(filesPromises);
                    // console.log(files);
                    // да, eval может показаться тут лишним, но JSON.parse
                    // не работает в данном случае из за лишних ковычек там и сям
                    // так как это мой первый проект с бекэндом, я ещё плохо умею
                    // манипулировать файлами через ноду. Я думаю что для моей задачи
                    // (прочитать определённое колво файлов и переслать на фронт,
                    // есть гораздо лучшее решение, чем вот это вот через костыли)
                    // в дальнейшем я узнаю как сделать лучше
                    files = files.map((el) => {return eval('({obj:[' + el + ']})');})
                    return files;
                } catch (err) {
                    console.error(err);
                }
            }

            // console.log("filenames1: ", fileNames);

            // console.log("filenames2: ", fileNames);

            // const filesArray = [];

            // try {
            //     fileNames.forEach(async (el, i) => {
            //         // console.log("countOfPagesToSend: ", countOfPagesToSend);
            //         // console.log("i: ", i);

            //         // как вытащить айди сессии из названия
            //         // console.log(parseInt(el.match(/\d/g).join("")));
            //         if (i >= countOfPagesToSend) {
            //             return;
            //         }
            //         const file = await fs.readFile(`./answers/${el}`);
            //         filesArray.push(JSON.parse(file));
            //     });
            // } catch (error) {}

            // console.log(filesArray);
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // доделать пересыл на фронт пяти (относительно
            // pageId) первых и последующих файлов answers
            // чтение-json-отправка
            const filesToSend = await readFilesInDirectory("./answers/");
            console.log(filesToSend);

            res.setHeader("Access-Control-Allow-Origin", "*");
            // почему то во вкладке нетворка это не считается
            // JSON'ом, хотя тут отчётливо видно что это он
            // хоть файл и доходит до фронта, и работает там
            res.write(JSON.stringify(filesToSend));
            res.end();
            break;
        // вот это вот тут возможно и не нужно,
        // но я написал res.end() (хз нужен ли вообще res.end
        // в пост запросе) и оно начало выкидывать ошибку что
        // и в гет запросе ругаясь на политику безопасности

        // запрос на результаты тестов
        // возможно сделать разветвление, чтобы выдавать !!!
        // json по разным http запросам, в зависимости от
        // айди сессии в самом http запросе передавать
        // данные json'а из соответствующего файла на сервере
        // жёстко загрёб всё универсальной проверкой через
        // регулярное выражение
        case `/results/answers${req.url.match(/\d/g)}`:
            // console.log("what you know");

            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            // -----------------------------------------------
            // доделать ответ на гет запрос на ответы из бд
            res.write(JSON.stringify({ skibidi: "skibidi" }));
            res.end();
            break;
        default:
            console.log("Default case triggered!");

            res.write("Not found");
            res.end();
    }
});

server.listen(3003);
