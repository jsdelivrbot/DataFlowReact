import React from 'react';
import { Link } from 'react-router';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showDropdown: false}
    }
    renderDropdown() {
        return this.props.dropdown.map(n => <Link to={n.path} key={n.title.split(' ').join('-')}>{n.title}</Link>);
    }

    render() {
        var showDropdown = function(e) {
            var content = e.target.nextSibling;
            if (this.state.showDropdown) {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
            this.setState({showDropdown: !this.state.showDropdown});
        }

        return (
            <nav>
                <div className="navigation">
                    <div className="dropdown" onClick={showDropdown.bind(this)}>
                        <a className="dropdown-toggle" href="#">{this.props.title}</a>
                        <div className="dropdown-content">
                            {this.renderDropdown()}
                        </div>
                    </div>
                    {this.props.children}
                </div>
            </nav>
        );
    }
}