import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import languages from './languages.json';
import { API_BASE_URL } from './consts';

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
			baseURL: API_BASE_URL,
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
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add filters',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				options: [
					{
						displayName: 'Average Views',
						name: 'avgViews',
						type: 'fixedCollection',
						default: {
							averageViews: {
								from: 1,
								to: undefined,
							},
						},
						description: 'Filter by avg. views ranges.',
						options: [
							{
								name: 'averageViews',
								displayName: 'Average Views',
								values: [
									{
										displayName: 'From',
										name: 'from',
										type: 'number',
										default: undefined,
										typeOptions: {
											minValue: 1,
											numberPrecision: 0,
										},
									},
									{
										displayName: 'To',
										name: 'to',
										type: 'number',
										default: undefined,
										typeOptions: {
											minValue: 1000,
											numberPrecision: 0,
										},
									},
								],
							},
						],
					},
					{
						displayName: 'Content Kind',
						name: 'contentKind',
						type: 'options',
						description: 'The content kind to filter by',
						placeholder: 'Type of channel content...',
						default: 'video',
						options: [
							{
								name: 'Has Videos',
								value: 'video',
							},
							{
								name: 'Has Shorts',
								value: 'short',
							},
							{
								name: 'More Videos Than Shorts',
								value: 'long-form',
							},
							{
								name: 'More Shorts Than Videos',
								value: 'short-form',
							},
						],
					},
					{
						displayName: 'Filter By',
						name: 'filterBy',
						type: 'options',
						description: 'Filter by statistics of a specific content kind',
						default: 'video',
						options: [
							{
								name: 'Videos',
								value: 'video',
							},
							{
								name: 'Shorts',
								value: 'short',
							},
						],
					},
					{
						displayName: 'Language',
						name: 'language',
						type: 'options',
						description: "Filter by a channel's detected language",
						default: '',
						options: [
							{
								name: 'All Languages',
								value: '',
							},
							...languages.map((language: { name: string; code: string }) => ({
								displayName: language.name,
								name: language.name,
								value: language.code,
							})),
						],
					},
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
								value: '3months', // Simple identifier
							},
							{
								name: 'Last 6 Months',
								value: '6months',
							},
							{
								name: 'Last Month',
								value: '1month',
							},

							{
								name: 'Last Year',
								value: '1year',
							},
						],
					},
				],
				routing: {
					request: {
						qs: {
							contentKind: '={{ $parameter.filters?.contentKind }}',
							language: '={{ $parameter.filters?.language }}',
							publishedAtFrom:
								'={{ $parameter.filters?.publishedAtFrom === "3months" ? new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString() : $parameter.filters?.publishedAtFrom === "6months" ? new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString() : $parameter.filters?.publishedAtFrom === "1month" ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : $parameter.filters?.publishedAtFrom === "1year" ? new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined }}',
							filterBy: '={{ $parameter.filters?.filterBy }}',
							averageViewsFrom: '={{ $parameter.filters?.avgViews?.averageViews?.from }}',
							averageViewsTo: '={{ $parameter.filters?.avgViews?.averageViews?.to }}',
						},
					},
				},
				displayOptions: {
					show: {
						operation: ['getChannels', 'getChannelsRelated'],
					},
				},
			},
		],
	};
}
