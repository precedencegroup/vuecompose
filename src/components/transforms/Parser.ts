import { parse } from '@vue/compiler-sfc';
import type { TemplateChildNode, DirectiveNode, AttributeNode, TextNode, SimpleExpressionNode, CompoundExpressionNode } from '@vue/compiler-core';

interface IDictionary<TValue> {
    [id: string]: TValue;
}

const isSimpleExpressionNode = (prop: any): prop is SimpleExpressionNode => {
	return (prop as SimpleExpressionNode).type === 4;
}

const isCompoundExpressionNode = (prop: any): prop is CompoundExpressionNode => {
	return (prop as CompoundExpressionNode).type === 8;
}

const isAttributeNode = (prop: any): prop is AttributeNode => {
	return (prop as AttributeNode).type === 6;
}

const isDirectiveNode = (prop: any): prop is DirectiveNode => {
	return (prop as DirectiveNode).type === 7;
}

const isTextNode = (prop: any): prop is TextNode => {
	return (prop as TextNode).type === 2;
}

export default class {
	model: String = '';
	schema : any[string] = [];

	constructor(model : String, schema : any[string]) {
		this.model = model;
		this.schema = schema;
	}

	parse() : any[]|null {
		let parsedValue : TemplateChildNode[] | undefined = undefined;
		try {
			parsedValue = parse(`<template>${this.model}</template>`)?.descriptor?.template?.ast?.children;
		} catch (e) {
			return null;
		}
		return parsedValue?.map(this.parseNode.bind(this, [])) ?? null;
	}

	parseNode(ancestorIndexes : number[], node : TemplateChildNode, index : number) : any[] | String {
		if (node.type === 1) {
			const attributes : any = node.props.reduce(function(output : IDictionary<any>, prop : AttributeNode | DirectiveNode) {
				let propName : string = prop.name;
				let propValue : any = null;
				if (isAttributeNode(prop)) {
					propName = prop.name;
					propValue = prop.value?.content ?? null;
				} else if (isDirectiveNode(prop)) {
					if(prop.arg === undefined) {
						propName = `v-${prop.name}`;
					} else if(isSimpleExpressionNode(prop.arg)) {
						propName = `v-${prop.name}:${prop.arg?.content}`;
					} else {
						throw "directive name compound expressions not implemented";
					}

					if(prop.exp === undefined) {
						propValue = null;
					} else if (isSimpleExpressionNode(prop.exp)) {
						propValue = prop.exp.content;
					} else {
						throw "directive value compound expressions not implemented";
					}
				}

				output[propName] = propValue;

				return output;
			}, {});

			const position = ancestorIndexes.concat([ index ]);

			const schema = {
				tag: node.tag,
				position: position,
				flow: this.schema[node.tag]?.flow ?? 'inline',
			};

			return [ schema, attributes, node.children.map(this.parseNode.bind(this, position)) ];
		}

		if(isTextNode(node)) {
			return node.content;
		}

		return "";
	}
}
