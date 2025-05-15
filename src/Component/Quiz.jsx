import React, { useState } from 'react';
import '../App.css';

const Quiz = () => {
  // Hardcoded questions in a variable
  const questions = [
    {
      question: "What is the capital of Haryana?",
      options: ["Yamunanagar", "Panipat", "Gurgaon", "Chandigarh"],
      answer: "Chandigarh"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Venus", "Mars", "Jupiter"],
      answer: "Mars"
    },
    {
      question: "What is the chemical symbol for water?",
      options: ["WO", "H2O", "O2", "OH"],
      answer: "H2O"
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"],
      answer: "William Shakespeare"
    },
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      answer: "Paris"
    },
    {
      question: "Which gas do plants absorb from the atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      answer: "Carbon Dioxide"
    },
    {
      question: "Which language is primarily spoken in Brazil?",
      options: ["Spanish", "Portuguese", "French", "English"],
      answer: "Portuguese"
    },
    {
      question: "How many continents are there on Earth?",
      options: ["5", "6", "7", "8"],
      answer: "7"
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Pablo Picasso", "Leonardo da Vinci", "Vincent van Gogh", "Michelangelo"],
      answer: "Leonardo da Vinci"
    },
    {
      question: "Which is the largest mammal in the world?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"],
      answer: "Blue Whale"
    }
  ];

  const [current, setCurrent] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
  const [showScore, setShowScore] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

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
