import React from 'react';
import "./table.scss"
import classNames from 'classnames';
import NormalButton from '../Normal Button/NormalButton';
const DepartmentTrainingCourses = ({toggleRegistration, isRegistered, registerSelf,checked}) => {
  // const isEligible = props.eligible;
const userYear=200
  const activeClasses= classNames({
    'eligibility': true,
    'eligible': userYear===200,
    'ineligible': 3>7
  })

  
  return (
    <section>
      {/* {isDisplayed && <DisplayedComponent onClose={handleClose}/>} */}
      <div className="heading">
        <h2>
          Department Training Courses
        </h2>
      </div>

      <div className="mainBody">
        <div className="containerCourse">
          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Session</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TIT 223 - 2 Units</td>
                <td>2019/2020</td>
                <td>8 Weeks</td>
                <td>
                  <div className={activeClasses}>
                    Eligible
                  </div>
                  <div className={response.status === 'active' ? 'eligible' : 'ineligible'}>
  Eligibile
</div>
                </td>
                <td><NormalButton registerSelf="register" onButtonClick={checked}/></td>
              </tr>
              <tr>
                <td>TIT 323 - 3 Units</td>
                <td>2020/2021</td>
                <td>12 Weeks</td>
                <td>
                  <div className="eligibility ineligible">Ineligible</div>
                </td>
                <td><NormalButton registerSelf="register inactive"/></td>
              </tr>
              <tr>
                <td>TIT 423 - 6 Units</td>
                <td>2021/2022</td>
                <td>24 Weeks</td>
                <td>
                  <div className="eligibility eligible">Eligible</div>
                </td>
                <td><button className="register">Register</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Prefilled form display */}
      </div>
    </section>
  );
};

export default DepartmentTrainingCourses;
