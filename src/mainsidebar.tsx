// @flow
import React, { Component } from 'react';

export default class Header extends Component<any, any> {
	relative() {
		return this.props.relative ? {} : {};
	}
	overflow() {
		return this.props.overflow ? { maxHeight: '100vh', overflowY: 'auto' } : {};
	}
	render() {
		if (this.props.notactive) {
			return <div />;
		}
		let style: any = { minHeight: 0, ...this.relative(), ...this.overflow() };
		return (
			<aside className={`main-sidebar`} style={style}>
				<section className="sidebar" style={{ height: 'auto' }}>
					{this.props.children}
				</section>
			</aside>
		);
	}
}
