// @flow
import React, { Component } from 'react';


export default class SidebarToggle extends Component<any, any> {
    render() {
        
        return (
            <a
                onClick={() => {
                    // me.props.toggleDashboardMinMax();
                }}
                className="sidebar-toggle"
                data-toggle="push-menu" role="button">
                <span className="sr-only">Toggle navigation</span>
            </a>
        );
    }
}
