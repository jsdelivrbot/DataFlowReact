import React from 'react';
import ReactDOM from 'react-dom';
import { createStoreWithMiddleware } from '../index';
import { Provider } from 'react-redux';

import reducers from '../reducers';

export default class extends React.Component {
    componentDidMount() {
        this.modalTarget = document.createElement('div');
        this.modalTarget.id = "myModal";
        var modalContent = document.createElement('div');
        modalContent.id = "myModal-content"
        this.modalTarget.appendChild(modalContent);
        document.body.appendChild(this.modalTarget);
        this.modalTarget.onclick = (e) => {
            if (e.target === this.modalTarget)
                this.props.onRemove();
        }
    }

    componentWillUnmount() {
        document.body.removeChild(this.modalTarget);
    }

    render() {
        // return nothing
        return <div />;
    }
}