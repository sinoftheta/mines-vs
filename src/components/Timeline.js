import React, {useEffect, useRef, useState} from 'react';

const Timeline = ({options}) => {

    const scriptRef = useRef(null);

    const onTLLoad = () => {
        // this might work
        console.log('TL after load: ', TL);

    }; 

    return <script 
                ref={scriptRef} 
                onLoad={onTLLoad} 
                src={'ewuiorhfgierfgh_timeline.js'} // specified with CopyWebpackPlugin
                async
            />;
}

export default Timeline;