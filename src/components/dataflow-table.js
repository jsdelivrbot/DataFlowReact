import React from 'react';

import DataFlowCell from './dataflow-cell';
import Modal from './popup-modal';
import { isEmpty, formatTo12 } from '../libraries/utilities';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalDisplay: false
        }
        this.metrics = {};
        this.rows = [];
        this.timezoneIsChanged = false;
    }

    showModal() {
        this.setState({
            isModalDisplay: true
        });
    }

    hideModal() {
        this.setState({
            isModalDisplay: false
        });
    }

    loopMetrics(metrics, callback) {
        for (let key in metrics) {
            if (metrics.hasOwnProperty(key)) {
                callback(key, metrics[key]);
            }
        }
    }

    componentDidUpdate(prevProps) {
        const pst = this.props.isPST, changeDisplay = (metrics, display) => {
            this.loopMetrics(metrics, (key) => {
                let id = key.split(' ').join('-'),
                    row = document.getElementById(id).parentNode.parentNode.parentNode;
                row.style.display = display;
            })
        }
        for (let prio in this.metrics) {
            if(this.metrics.hasOwnProperty(prio)) {
                let metrics = this.metrics[prio];
                if (prio === prevProps.selectedPriority.toString()) {
                    changeDisplay(metrics, 'none');
                } 
                if (prio === this.props.selectedPriority.toString()) {
                    changeDisplay(metrics, 'table-row');
                }
            }
        }

        if (this.timezoneIsChanged == pst) {
            this.timezoneIsChanged = !this.timezoneIsChanged;
            console.log('change timezone');
            for (let priority in this.metrics) {
                if (this.metrics.hasOwnProperty(priority)) {
                    let metrics = this.metrics[priority];
                    this.loopMetrics(metrics, (key, metric) => {
                        let id = key.split(' ').join('-'),
                            cell = document.getElementById(id),
                            expectedDelay = cell.parentNode.parentNode.previousSibling.firstChild,
                            nodes = cell.childNodes,
                            time = (pst ? formatTo12(metric[0].timeThreshold) : formatTo12(metric[0].timeThresholdIST)), i;
    
                        expectedDelay.innerHTML = "T" + metric[0].expectedDelay + " at " + time;
                        for (i = 1; i < nodes.length; i++) {
                            nodes[i].className = 'node ' + (pst ? (metric[i - 1].status + ' PST') : (metric[i - 1].statusIST + ' IST'));
                        }
                    });
                }
            }
        }
    }

    renderHeader() {
        return (
            <thead>
                <tr>
                    <th>End-Metric</th>
                    <th>Expected Date Delay</th>
                    <th>Data Flow</th>
                </tr>
            </thead>
        )
    }

    renderRow(metrics) {
        const pst = this.props.isPST;
        this.loopMetrics(metrics, (key, metric) => {
            let time = (pst ? formatTo12(metric[0].timeThreshold) : formatTo12(metric[0].timeThresholdIST)),
                keyId = key.split(' ').join('-'),
                tr = (
                    <tr key={keyId}>
                        <td><h4>{key}</h4></td>
                        <td>
                            <h4>{"T" + metric[0].expectedDelay + " at " + time}</h4>
                        </td>
                        <td>
                            <DataFlowCell keyId={keyId} 
                                        dataFlowInfo={metric} 
                                        isPST={pst}
                                        onClick={this.showModal.bind(this)} />
                        </td>
                    </tr>
                );
            this.rows.push(tr);
        });
    }

    renderBody() {
        const prio = this.props.selectedPriority, dfInfos = this.props.dfInfos;
        if (!isEmpty(dfInfos) && !this.metrics.hasOwnProperty(prio)) {
            this.metrics[prio] = dfInfos;
            this.renderRow(dfInfos);
        } else if (this.rows.length == 0 && !isEmpty(this.metrics)) {
            console.log('rebuild rows from cache');
            for (let priority in this.metrics) {
                if (this.metrics.hasOwnProperty(priority)) {
                    let metrics = this.metrics[priority];
                    this.renderRow(metrics);
                }
            }
        }
        return this.rows; 
    }

    render() {
        const modal = <Modal content={this.state.content} onRemove={this.hideModal.bind(this)} />
        return (
            <div>
                {this.state.isModalDisplay ? modal : null}
                <table className="container" id="dataflow-table">
                    {this.renderHeader()}
                    <tbody>
                        {this.renderBody()}
                    </tbody>
                </table>
            </div>
        );
    }
}