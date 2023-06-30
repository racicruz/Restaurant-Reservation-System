import { useHistory } from "react-router-dom";

/**
 * Component for rendering the form for creating a new reservation.
 *
 * @param {Object} formData - The form data object containing reservation details.
 * @param {Function} handleChange - The function to handle input field changes.
 * @param {Function} handleSubmit - The function to handle form submission.
 * @returns {JSX.Element} JSX representation of the new reservation form.
 */


function NewReservationForm({ formData, handleChange, handleSubmit }) {
    const history = useHistory();

    return (
        <div className="d-flex justify-content-center">
        <form className="w-50" noValidate={true} onSubmit={handleSubmit}>

            {/* First Name and Last Name input fields */}
            <div className="input-group mb-3">
            <input
                required
                type="text"
                onChange={handleChange}
                value={formData.first_name}
                placeholder="First Name"
                className="form-control shadow-sm"
                name="first_name"
            ></input>
            <input
                required
                type="text"
                onChange={handleChange}
                value={formData.last_name}
                placeholder="Last Name"
                className="form-control shadow-sm"
                name="last_name"
            ></input>
            </div>

            {/* Mobile Number input field */}
            <div className="mb-3 form-floating">
            <input
                required
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                maxLength="12"
                onChange={handleChange}
                value={formData.mobile_number}
                placeholder="Mobile Number"
                className="form-control shadow-sm"
                name="mobile_number"
            ></input>
            </div>

            {/* Reservation Date input field */}
            <div className="mb-3 form-floating">
            <input
                required
                type="date"
                onChange={handleChange}
                value={formData.reservation_date}
                placeholder="Reservation Date"
                className="form-control shadow-sm"
                name="reservation_date"
            ></input>
            </div>{" "}

            {/* Reservation Time input field */}
            <div className="mb-3 form-floating">
            <input
                required
                type="time"
                onChange={handleChange}
                value={formData.reservation_time}
                placeholder="Reservation Time"
                className="form-control shadow-sm"
                name="reservation_time"
            ></input>
            </div>{" "}

            {/* People input field */}
            <div className="mb-3 form-floating">
            <input
                required
                type="number"
                min="1"
                onChange={handleChange}
                value={formData.people}
                placeholder="People"
                className="form-control shadow-sm"
                name="people"
                inputMode="numeric"
            ></input>
            </div>

            {/* Submit button */}
            <button className="btn btn-primary mx-2" type="submit">
            Submit
            </button>

            {/* Cancel button */}
            <button
            type="button"
            onClick={history.goBack}
            className="btn btn-secondary"
            >
            Cancel
            </button>
        </form>
        </div>
    );
}

export default NewReservationForm;