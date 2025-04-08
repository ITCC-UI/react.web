import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { PulseLoader } from "react-spinners";
import { X } from "lucide-react";
import axiosInstance from "../../../../API Instances/AxiosIntances";
import "./Modals.scss";

const QuestionnaireModal = ({ onClose, placementId, onComplete }) => {
  const [questions, setQuestions] = useState([]); // Store all questions
  const [currentIndex, setCurrentIndex] = useState(0); // Track current question index
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Store selected answers
  const [error, setError] = useState(null);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/trainings/registrations/placements/${placementId}/employer-evaluation-surveys/`
      );
      
      setQuestions(response.data);
      setCurrentIndex(0);
      setProgress((1 / response.data.length) * 100);
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const startSurvey = () => {
    setShowWelcomeScreen(false);
  };

  const handleNext = () => {
    if (!selectedAnswers[questions[currentIndex]?.id]) {
      setError("Please select an answer before proceeding.");
      return;
    }

    setError(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setProgress(((currentIndex + 2) / questions.length) * 100);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(((currentIndex) / questions.length) * 100);
    }
  };

  const handleSelectAnswer = (value) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentIndex]?.id]: value,
    });
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const responses = questions.map((question) => ({
      score: (selectedAnswers[question.id])/100 || 0,
      remarks: "", // If needed, you can add a remarks input
      survey_question: question.id,
    }));

    try {
      await axiosInstance.post(
        `/trainings/registrations/placements/${placementId}/employer-evaluation-surveys/submit-response/`,
        { responses }
      );
      fetchSummary();
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to submit answers");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/trainings/registrations/placements/${placementId}/employer-evaluation-surveys/summary/`
      );
      
      setSummary(response.data);
      setShowSummary(true);
    } catch (error) {
     
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSummary) {
      fetchSummary();
    }
  }, [showSummary]);

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <PulseLoader color="#0066FF" />
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="modal-overlay">
        <div className="modal-content evaluation-summary">
          <h2>Evaluation Summary</h2>
          <div className="summary-score">
            <CircularProgressbar
              value={summary?.total_score*100 || 0}
              text={`${summary?.total_score*10*10 || 0}%`} 
              styles={buildStyles({
                pathColor: "#000080",
                textColor: "#000080",
                trailColor: "#E5E7EB",
              })}
            />
            
            {/* Display category scores as individual progress bars */}
           
          </div>
          {summary?.category_score && Object.entries(summary.category_score).map(([criteria, score]) => (
              <div key={criteria} className="skill-progress-container">
                <div className="skill-info">
                  <span className="skill-name">{score.criteria}</span>
                  <span className="skill-percentage">{Math.round(score.score * 100)}%</span>
                  
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-summary" 
                    style={{ 
                      width: `${score.score * 100}%`,
                      backgroundColor: "#000080"
                    }}
                  ></div>
                </div>
              </div>
            ))}
    
            <p className="skill-label ">{summary?.remark}</p>
          <button onClick={onClose} className="close-button">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (showWelcomeScreen) {
    return (
      <div className="modal-overlay">
        <div className="modal-content welcome-screen">
          <div onClick={onClose} className="close-button fling">
            <X size={20} color='black' />
          </div>
          
          <h1>Training Evaluation Survey</h1>
          
          <p className="welcome-description">
            Hey there! 
            
            We trust you enjoyed your recently concluded Industrial Training. 
            <br/> <br/> Kindly take a minute to fill out this survey. Your feedback helps us improve future training placement. Thank you.
          </p>
          
          <button onClick={startSurvey} className="start-button btn-primary">
            Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="warn">
        You can only fill this questionnaire once. 
        <br/>Please make sure to fill it out correctly.
      </div>
      <div className="modal-content questionnaire">
        <div onClick={onClose} className="close-button">
          <X size={20} color='black' />
        </div>
        <div className="progress-header">
          <div className="progress-text">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-percentage">{progress.toFixed(0)}%</div>
        </div>

        {questions.length > 0 && (
          <div className="question-content">
            <div className="crit">{questions[currentIndex]?.criteria}</div>
            <div className="critDescript">{questions[currentIndex]?.criteria_description}</div>
            <h3>{questions[currentIndex]?.question}</h3>
            <div className="options">
              {[25, 50, 75, 100].map((value) => (
                <label
                  key={value}
                  className={`option ${
                    selectedAnswers[questions[currentIndex]?.id] === value
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={value}
                    checked={selectedAnswers[questions[currentIndex]?.id] === value}
                    onChange={() => handleSelectAnswer(value)}
                  />
                  <span className="option-text">{value}%</span>
                  <div className="option-bar">
                    <div className="fill" style={{ width: `${value}%` }} />
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {error && <div className="error-message error-message-eef">{error}</div>}

        <div className="button-group">
          {currentIndex > 0 && (
            <button onClick={handlePrevious} className="btn-secondary">
              Previous
            </button>
          )}
          {currentIndex + 1 < questions.length ? (
            <button onClick={handleNext} className="btn-primary">
              {loading ? <PulseLoader size={8} color="white" /> : "Next"}
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary submit">
              {loading ? <PulseLoader size={8} color="white" /> : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;