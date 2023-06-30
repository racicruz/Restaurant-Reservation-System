import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import addDashes from '../utils/addDashes';
import ErrorAlert from '../layout/ErrorAlert';
import NewReservationForm from './NewReservationForm';
import { createReservation } from '../utils/api'


/**
 * Component for creating a new reservation.
 *
 * @returns {JSX.Element} JSX representation of the NewReservation component.
 */

const NewReservation = () => {
    const history = useHistory();

    //initialize the form state with empty values
    const initialFormState = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: 1,
    };

    //set states
    const [formData, setFormData] = useState({...initialFormState});
    const [formErrors, setFormErrors] = useState([]);


    /**
     * Event handler for input field changes.
     *
     * @param {Object} event - The input field change event.
     */

    const handleChange = ({ target }) => {
        //format the phone number by adding dashes
        if(target.name === "mobile_number") addDashes(target);
        //update the form data state based on the changes input field
        setFormData({
            ...formData,
            [target.name]: target.name === "people" ? parseInt(target.value) : target.value,
        });
    };


    /**
     * Event handler for form submission.
     *
     * @param {Object} event - The form submission event.
     */

    const handleSubmit = (event) => {
        event.preventDefault();
        //create an abort controller for cancelling the submission
        const abortController = new AbortController();
        //reset the form errors
        setFormErrors([]);

        const errors = [];
        
        //form validation
        if(!event.target.checkValidity()) event.target.classList.add("was-validated");
        
        //check if number of people is valid
        if (formData.people < 1) {
            errors.push({
              message: `Bookings must include at least 1 guest`,
            });
        }

        //set the form errors
        setFormErrors(errors);
        
        //create the reservation if there are no errors
        !errors.length && createReservation(formData, abortController.signal)
            .then((_) => {
                //redirect to the dashboard with date of reservation newly created
                history.push(`/dashboard?date=${formData.reservation_date}`);
            })
            .catch((error) => console.log(error));
        
        return () => abortController.abort();
    }

    //render the error alerts based on form errors
    let displayErrors = formErrors.map(error => (
        <ErrorAlert key={error.message} error={error} />
    ));

    return (
        <>
            <div className='text-center mt-3 mb-5'>
                <h1>Create New Reservation</h1>
            </div>
            {displayErrors}
            <NewReservationForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </>
    )
}

export default NewReservation;