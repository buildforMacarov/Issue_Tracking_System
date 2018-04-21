import React from 'react';

export default class PostIssue extends React.Component {
    render() {
        return (
            <div className={`Post-issue ${this.props.className}`}>
                <button type="button" className="btn btn-dark">New issue</button>
            </div>
        );
    }
}
