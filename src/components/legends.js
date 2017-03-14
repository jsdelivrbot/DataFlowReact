import React from 'react';

const Legends = (props) => (
    <div className="header">
        {props.legends.map(l => (
            <div key={l.desc.split(' ').join('-')}>
                <span className={l.class} />
                <span>{l.desc}</span>
            </div>
        ))}
    </div>
);

export default Legends;