export interface Bounds {
	x: number;
	X: number;
	y: number;
	Y: number;
}

export interface NodeProperties {
	text: string;
	nodeType: string;
	Pinned: boolean;
	codeName: string;
	agentName: string;
	valueName: string;
	cssName: string;
	HttpRoute: string;
	uiName: string;
	Label: string;
	isAgent: boolean;
	uiUser: string;
	hasLogicalNieces: boolean;
	hasLogicalChildren: boolean;
	logicalChildrenTypes: any[];
	ExecutionSummary: any;
	PermissionSummary: any;
	ValidationSummary: any;
}

export interface NodeProject {
	properties: NodeProperties;
}

export interface ImageProject {
	[image: string]: NodeProject[];
}
