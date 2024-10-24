import React from 'react'

function Search({searchRef, closeSearch}) {
  return (
    <div ref={searchRef} className="header-search">
    <div className="header-search-form-control">
      <img src="./LushioFitness/Images/icons/search.svg" alt="" />
      <input type="search" placeholder="SEARCH FOR..." />
      <img
        src="./LushioFitness/Images/icons/cross.png"
        alt=""
        onClick={closeSearch}
      />
    </div>
  </div>
  )
}

export default Search
