import React from 'react';
import logo from './logo.svg';
import './App.css';
import { NodeProject, ImageProject, NodeProperties } from './interfaces';
import { NodeTypeColors } from './nodestuff';

class Game extends React.Component<{
	onClick: Function;
	fileName: string;
	projects: NodeProject[];
	project: ImageProject;
}> {
	render() {
		let { project, fileName, projects } = this.props;
		let nodeProject: NodeProject = projects[0];
		let grouped = groupBy(projects, (x: NodeProject) => (x.properties ? x.properties.nodeType : null));
		let temp = Object.keys(grouped)
			.map((b) => {
				let nodeProject: NodeProject = grouped[b][0];
				return (
					<span
						className="img"
						style={{
							height: 30,
							width: 30,
							backgroundColor: NodeTypeColors[nodeProject.properties.nodeType],
							borderRadius: '50%'
						}}
					/>
				);
			})
			.slice(0, 3);
		let temp_big = Object.keys(grouped).map((b) => {
			let nodeProject: NodeProject = grouped[b][0];
			return (
				<div className="streamer">
					<div className="icon">
						{/* <img src="img/streamer-1.jpg" alt="" /> */}
						<span
							className="img"
							style={{
								height: 30,
								width: 30,
								backgroundColor: NodeTypeColors[nodeProject.properties.nodeType],
								borderRadius: '50%'
							}}
						/>
					</div>
					<p className="name" title={nodeProject.properties.nodeType}>
						{nodeProject.properties.nodeType}
					</p>
					<p className="number">{grouped[b].length}</p>
				</div>
			);
		});
		let game_stats = Object.keys(grouped).map((b) => {
			let nodeProject: NodeProject = grouped[b][0];
			return (
				<p className="game-stat">
					{grouped[b].length}
					<span>{nodeProject.properties.nodeType}</span>
				</p>
			);
		});
		return (
			<div className="game-container">
				<div className="game">
					<div className="rank">{projects.length}</div>
					<div className="front">
						<img className="thumbnail" src={`img/${fileName}`} alt="" />
						<h3 className="name icon" title={nodeProject.properties.text}>{nodeProject.properties.text}</h3>
						<div className="stats">
							<p className="viewers icon">{projects.length}</p>
							<div className="streamers">
								{temp}
							</div>
						</div>
					</div>

					<div className="back">
						<div className="streaming-info">{game_stats}</div>
						<button
							onClick={() => {
								if (this.props.onClick) this.props.onClick();
							}}
							className="btn"
						>
							Details
						</button>
						<div className="streamers" />
					</div>

					<div className="background" />
				</div>
			</div>
		);
	}
}
export function groupBy(xs: any[], key: Function) {
	return xs.reduce(function(rv, x) {
		(rv[key(x)] = rv[key(x)] || []).push(x);
		return rv;
	}, {});
}

export default Game;
