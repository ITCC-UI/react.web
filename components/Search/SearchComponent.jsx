import React, { useState } from 'react';
import { Search } from 'lucide-react';

const TableFilterComponent = ({ onSearch, onFilter, data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleFilter = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    onFilter(selectedFilter);
  };

  return (
    <div className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
      <div>
        <select
          value={filter}
          onChange={handleFilter}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="submitted">Submitted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
};

export default TableFilterComponent;