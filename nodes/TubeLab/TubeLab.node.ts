import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class TubeLab implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TubeLab',
		name: 'tubeLab',
		icon: 'file:tubelab.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get trending YouTube channels and outlier videos data for any niche.',
		defaults: {
			name: 'TubeLab',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tubeLabApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://public-api.tubelab.net',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'TubeLab',
						value: 'tubelab',
					},
				],
				default: 'tubelab',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['tubelab'],
					},
				},
				options: [
					{
						name: 'Channels',
						value: 'getChannels',
						action: 'Search channels',
						description:
							'Search for channels directly from the YouTube Niche Finder with AI enhanced data and 30+ filters. Updated in real-time, 24/7.',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/channels',
							},
						},
					},
					{
						name: 'Similar Channels',
						value: 'getChannelsRelated',
						action: 'Search similar channels',
						description: 'Search for YouTube channels with related content to another channel',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/channels/related',
							},
						},
					},
					{
						name: 'Outliers',
						value: 'getOutliers',
						action: 'Search outliers',
						description:
							'Search for videos directly from the YouTube Outliers Finder library with AI enhanced data and 30+ filters. Updated in real-time, 24/7.',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/outliers',
							},
						},
					},
					{
						name: 'Similar Outliers',
						value: 'getOutliersRelated',
						action: 'Search similar outliers',
						description: 'Search for YouTube outliers with related content to another outlier(s)',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/outliers/related',
							},
						},
					},
				],
				default: 'getChannels',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				description: 'The search terms to query (comma-separated for multiple queries)',
				default: '',
				placeholder: 'Minecraft, Fortnite, etc',
				displayOptions: {
					show: {
						operation: ['getChannels', 'getChannelsRelated', 'getOutliers', 'getOutliersRelated'],
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
			// {
			// 	displayName: 'Content Kind',
			// 	name: 'contentKind',
			// 	type: 'multiOptions',
			// 	description: 'The content kind to filter by',
			// 	default: [],
			// 	options: [
			// 		{
			// 			name: 'More Videos Than Shorts',
			// 			value: 'long-form',
			// 		},
			// 		{
			// 			name: 'More Shorts Than Videos',
			// 			value: 'short-form',
			// 		},
			// 	],
			// 	displayOptions: {
			// 		show: {
			// 			operation: ['getChannels', 'getChannelsRelated'],
			// 		},
			// 	},
			// 	routing: {
			// 		request: {
			// 			qs: {
			// 				contentKind: '={{ $value }}',
			// 			},
			// 		},
			// 	},
			// },

			{
				displayName: 'Started At',
				name: 'publishedAtFrom',
				type: 'options',
				description:
					"Filter by a channel's last parsed video upload date (from a sample of 100 videos)",
				default: '',
				options: [
					{
						name: 'All Time',
						value: '',
					},
					{
						name: 'Last 3 Months',
						value: '={{new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString()}}',
					},
					{
						name: 'Last 6 Months',
						value: '={{new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString()}}',
					},
					{
						name: 'Last Month',
						value: '={{new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}}',
					},

					{
						name: 'Last Year',
						value: '={{new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString()}}',
					},
				],
				displayOptions: {
					show: {
						operation: ['getChannels', 'getChannelsRelated'],
					},
				},
				routing: {
					request: {
						qs: {
							publishedAtFrom: '={{ $value }}',
						},
					},
				},
			},
		],
	};
}
