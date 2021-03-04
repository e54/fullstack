import React from 'react'

const Filter = ({searchFilter, handleSearchFilterChange}) => (
  <div>filter shown with
    <input
      value={searchFilter}
      onChange={handleSearchFilterChange}
    />
  </div>
)

export default Filter