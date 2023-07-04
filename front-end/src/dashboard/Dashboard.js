import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "./Reservation";
import DateNavigation from "./DateNavigation";
import Table from "./Table";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  //State Variables
  const [reservations, setReservations] = useState([]); //Stores the reservations
  const [reservationsError, setReservationsError] = useState(null); //Stores any errors related to reservations

  const [tables, setTables] = useState([]); //Stores the tables
  const [tablesError, setTablesError] = useState(null); //Stores any errors related to tables

  //effect hook to load reservations when the date changes
  useEffect(loadDashboard, [date]);

  //function to load reservations for the selected date
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null); //clear any previous error

    //fetches reservations from the API using the passed in date
    listReservations({ date }, abortController.signal)
      .then(setReservations)//update reservation state
      .catch(setReservationsError); //set an error if the API request fails
    listTables(abortController.signal)
      .then(setTables)//update tables state
      .catch(setTablesError); //set an error if the API request fails
    return () => abortController.abort(); // Cleanup function to abort the API request if the component unmounts or the effect runs again
  }

  //makes a list of Reservation components using the data in reservations
  const reservationList = reservations.map(reservation => (
    <Reservation 
      key={reservation.reservation_id}
      reservation={reservation}
    />
  ));

  //makes a list of Table components using the data in tables
  const tableList = tables.map(table => (
    <Table 
      loadDashboard={loadDashboard}
      key={table.table_id}
      table={table}
    />
  ));

  return (
    <main>
      <div className="text-center mt-3 mb-5">
        <h1>Dashboard</h1>
        <DateNavigation date={date} /> {/* renders the DateNavigation component and pass the date in to be used */}
      </div>
      <ErrorAlert error={reservationsError} /> {/* renders an error alert if there is a reservations error */}
      <ErrorAlert error={tablesError} /> {/* renders an error alert if there is a tables error */}
      <div className="container">
        <div className="row">
          <div className="col col-sm">
            <h4 className="mb-4 text-center">Reservations for: {date}</h4>
            {reservationList} {/* renders the list of Reservation components */}
          </div>
          <div className="col col-sm">
            <h4 className="mb-4 text-center">Tables:</h4>
            {tableList} {/* renders the list of Table components */}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
