export interface CopyListItem {
	src: string;
	dst?: string;
}

export interface TemplateConfig {
	files?: CopyListItem[];
	gameJson?: string;
	guideMessage?: string;
}
