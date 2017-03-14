import React from 'react';
import DataFlowGraph from '../libraries/dataflowGraph';

export default class extends React.Component {
    // shouldComponentUpdate() {
    //     return false;
    // }
    constructor(props) {
        super(props);
        
        this.timezoneIsChanged = false;
    }

    componentWillUpdate(nextProps, nextStates) {
        if (this.timezoneIsChanged == nextProps.isPST) {
            this.timezoneIsChanged = !this.timezoneIsChanged;

            //this.initializeGraph();
        }
    }

    addEventColorPath() {
        var metric = document.getElementById(this.props.keyId),
            buttons = metric.childNodes, i, j, svg = metric.firstChild.children, coloredPath = new Set();
        for (i = 1; i < buttons.length; i++) {
            var button = buttons[i].firstChild;
            var content = null;
            button.onmouseover = (e) => {
                content = metric.parentNode.getElementsByClassName("content" + e.target.innerHTML)[0];
                content.style.display = "block";
                var contentWidth = Math.floor(content.offsetWidth / 2);
                content.style.left = (e.clientX - contentWidth) + "px";
                if (Math.floor(window.innerHeight * 3 / 5) < e.clientY) {
                    content.style.top = (e.clientY - content.offsetHeight - 50) + "px";
                } else {
                    content.style.top = (e.clientY + 40) + "px";
                }
            };
            button.onmouseout = (e) => {
                content.style.display = "none";
            }
            button.onclick = (e) => {
                var copyContent = content.firstChild.cloneNode(true);
                var query = copyContent.getElementsByClassName('query')[0];
                query.innerHTML = "<pre>" + query.innerText + "</pre>";
                this.props.onClick(copyContent);
                var target = document.getElementById('myModal-content');
                target.appendChild(copyContent);
                return false;
            }

            // color path
            if (i > 1) {
                var left = buttons[i].style.left,
                    top = buttons[i].style.top,
                    color = window.getComputedStyle(button, null).getPropertyValue('background-color');
                left = Number(left.substr(0, left.length - 2));
                top = Number(top.substr(0, top.length - 2));
                for (j = 2; j < svg.length; j++) {
                    if (!coloredPath.has(j)) {
                        var d = svg[j].attributes.d.value;
                        d = d.split(',');
                        if (d <= 1) d = d.split(' ');
                        var x = Number(d[d.length - 2]),
                            y = Number(d[d.length - 1]);
                        if (x == left && y - top > 19 && y - top < 23) {
                            svg[j].attributes.stroke.value = color;
                            coloredPath.add(j);
                        }
                    }
                }
            }
        }
    }

    initializeGraph() {
        const id = this.props.keyId, data = this.props.dataFlowInfo, pst = this.props.isPST,
            graph_structure = {
                chart: {
                    rowSeparation: 60,
                    colSeparation: 100,
                    container: id,
                    connectors: {
                        style: {
                            'stroke-width': 3
                        }
                    },
                    padding: 15
                },
                graphStructure: data.map(metric => {
                    var struct = {
                        key: metric.step,
                        innerHTML: "<button class='btn-circle'>" + metric.step + "</button>",
                        HTMLclass: (metric.status + ' PST'),
                        nextNodes: metric.nextNodes || []
                    };
                    if (!pst) {
                        struct.HTMLclass = (metric.statusIST + ' IST');
                    }
                    return struct;
                })
            };
        DataFlowGraph(graph_structure, this.addEventColorPath.bind(this));
    }

    componentDidMount() {
        this.initializeGraph();
    }

    renderPopupWindow() {
        return this.props.dataFlowInfo.map((data) => (
            <div key={Math.random()} className={"content content" + data.step}>
                <table>
                    <tbody>
                        <tr>
                            <td>Max Date</td>
                            <td className="max-date">{data.dataAvailableThrough}</td>
                        </tr>
                        <tr>
                            <td>Table</td>
                            <td className="data-info">{data.dataInformation}</td>
                        </tr>
                        <tr>
                            <td>Metric Value</td>
                            <td>{"$" + data.revenue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</td>
                        </tr>
                        <tr>
                            <td>Query</td>
                            <td className="query">{data.script}</td>
                        </tr>
                        <tr>
                            <td>Error Message</td>
                            <td>{data.errorMessage}</td>
                        </tr>
                        <tr>
                            <td>Time Update</td>
                            <td>{data.timeUpdate}</td>
                        </tr>
                        <tr>
                            <td>When out of SLA</td>
                            <td className="refresh-node">{data.refreshNode}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ));
    }

    render() {
        if (this.props.dataFlowInfo) {
            return (
                <div>
                    <div id={this.props.keyId} />
                    {this.renderPopupWindow()}
                </div>
            );
        } else {
            return <h5>No Details</h5>
        }
    }
}