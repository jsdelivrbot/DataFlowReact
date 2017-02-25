import React from 'react';
import { connect } from 'react-redux';
import { fetchDataFlow } from '../actions/index';

import DataFlowCell from '../components/dataflow-cell';
import Modal from '../components/popup-modal';

class DataFlowTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalDisplay: false
        }
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

    componentWillMount() {
        this.props.fetchDataFlow();
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

    renderBody() {
        const df = this.props.dfInfos;
        if (df) {
            var rows = [];
            for (var key in df) {
                if (df.hasOwnProperty(key)) {
                    var data = df[key], 
                        time = data[0].timeThreshold,
                        keyId = key.split(' ').join('-'),
                        tr = (
                        <tr key={keyId}>
                            <td><h4>{key}</h4></td>
                            <td>
                                <h4>{"T " + data[0].expectedDelay + " at " + time}</h4>
                            </td>
                            <td>
                                <DataFlowCell keyId={keyId} dataFlowInfo={data} onClick={this.showModal.bind(this)}/>
                            </td>
                        </tr>
                    );
                    rows.push(tr);
                }
            }
            return rows;
        }
    }

    render() {
        var modal = <Modal content={this.state.content} onRemove={this.hideModal.bind(this)} />
        return (
            <div>
                {this.state.isModalDisplay ? modal : null}
                <table className="container">
                    {this.renderHeader()}
                    <tbody>
                        {this.renderBody()}
                    </tbody>
                </table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { dfInfos: state.dataflowInfos.all };
}

export default connect(mapStateToProps, { fetchDataFlow })(DataFlowTable);