import React from 'react';
import { connect } from 'react-redux';
import { fetchPriority, fetchEndMetricWithPriority } from '../actions/index';

import NavigationBar from '../components/navigation-bar';
import TimezoneToggle from '../components/timezone-toggle';
import Legends from '../components/legends';
import Modal from '../components/popup-modal';
import DataFlowTable from '../components/dataflow-table';

class DataFlowApp extends React.Component {
    constructor(props) {
        super(props);
        this.selectedPriority = "1";
        this.state = {isPST: true};
        this.metrics = {};
        this.fetchedMetricPriority = new Set([this.selectedPriority]);
    }
    
    componentWillMount() {
        this.props.fetchEndMetricWithPriority(this.selectedPriority);
        this.props.fetchPriority();
    }

    changePriority(e) {
        var priority = e.target.innerText.split(' ')[1];
        if (!this.fetchedMetricPriority.has(priority)) {
            this.props.fetchEndMetricWithPriority(priority);
            this.fetchedMetricPriority.add(priority);
            this.selectedPriority = priority;
        } else {
            this.selectedPriority = priority;   
            this.forceUpdate();
        }
    }

    setPST(isPST) {
        this.setState({isPST});
    }

    renderPriorities() {
        var p = this.props.priorities;
        if (p)
            return p.map(n => {
                if (n == this.selectedPriority) 
                    return <div key={n} className="active" onClick={this.changePriority.bind(this)}>Priority {n}</div>
                return <div key={n} onClick={this.changePriority.bind(this)}>Priority {n}</div>
            });
    }
    render() {
        // TODO: replace hardcode below;
        const dropdownLists = [
            {
                path: "http://storedashboarduat:8088/Home/TestCaseAuditor", //"/TestCase",
                title: "Test Case Auditor" 
            },
            {
                path: "http://storedashboarduat:8088/Home/JobMonitor",
                title: "Job Monitoring Tool"
            },
            {
                path: "http://storedashboarddev02:52086/LiveSiteTracker.html",
                title: "Live Site Tracker"
            },
            {
                path: "http://storedashboarddev02:62197",
                title: "DMV Monitor Charts"
            }
        ], title = "Data Flow App",
        legends = [
            {
                class: "UpToDate",
                desc: "Data is In SLA"
            },
            {
                class: "Delay",
                desc: "Data is Out of SLA"
            },
            {
                class: "Error",
                desc: "Query has an error message"
            },
            {
                class: "EmptyData",
                desc: "Data is not presented"
            }
        ];
        console.log('root render');
        return (
            <div>
                <NavigationBar title={title} dropdown={dropdownLists}>
                    {this.renderPriorities()}

                    <TimezoneToggle isPST={this.state.isPST} 
                                    toggle={this.setPST.bind(this)} />
                </NavigationBar>
                <Legends legends={legends} />
                <DataFlowTable isPST={this.state.isPST} 
                            dfInfos={this.props.all} 
                            selectedPriority={this.selectedPriority} /> 
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { priorities: state.dataflowInfos.priority, all: state.dataflowInfos.all };
}

export default connect(mapStateToProps, { fetchPriority, fetchEndMetricWithPriority })(DataFlowApp);