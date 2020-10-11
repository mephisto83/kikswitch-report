// @flow
import React, { Component } from 'react';
import createEngine, { DefaultPortModel, PathFindingLinkFactory, DagreEngine, DefaultNodeModel, DiagramEngine } from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import DemoCanvasWidget from './canvaswidget';
import * as SRD from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import { GetNodeProp, GetNodeTitle, LinkPropertyKeys, NodeProperties } from './util';
import { GetLinkProperty, Node } from './util';
import { NodeTypeColors } from './nodestuff';
import Details from './Details';

export const SBody = styled.div`
flex-grow: 1;
display: flex;
flex-direction: column;
min-height: 100%;
`;

export const SHeader = styled.div`
display: flex;
background: rgb(30, 30, 30);
flex-grow: 0;
flex-shrink: 0;
color: white;
font-family: Helvetica, Arial, sans-serif;
padding: 10px;
align-items: center;
`;

export const SContent = styled.div`
display: flex;
flex-grow: 1;
`;

export const SLayer = styled.div`
position: relative;
flex-grow: 1;
`;

export const SFLayer = styled.div`
position: relative;
flex: 1;
max-width: 600px;
`;


export function GUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;

        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
const context: any = {};
export function callAutoDistribute() {
    context.autoDistribute();
}
export default class GraphView extends Component<any, any> {
    engine: DagreEngine;
    constructor(props: any) {
        super(props);
        let id = GUID();
        this.engine = new DagreEngine({
            graph: {
                rankdir: 'RL',
                ranker: 'longest-path',
                marginx: 25,
                marginy: 25,
                nodesep: 10
            },
            includeLinks: true
        });
        context.autoDistribute = this.autoDistribute.bind(this);
        let setup = this.newModel();
        this.state = { ...setup, id };
    }


    public newModel(): {
        activeModel: SRD.DiagramModel,
        engine: DiagramEngine
    } {
        let activeModel = new SRD.DiagramModel();
        let engine = createEngine();
        // register some other factories as well 

        let diagramEngine = engine;
        diagramEngine.setModel(activeModel);



        return {
            activeModel,
            engine
        }
    }
    autoDistribute = () => {
        this.engine.redistribute(this.state.activeModel);

        // only happens if pathfing is enabled (check line 25)
        this.reroute();
        this.state.engine.repaintCanvas();
    };


    reroute() {
        (this.state.engine as DiagramEngine)
            .getLinkFactories()
            .getFactory<PathFindingLinkFactory>(PathFindingLinkFactory.NAME)
            .calculateRoutingMatrix();
    }


    componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
        if (this.props.graphViewPackage !== prevProps.graphViewPackage) {
            let { graphViewPackage } = this.props;
            if (graphViewPackage) {
                this.setupGraphView(graphViewPackage);
                setTimeout(() => {
                    this.autoDistribute();
                }, 500);
            }
        }
    }
    private setupGraphView(graphViewPackage: any) {
        let { activeModel } = this.state;
        let { links, nodes } = graphViewPackage;
        let me = this;
        if (nodes) {
            let dnodes: any = {};
            nodes.forEach((node: any) => {
                let dnode: any = this.createNode(GetNodeTitle(node), node);
                dnodes[node.id] = dnode;
            });
            activeModel.getNodes().forEach((node: any) => {
                activeModel.removeNode(node);
            });
            activeModel.getLinks().forEach((link: any) => {
                activeModel.removeLink(link);
            })

            nodes.forEach((node: any, index: number) => {
                dnodes[node.id].setPosition(index * 70, index * 70);
                let item = activeModel.addNode(dnodes[node.id]);
                item.registerListener({
                    eventDidFire: function (a: { function: string }) {
                        if (a.function === 'selectionChanged') {
                            me.setState({ currentNode: node.id })
                        }
                    }
                });
            });


            if (links) {
                links.forEach((link: any) => {
                    let newLink = this.connectNodes(dnodes[link.source], dnodes[link.target], link);
                    if (newLink)
                        activeModel.addLink(newLink);
                });
            }
        }
    }
    connectNodes(nodeFrom: any, nodeTo: any, link: any) {
        if (!nodeFrom || !nodeTo) { return false; }
        //just to get id-like structure
        const portOut = nodeFrom.addPort(new DefaultPortModel(true, `${nodeFrom.name}-out-${GUID()}`, GetLinkProperty(link, LinkPropertyKeys.TYPE) || 'Out'));
        const portTo = nodeTo.addPort(new DefaultPortModel(false, `${nodeTo.name}-to-${GUID()}`, GetLinkProperty(link, LinkPropertyKeys.TYPE) || 'IN'));
        return portOut.link(portTo);

        // ################# UNCOMMENT THIS LINE FOR PATH FINDING #############################
        // return portOut.link(portTo, engine.getLinkFactories().getFactory(PathFindingLinkFactory.NAME));
        // #####################################################################################
    }

    createNode(name: string, node: any): any {
        return new DefaultNodeModel(name, NodeTypeColors[GetNodeProp(node, NodeProperties.NODEType)] || 'rgb(0,192,255)');
    }
    componentDidMount() {
        setTimeout(() => {
            this.autoDistribute();
        }, 500);
    }
    render() {

        let { engine } = this.state;
        if (!engine) {
            return <div></div>
        }
        let details: any = null;
        if (this.props.graphViewPackage) {
            if (this.state.currentNode) {
                let { nodes }: { nodes: Node[] } = this.props.graphViewPackage;
                let currentNode: Node | undefined = nodes.find((node: Node) => node.id === this.state.currentNode);
                if (currentNode) {
                    details = <Details currentPart={{ properties: currentNode.properties }} />
                }
            }
        }
        return (
            <SBody>
                <SHeader>
                    <div className="title" onClick={() => {
                        this.autoDistribute();
                    }}>{this.props.title || ''}</div>
                </SHeader>
                <SContent>
                    <SLayer
                        onDrop={() => {
                        }}
                        onDragOver={(event: any) => {
                            event.preventDefault();
                        }}>
                        <DemoCanvasWidget>
                            <CanvasWidget engine={engine} />
                        </DemoCanvasWidget>
                    </SLayer>
                    <SFLayer>
                        {details}
                    </SFLayer>
                </SContent>
            </SBody>
        );
    }
}
