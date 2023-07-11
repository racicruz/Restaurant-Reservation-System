import React, { useState } from 'react';
import addDashes from '../utils/addDashes';
import { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import Reservation from '../dashboard/Reservation';

/**
 * Search component for finding reservations by phone number.
 *
 * @returns {JSX.Element} - The rendered Search component.
 */

const Search = () => {
    //define initial form state and error states
    const initialFormState = {
        mobile_number: ""
    }

    const [formData, setFormData] = useState({...initialFormState});
    const [formErrors, setFormErrors] = useState([]);

    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState([]);

    const [message, setMessage] = useState(null);

    //handle input change event
    const handleInputChange = ({ target }) => {
        //format the input by adding dashes
        addDashes(target);
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    //handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        setFormErrors([]);
        setMessage(null);

        const errors = [];

        //add any validation errors to the errors array
        setFormErrors(errors);

        //prepare query parameter for API request
        const mobileNumberQuery = { mobile_number: formData.mobile_number };

        //call the API to list reservations based on the mobile number query
        listReservations(mobileNumberQuery, abortController.signal)
            .then(setReservations) //set the reservations state with the retrieved reservations
            .catch(setReservationsError); //set the reservations error state if there's an error

        //return an abort function to abort the API request if needed
        return () => abortController.abort();
    };

    //create ErrorAlert components for form errors and reservation errors
    let displayErrors = formErrors.map(error => (
        <ErrorAlert key={error} error={error} />
    ));
    let displayReservationErrors = reservationsError.map(error => (
        <ErrorAlert key={error} error={error} />
    ));

    //create Reservation components for each reservation in the reservations array
    const reservationList = reservations.map(reservation => (
        <Reservation key={reservation.reservation_id} reservation={reservation} />
    ));

    //define content to be displayed based on the reservations array
    const content = reservations.length ? (
        <div className='container mt-3'>
            <div className='row justify-content-center'>
                <div className='col col-8'>{reservationList}</div>
            </div>
        </div>
    ) : (
        <h3 className='text-center mt-4'>No reservations found</h3>
    );


    return (
        <>
            <div className='text-center mt-3 mb-5'>
                <h1>Find Booking By Phone Number</h1>
            </div>

            {formErrors.length ? displayErrors : null}
            {reservationsError.length ? displayReservationErrors : null}

            <form
                className='form-inline d-flex justify-content-center'
                onSubmit={handleSubmit}
            >
                <input
                    required
                    type='tel'
                    maxLength="12"
                    placeholder='Enter a phone number'
                    onChange={handleInputChange}
                    value={formData.mobile_number}
                    className='form-control shadow-sm'
                    name='mobile_number'
                >
                </input>
                <button
                    className='btn btn-primary mx-2'
                    type='submit'
                >
                    Find
                </button>
            </form>
            
            {content}
            {message}
        </>
    )
}

export default Search;