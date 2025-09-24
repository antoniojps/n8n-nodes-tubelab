import type { INodeProperties, PostReceiveAction } from 'n8n-workflow';

export const searchFields: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		description: 'The search terms to query (comma-separated for multiple queries)',
		default: [],
		placeholder: 'Add search terms',
		typeOptions: {
			multipleValues: true,
			maxValue: 10,
		},
		displayOptions: {
			show: {
				resource: ['channel', 'outlier'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'query',
			},
		},
	},
];

export const sizeFields: INodeProperties[] = [
	{
		displayName: 'Size',
		name: 'size',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 40,
		},
		default: 20,
		description:
			'Number of results to return. Must be between 1 and 40. Combine with `from` to paginate search results.',
		displayOptions: {
			show: {
				resource: ['channel', 'outlier'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'size',
			},
		},
	},
];

export const fromField: INodeProperties = {
	displayName: 'From',
	name: 'from',
	type: 'number',
	typeOptions: {
		minValue: 1,
		maxValue: 100,
	},
	default: 1,
	description:
		'The result page to fetch. The default is 1. Combine this parameter with `size` to paginate search results.',
};

export const postReceivePaginationFields: PostReceiveAction[] = [
	{
		type: 'rootProperty',
		properties: {
			property: 'hits',
		},
	},
];
