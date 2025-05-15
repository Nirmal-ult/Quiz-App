import React, { useEffect, useState } from 'react';
import '../App.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/Questions')
      .then(res => {
        if (!res.ok) throw new Error('run json-server --watch src/db.json --port 3000 in terminal to fetch questin');
        return res.json();
      })
      .then(data => {
        setQuestions(data);
        setUserAnswers(Array(data.length).fill(null));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleOptionSelect = (option) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[current] = option;
    setUserAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (current === questions.length - 1) {
      const unansweredCount = countUnanswered();
      if (unansweredCount > 0) {
        setShowWarning(true);
      } else {
        setShowScore(true);
      }
    } else {
      setCurrent(current + 1);
    }
  };

  const handlePrevious = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return answer === questions[index]?.answer ? score + 1 : score;
    }, 0);
  };

  const countUnanswered = () => {
    return userAnswers.filter(answer => answer === null).length;
  };

  const handleModalClose = (confirm) => {
    if (confirm) {
      setShowScore(true);
    }
    setShowWarning(false);
  };

  if (loading) return <div className="app-wrapper"><p>Loading questions...</p></div>;
  if (error) return <div className="app-wrapper"><p>Error: {error}</p></div>;

  console.log("Current question index:", current);
  console.log("Total number of questions:", questions.length);

  return (
    <div className="app-wrapper">
      <div className="quiz-container">
        {showScore ? (
          <h2>Your Score: {calculateScore()} / {questions.length}</h2>
        ) : (
          <>
            <h1>Quiz App</h1>
            <h3>Question {current + 1} of {questions.length}</h3>
            <p className="question-text">{questions[current]?.question}</p>
            <div className="options-container">
              {questions[current]?.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`option ${userAnswers[current] === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <input
                    type="radio"
                    name={`q-${current}`}
                    checked={userAnswers[current] === option}
                    readOnly
                  />
                  <p>{option}</p>
                </div>
              ))}
            </div>
            <div className="button-group">
              <button
                onClick={handlePrevious}
                disabled={current === 0}
                className={current === 0 ? 'disabled-button' : 'blue-button'}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className={current === questions.length - 1 ? 'green-button' : 'blue-button'}
              >
                {current === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </>
        )}
      </div>

      {showWarning && (
        <div className="modal">
          <div className="modal-content">
            <h2>Warning!</h2>
            <p>You have not answered all the questions. Do you still want to submit the test?</p>
            <div className="modal-buttons">
              <button onClick={() => { handleModalClose(true); }}>Yes, Submit</button>
              <button onClick={() => { handleModalClose(false); }}>No, Go Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
