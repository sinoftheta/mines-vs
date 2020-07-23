// REACT //
import React, {useReducer, useEffect} from 'react';

// HOOKS //
import DispatchContext from './hooks/dispContext.js';
import useCombinedReducer from './hooks/combineReducers.js';

import Timeline from './components/Timeline.js';


// COMPONENTS //
// ...


const App = () => {

    useEffect(() => {
        console.log('awake');
    }, []);

    return <Timeline
        options={'idk'}
    />;
}

export default App;
