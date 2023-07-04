import React from 'react';
import { unseatTable } from "../utils/api";

/**
 * Table component to display information about a table.
 * @param {Object} props - The component props.
 * @param {Object} props.table - The table object containing table information.
 * @param {Function} props.loadDashboard - Function to reload the dashboard.
 * @returns {JSX.Element} - The rendered table component.
 */

const Table = ({ table, loadDashboard }) => {
    //function to handle click event when finishing a table
    function clickHandler() {
        //display confirmation dialog to confirm finishing the table
        if (window.confirm("Is this table ready to seat new guests?")) {
            const abortController = new AbortController();
            //call the api to unseat the table
            unseatTable(table.table_id, abortController.signal)
                .then(loadDashboard)//reload the dashboard after unseating
                .catch((error) => console.log("error", error));
            return () => abortController.abort();
        }
    }
    
    return (
        <div className="card mb-3 shadow-sm">
            <h5 className="card-header">Table Name: {table.table_name}</h5>
            <div className="card-body">
                <div className="container">
                <div className="row d-flex">
                    <h5 className="col card-title mb-0 justify-content-center align-self-center">
                    Capacity: {table.capacity}
                    </h5>
                    {/* Display the status of the table */}
                    {table.reservation_id ? (
                    <>
                        <div
                        className="col btn border border-warning rounded text-warning"
                        data-table-id-status={table.table_id}
                        style={{ cursor: "default" }}
                        >
                        occupied
                        </div>
                    </>
                    ) : (
                    <div
                        className="col btn border border-success rounded text-success"
                        data-table-id-status={table.table_id}
                        style={{ cursor: "default" }}
                    >
                        Free
                    </div>
                    )}
                </div>
                </div>
            </div>
            {/* Display the finish button for occupied tables */}
            {table.reservation_id ? (
                <div
                data-table-id-finish={table.table_id}
                onClick={clickHandler}
                role="button"
                className="card-footer bg-primary text-decoration-none"
                >
                <h5 className="text-white text-center text-decoration-none mb-1">
                    Finish
                </h5>
                </div>
            ) : null}
        </div>
    );
}

export default Table;