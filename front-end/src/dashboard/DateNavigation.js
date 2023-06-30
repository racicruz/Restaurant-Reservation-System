import React from 'react';
import { Link } from "react-router-dom";
import { previous, next, today } from '../utils/date-time';


//component for navigating between dates using buttons
const DateNavigation = ({ date }) => {
  return (
    <div className='btn-group' role='group'>
        <Link
            type='button'
            className='btn btn-secondary'
            to={(location) => {
                return `${location.pathname}?date=${previous(date)}`;
            }}
        >
            Previous
        </Link>
        <Link
            type='button'
            className='btn btn-secondary'
            to={(location) => {
                return `${location.pathname}?date=${today()}`;
            }}
        >
            Today
        </Link>
        <Link
            type='button'
            className='btn btn-secondary'
            to={(location) => {
                return `${location.pathname}?date=${next(date)}`;
            }}
        >
            Next
        </Link>
    </div>
  )
}

export default DateNavigation