// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import MainReportRenderFile from "./Components/ReportComponent/MainReportRenderFile";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main-report" element={<MainReportRenderFile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
