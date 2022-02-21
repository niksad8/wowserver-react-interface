import React from 'react';
import { BrowserRouter as Route } from 'react-router-dom';
import App from './App';
import HomePage from "./pages/homepage";
export default (
    <Route path="/" component={App}>
        <Route path="/" component={HomePage} />
    </Route>
);