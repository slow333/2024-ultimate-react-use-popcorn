import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import StarRating, {Test} from "./StarRating";
import TextExpander from "./textExpander/TextExpander";
import App from "./App";
import './index.css';
// import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
     <React.StrictMode>
       {/*<StarRating/>*/}
       {/*<StarRating size={40} fullColor="#0f0" messages={['Terrible', 'bad', 'Okay', 'good', 'excellent']}/>*/}
       {/*<StarRating size={50} fullColor="#0fe" maxRating={9} defaultRating={4}/>*/}
       {/*<TextExpander/>*/}
       <App/>
     </React.StrictMode>
);