import React, { useState, useEffect } from 'react';
import "../../../components/Table/table.scss";
// import MobileSideBar from '../../../components/Sidebar/MobileSideBar';
import "./introTable.scss";
import classNames from 'classnames';
import axiosInstance from '../../../API Instances/AxiosIntances';
import Filter from '/images/Filter.png'
import { Search } from 'lucide-react';
import MoreDetails from '../../../components/View More/MoreDetails';




const PlacementTable = ({triggerRefresh}) => {
  const [letterRequests, setLetterRequests] = useState([]);
  const [loadingDownloads, setLoadingDownloads] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
const [searchTerm, setSearchTerm]= useState('')
const [filter, setFilter] =useState('all')


  const fetchPlacementLetter = async () => {
    try {
      const registrationResponse = await axiosInstance.get("trainings/registrations/");
      const registrations = registrationResponse.data;
     

      if (registrations.length === 0) {
        
        return;
      }

      // Use the ID of the first registration
      const id = registrations[0].id;
      
      const requestsResponse = await axiosInstance.get(`/trainings/registrations/${id}/placements`)
      const requests = requestsResponse.data;
    
      
      const processedRequests = requests.map(request => ({
        ...request,
        statusClass: getStatusClass(request.status),
      }));

      setLetterRequests(processedRequests);
    } catch (error) {
      
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'ACTIVE':
        return 'approved';
      case 'COMPLETED':
        return 'approved';
      case 'NOT_STARTED':
        return 'rejected'
      default:
        return 'rejected';
    }
  };

  useEffect(() => {
    fetchPlacementLetter();
  }, [triggerRefresh]);

  const handleViewClick = (request) => {
    
    setSelectedRequest(request);
  };

 

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const filteredRequests = letterRequests.filter((request) => {
    const matchesSearch = Object.values(request).some(
      (value) => 
        value && 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFilter = 
      filter === 'all' || 
      request.approval_status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });


  return (
    <section className='shift placement_table'>
      
      <div className="mainBody">
      <div className="search-bar">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search Here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                
              />
             
            </div>
            <div className='filter'>
            <img src={Filter} alt="Hey" className='image-filter' />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pyro"
              >
                
                {/* <option value="all" disabled>Filter</option> */}
                <option value="default" disabled defaultValue={true} hidden>
      Select a status
      
    </option>

                <option value="all"> All </option>
                <option value="approved">Approved</option>
                <option value="submitted">Submitted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        <div className="containerCourse">

       
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Company Supervisor</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => {
                const statusClasses = classNames({
                  'status': true,
                  'status_table': true,
                  'approved': request.statusClass === 'approved',
                  'rejected': request.statusClass === 'rejected',
                 
                });
                const downloadIconClasses = classNames({
                  'downloadIcon': true,
                  'inactive': request.statusClass !== 'approved',
                });
                return (
                  <tr key={index}>
                    <td className='placement_content'>{request.attached_company_branch.company.name}</td>
                    {/* <td className='placement_content'>{request.company_supervisor}</td> */}
                    <td className='placement_content'>{request.company_supervisor}</td>
                    <td className='placement_content'>{request.start_date===null?"Not yet started": formatDate(request.start_date)}</td>
                    <td className='placement_content'>{request.end_date===null?"-----": formatDate(request.start_date)}</td>
                    
                   
        
                 <td className='placement_content'>
                      <div className={statusClasses}>
                        {request.status}                        
                      </div>
                    </td>
                    <td className='down placement_content'>
                      <button onClick={() => handleViewClick(request)}>View More</button>
                     
                    </td>

                    
                  </tr>
                );
              })}
            </tbody>
          </table>
          {selectedRequest && (
            <MoreDetails
              request={selectedRequest}
              onClose={() => setSelectedRequest(null)}
            />
          )}
          
        </div>
      </div>
    
      <div className="register_above mobile">
        Scroll horizontally to see more
      </div>
    </section>
  );
};

export default PlacementTable;
