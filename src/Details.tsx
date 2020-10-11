import React from 'react';
import logo from './logo.svg';
import './App.css';
import { NodeProject, ImageProject, NodeProperties } from './interfaces';
import { NodeTypeColors, NodeTypes } from './nodestuff';
import Game from './Game';

export default class Details extends React.Component<{ currentPart: NodeProject; }, any> {
	constructor(props: any) {
		super(props);
		this.state = {};
	}
	getExtraInformation(currentPart: NodeProject | undefined) {
		if (currentPart) {
			switch (currentPart.properties.nodeType) {
				case NodeTypes.Concept:
					return this.getConceptExplanation(currentPart);
				case NodeTypes.Model:
					return this.getModelExplanation();
				case NodeTypes.AgentAccessDescription:
					return this.getAgentAccessDescription();
				case NodeTypes.DataChain:
					return this.getDataChainDescription();
			}
		}
		return null;
	}
	getDataChainDescription() {
		return (
			<div className="description">Data chains turn into code, that excutes its defined functionality. This is as close to the code as Red Quick Builder gets.</div>
		)
	}
	getAgentAccessDescription() {
		return (
			<div className="description">
				These nodes describe the access granted to an agent in the system. The relationships described in these
				nodes tells us what agents can or cannot do. These nodes will ultimately generate the majority of the
				functionality.
			</div>
		);
	}
	getModelExplanation() {
		return (
			<div className="description">
				Models represent concrete ideas in the app. For example a "Work Item" may have properties representing
				the name, description or state. The models are the backbone and first thing created for the application.
			</div>
		);
	}
	getSummary(summary: any) {
		if (!summary) {
			return <div />;
		}
		return <ul>{summary.map((v: string) => <li key={v}>{v}</li>)}</ul>;
	}
	getStructuredSummary(summary: any) {
		if (!summary) {
			return <div />;
		}
		return (
			<div>
				<h3 key={summary.name}>{summary.name}</h3>
				{this.getSummary(summary.parts)}
			</div>
		);
	}
	getConceptExplanation(currentPart: NodeProject | undefined) {
		let executionSumary = <p>No execution steps described</p>;;
		if (
			currentPart &&
			currentPart.properties &&
			currentPart.properties.ExecutionSummary &&
			currentPart.properties.ExecutionSummary.length
		) {
			executionSumary = this.getStructuredSummary({
				name: '',
				parts: currentPart.properties.ExecutionSummary
			});
		}

		let permissionSummary = <p>No permissions described</p>;;
		if (currentPart && currentPart.properties && currentPart.properties.PermissionSummary) {
			permissionSummary = currentPart.properties.PermissionSummary.map((v: any) => this.getStructuredSummary(v));
		}

		let validationSummary = <p>No validation described</p>;
		if (currentPart && currentPart.properties && currentPart.properties.ValidationSummary) {
			validationSummary = currentPart.properties.ValidationSummary.map((v: any) => this.getStructuredSummary(v));
		}

		return [
			<h2 key='permission'>Permission</h2>,
			permissionSummary,
			<h2 key='validation'>Validation</h2>,
			validationSummary,
			<h2 key='execution'>Execution</h2>,
			executionSumary
		];
	}
	render() {
		let { currentPart } = this.props;
		return (
			<div className="details">
				<div className="detail-header">
					<div className="detail-information">{this.getExtraInformation(currentPart)}</div>
				</div>
			</div>
		);
	}
}
function groupBy(xs: any[], key: Function) {
	return xs.reduce(function (rv, x) {
		(rv[key(x)] = rv[key(x)] || []).push(x);
		return rv;
	}, {});
}

