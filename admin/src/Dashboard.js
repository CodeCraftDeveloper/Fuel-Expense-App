import React from "react";
import DashComp from "./components/Dashboard/main";
import { Helmet } from "react-helmet";

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Fuel Expense App</title>
        <meta name="description" content="Admin Dashboard - Cash Tracker" />
      </Helmet>
      <div>
        <DashComp />
      </div>
    </>
  );
};

export default Dashboard;
