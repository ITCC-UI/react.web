import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./table.scss";
import classNames from 'classnames';
import axiosInstance from '../../API Instances/AxiosIntances';
import NormalButton from '../Normal Button/NormalButton';
import DisplayedComponent from '../Confirmation Form/ConfamForm';

const DepartmentTrainingCourses = ({ checked }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  const fetchTrainingCourses = async () => {
    try {
      const response = await axiosInstance.get("trainings/department/trainings/registrations/");
      const courses = response.data;

      const processedCourses = courses.map(course => ({
        ...course,
        activeClass: course.registration_status === "ACTIVE" ? "active" : "inactive",
        canRegister: course.can_register === "true",
        already_registered: course.student_training === null ? false : true
      }));

      setCourses(processedCourses);
    } catch (error) {
     
    }
  };

  useEffect(() => {
    fetchTrainingCourses();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-UK', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return (
      <>
        {formattedDate}
        <br />
        <div className="timer">
          {formattedTime}
        </div>
      </>
    );
  };

  const handleRegisterClick = (course) => {
    setSelectedCourse(course);
  };

  return (
    <>
      {selectedCourse && (
        <DisplayedComponent
          onClose={() => setSelectedCourse(null)}
          headings={selectedCourse.title}
          duration={selectedCourse.training_type_duration}
          selectedCourse={selectedCourse}
        />
      )}
      <section>
        <div className="heading">
          <h2>Department Training Courses</h2>
        </div>

        <div className="mainBody">
          <div className="containerCourse">
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Level</th>
                  <th>Duration</th>
                  <th>Registration <br /> Start Date</th>
                  <th>Registration <br /> End Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => {
                  const activeClasses = classNames({
                    'eligibility': true,
                    'eligible': course.activeClass === 'active',
                    'ineligible': course.activeClass !== 'active'
                  });
                  return (
                    <tr key={index}>
                      <td>
                        {course.course_code} <br />
                        {course.course_unit === 0 ? "N/A" : `${course.course_unit} units`}
                      </td>
                      <td>{course.level}</td>
                      <td>{course.training_type_duration} - Weeks</td>
                      <td>{formatDate(course.registration_start_date)}</td>
                      <td>{formatDate(course.registration_end_date)}</td>
                      <td>
                        <div className={activeClasses}>
                          {course.registration_status}
                        </div>
                      </td>
                      <td>
                        {course.can_register ? (
                          <NormalButton registerSelf="register active" onButtonClick={() => handleRegisterClick(course)} />
                        ) : course.already_registered ? (
                          <NormalButton registerSelf="register active" onButtonClick={() => navigate(`/page_print/${course.student_training}`)} buttonText="Reprint" />
                        ) : (
                          <NormalButton registerSelf="register inactive" disabled />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="register_above mobile">
          Scroll horizontally to see more
        </div>
      </section>
    </>
  );
};

export default DepartmentTrainingCourses;
