import React from 'react';
import './App.css';
import Project from './project';
import GraphViewer from './graphviewer';
class App extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
		};
	}
	render() {
		return (
			<GraphViewer />
		);
	}
}

export default App;
