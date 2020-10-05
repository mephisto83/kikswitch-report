import React from 'react';
import logo from './logo.svg';
import './App.css';
import { NodeProject, ImageProject, NodeProperties } from './interfaces';
import { NodeTypeColors, NodeTypes } from './nodestuff';
import Game from './Game';

class Details extends React.Component<
	{
		fileName: string;
		projects: NodeProject[];
		onClick: Function;
		project: ImageProject;
		onProjectItemSelect: Function;
	},
	{ currentPart?: NodeProject }
> {
	constructor(props: any) {
		super(props);
		this.state = {};
	}
	generateName(name: string) {
		let { projects } = this.props;
		let img_width = 1680;
		let img_height = 936;
		return projects.map((v) => {
			return (
				<div
					onMouseOver={() => {
						this.setState({
							currentPart: v
						});
					}}
					onClick={() => {
						this.props.onProjectItemSelect(v.id);
					}}
					className="area-map-item"
					style={{
						position: 'absolute',
						zIndex: 10,
						left: `${v.bounds.x / img_width * 100}%`,
						width: `${(v.bounds.X - v.bounds.x) / img_width * 100}%`,
						top: `${v.bounds.y / img_height * 100}%`,
						height: `${(v.bounds.Y - v.bounds.y) / img_height * 100}%`
					}}
					key={v.id}
				/>
			);
		});
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
			<div className="description">
				Data chains turn into code, that excutes its defined functionality. This is as close to the code as Red
				Quick Builder gets.
			</div>
		);
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
			<h2>Validation</h2>,
			validationSummary,
			<h2>Permission</h2>,
			permissionSummary,
			<h2>Execution</h2>,
			executionSumary
		];
	}
	render() {
		let { project, fileName, projects } = this.props;
		let nodeProject: NodeProject = projects[0];
		let grouped = groupBy(projects, (x: NodeProject) => (x.properties ? x.properties.nodeType : null));
		let mapname = `image-map`;
		let { currentPart } = this.state;
		return (
			<div className="details">
				<div className="detail-header">
					<div className="header">
						<button
							onClick={() => {
								if (this.props.onClick) {
									this.props.onClick();
								}
							}}
						>
							Back
						</button>
					</div>
					<div className="detail-information">
						<h1
							className="text"
							dangerouslySetInnerHTML={{ __html: currentPart ? currentPart.properties.text : '' }}
						/>
						<h2 className="text">NodeType: {currentPart ? currentPart.properties.nodeType : ''}</h2>
					</div>

					<div className="detail-information">{this.getExtraInformation(currentPart)}</div>
				</div>
				<div className="detail-image" style={{ position: 'relative' }}>
					<img src={`img/${fileName}`} alt="" useMap={`#${mapname}`} />
					{this.generateName(mapname)}
				</div>
			</div>
		);
	}
}
function groupBy(xs: any[], key: Function) {
	return xs.reduce(function(rv, x) {
		(rv[key(x)] = rv[key(x)] || []).push(x);
		return rv;
	}, {});
}

export default Details;
