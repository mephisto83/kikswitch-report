// @flow
import React, { Component } from 'react';
import DashboardLogo from './dashboardlogo';
import DashboardNavBar from './dashboardnavbar';
import MainSideBar from './mainsidebar';
import SidebarToggle from './sidebartoggle';
import SideBarMenu from './sidebarmenu';
import SideBarHeader from './sidebarheader';
import Header from './header';
import Content from './content';
import NavBarMenu from './navbarmenu';

export default class DashboardContainer extends Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {};
	}

	minified() {
		return this.props.minified ? 'sidebar-collapse' : '';
	}

	render() {

		return (
			<div
				className={`skin-red sidebar-mini skin-red`}
				style={{
					height: 'auto',
					minHeight: '100vh'
				}}
			>
				<div className="wrapper" style={{ height: '100vh' }}>
					<Header>
						<DashboardLogo word="Viewer" />
						<DashboardNavBar>
							<SidebarToggle />
							<NavBarMenu />
						</DashboardNavBar>
						<MainSideBar overflow>
							<SideBarMenu>
								<SideBarHeader
									title={'Viewer'}
									onClick={() => {
										// this.props.toggleVisual('MAIN_NAV');
									}}
								/>
								{this.props.sideBar || null}
							</SideBarMenu>
						</MainSideBar>
						<Content flex={this.props.flex}>{this.props.children}</Content>
					</Header>
				</div>
			</div>
		);
	}
}

