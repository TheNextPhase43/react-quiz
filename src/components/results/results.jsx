import s from "./results.module.scss";

export function Results({ resultsState, setResultsState }) {
    return (
        <>
            <div className={s.resultsBlock}>
                <div className={s.resultsWindow}>
                    {resultsState.savedAnswersPageFromDB === undefined ? (
                        <div>loading...</div>
                    ) : (
                        resultsState.savedAnswersPageFromDB.map((el) => {
                            return (
                                <>
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
                                </>
                            );
                        })
                    )}
                </div>
                <button className={s.prevButton}>prev page</button>
                <button className={s.nextButton}>next page</button>
            </div>
        </>
    );
}
