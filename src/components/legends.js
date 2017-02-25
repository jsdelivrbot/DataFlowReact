import React from 'react';

const Legends = (props) => (
    <div className="header">
        {props.legends.map(l => (
            <h3 className={l.class} key={l.desc.split(' ').join('-')}>{l.desc}</h3>
        ))}
    </div>
);

export default Legends;