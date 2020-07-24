// REACT //
import React, {useReducer, useEffect, useState} from 'react';

// HOOKS //
import DispatchContext from './hooks/dispContext.js';
import useCombinedReducer from './hooks/combineReducers.js';



// COMPONENTS //
// ...


const App = () => {

    const [loaded, setLoaded] = useState(false); // change to hook?

    useEffect(() => {
        // load timeline data from api


    });

    const loadTL = () => {
        const script = document.createElement('script');
        const timeline_json = { events: [] }
        script.innerHTML=`var timeline = new TL.Timeline('timeline', ${JSON.stringify(timeline_json)}, {theme_color: '#288EC3', ga_property_id : 'UA-26278437-20'});`;

        // TODO
        let startID = false, id = 0;
        if(startID) {
            script.innerHTML+=`; timeline.goToId("${id}");`
        }

        document.body.appendChild(script);
    }



    return loaded ?
        <div/> //not sure yet, TL container?
        :
        <button onClick={loadTL}>load tl</button>
        ;
}

export default App;
