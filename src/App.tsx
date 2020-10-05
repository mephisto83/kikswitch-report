import React from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './Game';
import Details from './Details';
import Project from './project';
import { ImageProject } from './interfaces';
class App extends React.Component<{}, { stack: string[]; currentFile: string; details: boolean; filterValue: any }> {
	constructor(props: any) {
		super(props);
		this.state = {
			currentFile: '',
			details: false,
			stack: [],
			filterValue: null
		};
	}
	render() {
		let temp: any = Project;
		function getFirst(id: string) {
			return temp[id] ? temp[id][0] : null;
		}
		let games = Object.keys(temp)
			.filter(
				(v) =>
					!this.state.filterValue ||
					(temp[v] &&
						temp[v][0] &&
						`${temp[v][0].properties.text}`
							.toLocaleLowerCase()
							.indexOf(this.state.filterValue.toLocaleLowerCase()) !== -1)
			)
			.sort((a, b) => {
				let a_block = getFirst(a);
				let b_block = getFirst(b);
				if (a_block && b_block) {
					if (a_block.properties.isAgent && b_block.properties.isAgent) {
						return 0;
					} else if (a_block.properties.isAgent && !b_block.properties.isAgent) {
						return -1;
					} else {
						return 1;
					}
				}
				return a.localeCompare(b);
			})
			.map((fileName: string) => {
				return (
					<Game
						fileName={fileName}
						projects={temp[fileName]}
						project={temp}
						onClick={() => {
							this.setState({ currentFile: fileName, details: true });
						}}
					/>
				);
			});
		if (this.state.currentFile && this.state.details) {
			return (
				<div className="App">
					<Details
						onClick={() => {
							if (this.state.stack.length) {
								let temp = this.state.stack.map((d) => d);
								let item = temp.pop();
								if (item) {
									this.setState({ currentFile: item, stack: temp });
								}
							} else {
								this.setState({ details: false, filterValue: null });
							}
						}}
						onProjectItemSelect={(id: string) => {
							let currentItem = Object.keys(temp).find((key: string) => {
								return temp[key][0] && temp[key][0].id === id;
							});
							if (currentItem) {
								let stack = this.state.stack.map((v) => v);
								if (!stack.length || stack[stack.length - 1] !== currentItem) {
									stack.push(this.state.currentFile);
									this.setState({
										currentFile: currentItem,
										stack
									});
								}
							}
						}}
						fileName={this.state.currentFile}
						projects={temp[this.state.currentFile]}
						project={temp}
					/>
				</div>
			);
		}
		return (
			<div className="App">
				<p className="main-title">Skyview Report</p>
				<div>
					<p className="main-credit">Andrew Porter</p>
				</div>
				<div className="filter">
					<div className="form__group field">
						<input
							type="input"
							className="form__field"
							onChange={(evt: any) => {
								this.setState({ filterValue: evt.target.value });
							}}
							placeholder="Search"
							name="name"
							id="name"
							required
						/>
						<label className="form__label">Search</label>
					</div>
				</div>
				{games}
			</div>
		);
	}
}

export default App;
