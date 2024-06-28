import React from 'react';

const DepartmentTrainingCourses = ({ checked, courses }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return (
      <>
        {formattedDate}
        <br />
        {formattedTime}
      </>
    );
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Course Code</th>
          <th>Level</th>
          <th>Training Type</th>
          <th>Duration</th>
          <th>Status</th>
          <th>Reg. Start Date</th>
          <th>Reg. End Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course, index) => (
          <tr key={index} className='tableRow'>
            <td>{course.course_code} - {course.course_unit} units</td>
            <td>{course.level}</td>
            <td>{course.training_type_name}</td>
            <td>{course.training_type_duration} Weeks</td>
            <td>{course.registration_status}</td>
            <td>{formatDate(course.registration_start_date)}</td>
            <td>{formatDate(course.registration_end_date)}</td>
            <td>
              {course.can_register === "true" ? (
                <button className="register true" onClick={checked}>Register</button>
              ) : (
                <button className="register false" disabled>Register</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DepartmentTrainingCourses;
