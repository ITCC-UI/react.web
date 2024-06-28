import React from 'react';
import NormalButton from './NormalButton'; // Assuming NormalButton is imported

const DepartmentTrainingCourses = ({ checked, courses }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Course Name</th>
          <th>Session</th>
          <th>Duration</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course, index) => (
          <tr key={index} className={course.activeClass}>
            <td>{course.name}</td>
            <td>{course.session}</td>
            <td>{course.duration}</td>
            <td>{course.status}</td>
            <td>
              {course.activeClass === "active" ? (
                <NormalButton onClick={checked} />
              ) : (
                "Not eligible"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DepartmentTrainingCourses;
