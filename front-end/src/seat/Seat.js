import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Seat component for selecting a table to seat a reservation.
 */

function Seat() {
    const history = useHistory();
    const { reservation_id } = useParams();

    const [tables, setTables] = useState([]); //state variable for tables
    const [tableId, setTableId] = useState("");//state variable for selected table id
    const [formErrors, setFormErrors] = useState([]); //state variable for form errors

    useEffect(loadTables, []); //load tables on component mount

    function loadTables() {
        const abortController = new AbortController();
        listTables(abortController.signal)
            .then(setTables)
            .catch(console.log);
        return () => abortController.abort(); //cleanup function to abort fetch request on component unmount
    }

    const handleChange = ({ target }) => {
        setTableId(target.value); //Uupdate selected table ID on change
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        setFormErrors([]);//clear form errors

        const errors = [];//array to store form errors

        setFormErrors(errors);//update form errors state

        updateTable(reservation_id, tableId, abortController.signal)
        .then((_) => {
            history.push(`/dashboard`); //redirect to dashboard after table update
        })
        .catch((e) => console.log(e));//log any errors

        return () => abortController.abort();//cleanup function to abort fetch request on component unmount
    };

    let displayErrors = formErrors.map((error, index) => (
        <ErrorAlert key={index} error={error} />
    )); //generate JSX for displaying form errors

    const tableList = tables.map((table) => (
        <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
        </option>
    )); //generate JSX for table options

    return (
        <>
        <div className="text-center mt-3 mb-5">
            <h1>Select A Table</h1>
        </div>
        {formErrors.length > 0 && displayErrors} {/* Display form errors */}
        <div className="d-flex justify-content-center">
            <form className="form-inline" onSubmit={handleSubmit}>
            <label className="form-label sr-only" htmlFor="table">
                Table Name:
            </label>
            <select
                required
                onChange={handleChange}
                value={tableId}
                className="form-control shadow-sm"
                name="table_id"
            >
                <option value="">-- Choose Table --</option>
                {tableList} {/* Render table options */}
            </select>
            <button className="btn btn-primary mx-2" type="submit">
                Submit
            </button>
            <button
                onClick={history.goBack}
                type="button"
                className="btn btn-secondary"
            >
                Cancel
            </button>
            </form>
        </div>
        </>
    );
}

export default Seat;