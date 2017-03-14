import React from 'react';

export default (props) => (
    <div className="timezone">
        <span className={"timezoneIST" + (props.isPST ? '' : " timezone-active")} 
                onClick={() => props.toggle(false)}>India</span>
        <span className={"timezonePST" + (props.isPST ? " timezone-active" : '')} 
                onClick={() => props.toggle(true)}>Redmond</span>
    </div>
)