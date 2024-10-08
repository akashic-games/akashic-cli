export interface CreateEditorconfigParameterObject {
	indentSize: number;
	indentStyle: "space" | "tab";
	insertFinalNewline: boolean;
}

const preset = `
root = true

[*]
end_of_line = lf
charset = utf-8
indent_size = {indentSize}
indent_style = {indentStyle}
insert_final_newline = {insertFinalNewline}
`;

export function buildEditorconfig({ indentSize, indentStyle, insertFinalNewline }: CreateEditorconfigParameterObject): string {
	return preset
		.replace("{indentSize}", indentSize + "")
		.replace("{indentStyle}", indentStyle)
		.replace("{insertFinalNewline}", insertFinalNewline + "")
}
