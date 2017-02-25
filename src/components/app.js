import React, { Component } from 'react';
import NavigationBar from './navigation-bar';

export default class App extends Component {
    render() {
        return (
            <div>
                {/*Header*/}
                {/*<nav>
                    <div className="dropdown">
                        <a className="dropdown-toggle" href="javascript:void(0)">Data Flow App</a>
                        <div className="dropdown-content">
                            <a href="http://storedashboardtest:8088">Test Case Auditor</a>
                            <a href="http://storedashboarddev02:52086/LiveSiteTracker.html">Live Site Tracker</a>
                        </div>
                    </div>
                    <div>Priority 1</div>
                    <div>Priority 2</div>
                    <div>Priority 3</div>
                </nav>*/}

                {/*Body*/}
                {this.props.children}

                {/*Footer*/}
            </div>
        );
    }
}