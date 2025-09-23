import type { INodeProperties } from 'n8n-workflow';

export const sharedFields: INodeProperties[] = [
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
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		// overriden as api default is 20 and max is 40 per page
		// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
		default: 20,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				operation: ['getChannels', 'getOutliers'],
			},
		},
	},
];
