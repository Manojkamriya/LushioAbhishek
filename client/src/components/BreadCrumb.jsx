import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import './breadcrumb.css';

const Breadcrumb = ({ items }) => {
  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          <a href={item.link} className="breadcrumb-link">
            {item.label}
          </a>
          {index < items.length - 1 && (
            <FaChevronRight className="breadcrumb-separator" />
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
