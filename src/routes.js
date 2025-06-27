import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Messages from "./pages/messages";
import ProtectedRoute from './protectedroutes';
import {Fragment} from 'react';



const RoutesWithHomeAdmin = () => {

  return (
    <>
    <Routes>
    <Fragment>
    <Route path="/" element={<Home />} />
        <Route exact path="/messages" element={<Messages />} />
      </Fragment>
      </Routes>
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <RoutesWithHomeAdmin />
    </Router>
  );
};

export default AppRoutes;
