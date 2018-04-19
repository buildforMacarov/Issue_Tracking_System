import React from 'react';

export default class PostAssignment extends React.Component {
    render() {
        return (
            <div className={`Post-assignment ${this.props.className}`}>
                <button type="button" className="btn btn-dark">Assign an issue</button>
            </div>
        );
    }
}
