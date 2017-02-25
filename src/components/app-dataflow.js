import React from 'react';
import NavigationBar from './navigation-bar';
import Legends from './legends';
import Modal from './popup-modal';
import DataFlowTable from '../containers/dataflow-table';

export default class extends React.Component {
    render() {
        const dropdownLists = [
            {
                path: "/TestCase",
                title: "Test Case Auditor" 
            },
            {
                path: "/JobMonitor",
                title: "Job Monitoring Tool"
            },
            {
                path: "/LiveSiteTracker",
                title: "Live Site Tracker"
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
        return (
            <div>
                <NavigationBar title={title} dropdown={dropdownLists}>
                    <div className="active">Priority 1</div>
                    <div>Priority 2</div>
                    <div>Priority 3</div>
                </NavigationBar>
                <Legends legends={legends} />
                <DataFlowTable />
            </div>
        );
    }
}