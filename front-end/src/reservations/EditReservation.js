import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import { readReservation, updateReservation } from '../utils/api';
import formatReservationDate from '../utils/format-reservation-date';
import addDashes from '../utils/addDashes';
import NewReservationForm from './NewReservationForm';
import ErrorAlert from '../layout/ErrorAlert';

const EditReservation = () => {
    const history = useHistory();

    //initialize the form state with empty values
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    };

    //set states
    const [formData, setFormData] = useState({...initialFormState});
    const [formErrors, setFormErrors] = useState([]);

    //get reservation id from params
    const { reservation_id } = useParams();

    //set current reservation information in formData
    //FIXED
    useEffect(() => {
        async function loadReservation() {
            const abortController = new AbortController();
            try {
                const reservation = await readReservation(
                    reservation_id,
                    abortController.signal
                );
                setFormData({ ...formatReservationDate(reservation) });
            } catch (error) {
                console.error(error);
            }
            return () => abortController.abort();
        }
        loadReservation();
    }, [reservation_id]);


    /**
     * Event handler for input field changes.
     *
     * @param {Object} event - The input field change event.
     */

    const handleChange = ({ target }) => {
        if (target.name === "mobile_number") addDashes(target);
        setFormData({
            ...formData,
            [target.name]: target.value,
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

        const reservationDate = new Date(
            `${formData.reservation_date}T${formData.reservation_time}:00`
        );

        const [hours, minutes] = formData.reservation_time.split(":");

        const errors = [];

        //form validation
        if (!event.target.checkValidity()) event.target.classList.add("was-validated");

        //check if date of reservation is valid/in future
        if (Date.now() > Date.parse(reservationDate)) {
        errors.push({
            message: `Reservation must be for a future date or time.`,
        });
        }

        //check if reservation date is on a tuesday, if yes throw error
        if (reservationDate.getDay() === 2) {
        errors.push({
            message: `Periodic Tables is closed on Tuesdays. Sorry!`,
        });
        }

        //check if time of reservation is before 10:30 AM
        if ((hours <= 10 && minutes < 30) || hours <= 9) {
        errors.push({
            message: `Periodic Tables opens at 10:30 AM.`,
        });
        }

        //check if time of reservation is past 9:30 PM
        if ((hours >= 21 && minutes > 30) || hours >= 22) {
        errors.push({
            message: `Periodic Tables stops accepting reservations at 9:30 PM.`,
        });
        }

        formData.people = Number(formData.people);

        //check if number of people is valid
        if (formData.people < 1) {
        errors.push({
            message: `Bookings must include at least 1 guest`,
        });
        }

        //set the form errors
        setFormErrors(errors);

        //update the reservation if there are no errors
        !errors.length &&
        updateReservation(formData, reservation_id, abortController.signal)
            .then((_) => {
            history.push(`/dashboard?date=${formData.reservation_date}`);
            })
            .catch((e) => console.log(e));

        return () => abortController.abort();
    }

    //render the error alerts based on form errors
    //FIXED
    let displayErrors = formErrors.map((error, index) => (
        <ErrorAlert key={index} error={error} />
      ));

    return (
        <>
            <div className='text-center mt-3 mb-5'>
                <h1>Edit Reservation</h1>
            </div>
            {displayErrors}
            <NewReservationForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />
        </>
    );
}

export default EditReservation;