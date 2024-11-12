import s from "./results.module.scss";
import { useEffect } from "react";

export function Results({ resultsState, setResultsState, fetchResults }) {
    // запрос как обычно через useEffect
    // чтобы избежать проблем с асинхронностью
    useEffect(() => {
        fetchResults(resultsState.pageId);
    }, [resultsState.pageId]);

    return (
        <>
            <div className={s.resultsBlock}>
                <div className={s.resultsWindow}>
                    {resultsState.savedAnswersPageFromDB === undefined ? (
                        <div>loading...</div>
                    ) : (
                        resultsState.savedAnswersPageFromDB.map((el, id) => {
                            return (
                                <div
                                    key={id}
                                    className={s.resultItem}
                                >
                                    <div>sessionId: {el.obj[0].sessionId}</div>
                                    <div>
                                        Correct answers:{" "}
                                        {
                                            el.obj[0].savedAnswers.filter(
                                                (el) => {
                                                    return (
                                                        el.isUserAnswerCorrect ==
                                                        true
                                                    );
                                                }
                                            ).length
                                        }{" "}
                                        of {el.obj[0].savedAnswers.length}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                <button
                    onClick={() => {
                        setResultsState((prev) => {
                            return {
                                ...prev,
                                pageId: prev.pageId - 1,
                            };
                        });
                    }}
                    className={s.prevButton}
                >
                    prev page
                </button>
                <button
                    onClick={() => {
                        setResultsState((prev) => {
                            return {
                                ...prev,
                                pageId: prev.pageId + 1,
                            };
                        });
                    }}
                    className={s.nextButton}
                >
                    next page
                </button>
            </div>
        </>
    );
}
