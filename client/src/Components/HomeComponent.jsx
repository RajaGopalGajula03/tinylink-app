import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboarrd from "./Dashboard";
import Stats from "./Stats";
import Healthz from "./Healthz";
import Navbar from "./Navbar";



export default function HomeComponent(){

    return(
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element = {<Dashboarrd/>} />
                <Route path="/code/:code" element = {<Stats/>} />
                <Route path="/healthz" element = {<Healthz/>} />
            </Routes>
        </Router>
    )
}