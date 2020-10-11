// @flow
import React, { Component } from 'react';
import { GetNodeProp, groupBy, NodeProperties } from './util';
import DashboardContainer from './dashboardcontainer';
import GraphView, { callAutoDistribute } from './graphview';
import Projects from './project';
import TreeViewMenu from './treeviewmenu';
import TreeViewItemContainer from './treeviewitemcontainer';
import TextInput from './textinput';
const relativePath = './img';
export default class GraphViewer extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        let project: any = Projects[0].url;
        if (project) {
            fetch(`${relativePath}/${project}`).then((res) => {
                res.json().then((obj) => {
                    this.setState({ graphViewPackage: obj, name: Projects[0].name })
                })
            })
        }
    }


    render() {
        let graphViewPackage = this.state.graphViewPackage || null;

        return (
            <DashboardContainer flex minified sideBar={this.getSideBar()} >
                <GraphView title={this.state.name} graphViewPackage={graphViewPackage} />
            </DashboardContainer>
        );
    }
    getSideBar() {
        let result = [];
        let items: any[] = Projects.filter((project: { name: string }) => !this.state.filter || project.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) !== -1);
        let groups = groupBy(items, (v: { nodeType: string }) => v.nodeType);
        result.push(<TreeViewMenu active open  title="Menu">
            <TreeViewItemContainer>
                <TextInput value={this.state.filter} immediate label={'filter'} onChange={(val: string) => {
                    this.setState({ filter: val })
                }} />
            </TreeViewItemContainer>
            {Object.entries(groups).map((item: any[]) => {
                let [key, value] = item;
                return (<TreeViewMenu active open={this.state[key]} title={key} onClick={() => {
                    this.setState({ [key]: !this.state[key] })
                }}>
                    {value.map((project: { url: string, name: string }) => {
                        return <TreeViewMenu key={project.name} title={project.name} onClick={() => {
                            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + project.name;
                            window.history.pushState({ path: newurl }, '', newurl);
                            fetch(`${relativePath}/${project.url}`).then((res) => {
                                res.json().then((obj) => {
                                    this.setState({ graphViewPackage: obj, name: project.name }, () => {
                                        callAutoDistribute();
                                    })
                                })
                            })
                        }} />
                    })}
                </TreeViewMenu>)
            })
            }
        </TreeViewMenu>)
        return result;
    }
}

