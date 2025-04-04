import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { PulseLoader } from 'react-spinners';
import axiosInstance from '../../../../API Instances/AxiosIntances';
import './Modals.scss';

const QuestionnaireModal = ({ onClose, placementId, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState(5);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/trainings/registrations/placements/${placementId}/employer-evaluation-surveys/question/`
      );
      console.log("Response:", response.data)
      setCurrentQuestion(response.data);
      setProgress((response.data.number / 20) * 100);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to fetch question');
      console.log("Errosr:", error)
    } finally {
      setLoading(false);
    }
  };

  const fetchNextQuestion = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/trainings/registrations/placements/${placementId}/employer-evaluation-surveys/question/?left=false`
      );
      setCurrentQuestion(response.data);
      setProgress((response.data.number / 20) * 100);
      setSelectedAnswer(null);
    } catch (error) {
      if (error.response?.status === 404) {
        // No more questions, show summary
        fetchSummary();
      } else {
        setError(error.response?.data?.detail || 'Failed to fetch next question');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviousQuestion = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/trainings/registrations/placements/${placementId}/employer-evaluation-surveys/question/?left=true`
      );
      setCurrentQuestion(response.data);
      setProgress((response.data.number / 20) * 100);
      setSelectedAnswer(null);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to fetch previous question');
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
      setError(error.response?.data?.detail || 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) {
      setError('Please select an answer');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(
        `/trainings/registrations/placements/${placementId}/employer-evaluation-surveys/submit-response/`,
        {
          question_number: currentQuestion.number,
          response: selectedAnswer
        }
      );
      fetchNextQuestion();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

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
              value={summary?.overall_score || 0}
              text={`${summary?.overall_score || 0}%`}
              styles={buildStyles({
                pathColor: '#0066FF',
                textColor: '#0066FF',
                trailColor: '#E5E7EB'
              })}
            />
            <p className="score-label">Excellent</p>
          </div>
          <div className="summary-details">
            {summary?.category_scores?.map((category, index) => (
              <div key={index} className="category-score">
                <span className="category-name">{category.name}</span>
                <div className="score-bar-container">
                  <div 
                    className="score-bar" 
                    style={{ width: `${category.score}%` }}
                  />
                </div>
                <span className="score-value">{category.score}%</span>
              </div>
            ))}
          </div>
          <button onClick={onClose} className="close-button">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content questionnaire">
        <div className="progress-header">
          <div className="progress-text">Question {currentQuestion?.number} of 20</div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-percentage">{progress}%</div>
        </div>

        <div className="question-content">
          <h3>{currentQuestion?.text}</h3>
          <div className="options">
            {[25, 50, 75, 100].map((value) => (
              <label key={value} className={`option ${selectedAnswer === value ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="answer"
                  value={value}
                  checked={selectedAnswer === value}
                  onChange={(e) => setSelectedAnswer(Number(e.target.value))}
                />
                <span className="option-text">{value}%</span>
                <div className="option-bar">
                  <div className="fill" style={{ width: `${value}%` }} />
                </div>
              </label>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="button-group">
          {currentQuestion?.number > 1 && (
            <button onClick={fetchPreviousQuestion} className="btn-secondary">
              Previous
            </button>
          )}
          <button onClick={handleSubmitAnswer} className="btn-primary">
            {loading ? <PulseLoader size={8} color="white" /> : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal; 