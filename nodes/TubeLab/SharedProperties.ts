import type { INodeProperties } from 'n8n-workflow';

export const sharedFields: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		description: 'The search terms to query (comma-separated for multiple queries)',
		default: [],
		placeholder: 'Search a niche, concept or keyword...',
		typeOptions: {
			multipleValues: true,
			maxValue: 10,
		},
		displayOptions: {
			show: {
				operation: ['getChannels', 'getOutliers'],
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
