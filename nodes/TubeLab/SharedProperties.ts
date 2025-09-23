import type { INodeProperties } from 'n8n-workflow';

export const sharedFields: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		description: 'The search terms to query (comma-separated for multiple queries)',
		default: '',
		placeholder: 'Minecraft, Fortnite, etc',
		displayOptions: {
			show: {
				operation: ['getChannels', 'getOutliers'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'query', // Use array notation
				value: '={{ $value.split(",").map(item => item.trim()) }}',
			},
		},
	},
];
