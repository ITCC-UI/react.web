import React, { useState } from 'react';
import Calendar from "/images/Calendar.png"
import Edit from "/images/Edit.png"
import Comment from "/images/Comment.png"
import Save from "/images/Save.png"

const DailyLogsComponent = ({ day, calendar, onLogSave }) => {
    const [logs, setLogs] = useState([]);
    const [newLog, setNewLog] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleAddLog = (e) => {
        e.preventDefault();
        if (newLog.trim() !== '') {
            const newLogEntry = {
                id: Date.now(),
                text: newLog.trim(),
                timestamp: new Date()
            };
            setLogs([...logs, newLogEntry]);
            setNewLog('');
            // Optional: Call parent component's save method
            onLogSave && onLogSave(day, newLogEntry);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        // You can add additional save logic here if needed
        setIsEditing(false);
    };

    return (
        <div className="logsUpdate">
            <div className="top">
                <div className="daysActions">
                    <div className="dayCalendar">
                        <div className="day">{day}</div>
                        <div className="calendar">
                            {calendar} <img src={Calendar} alt="Calendar" />
                        </div>
                    </div>
                </div>

                <div className="logsActions">
                    <div className="comment">
                        <img src={Comment} alt="Comment" />
                    </div>
                    <div className="edit">
                        <img src={Edit} alt="Edit" onClick={handleEditToggle} />
                    </div>
                    <div className="save">
                        <img src={Save} alt="Save" onClick={handleSave} />
                    </div>
                </div>
            </div>


            <div className="line"></div>

            <div className="text-field">
                {isEditing ? (
                    <form onSubmit={handleAddLog}>
                        <input 
                            type="text" 
                            name="dailylogs" 
                            id="dailylogs"
                            value={newLog}
                            onChange={(e) => setNewLog(e.target.value)}
                            placeholder="Enter a new log entry"
                        />
                        <button type="submit">Add Log</button>
                    </form>
                ) : (
                    <div>
                        <ul className="logs-list">
                            {logs.map((log) => (
                                <li key={log.id}>
                                    {log.text}
                                    <small className="log-timestamp">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </small>
                                </li>
                            ))}
                        </ul>
                        {logs.length === 0 && <p>No logs added yet</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DailyLogsComponent;