import type { INodeProperties } from 'n8n-workflow';
import languages from './languages.json';

export const getChannelsFields: INodeProperties[] = [
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
					options: {
						from: 1,
						to: undefined,
					},
				},
				description: 'Filter by avg. views ranges.',
				options: [
					{
						name: 'options',
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
				displayName: 'Average Views to Subscribers Ratio From',
				name: 'avgViewsToSubscribersRatioFrom',
				type: 'number',
				default: undefined,
				typeOptions: {
					minValue: 1,
					numberPrecision: 1,
				},
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
				displayName: 'Median Views',
				name: 'medianViews',
				type: 'fixedCollection',
				default: {
					options: {
						from: 1,
						to: undefined,
					},
				},
				description: 'Filter by median views ranges',
				options: [
					{
						name: 'options',
						displayName: 'Median Views',
						values: [
							{
								displayName: 'From',
								name: 'from',
								type: 'number',
								default: 1,
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
			{
				displayName: 'Subscribers',
				name: 'subscribers',
				type: 'fixedCollection',
				default: {
					options: {
						from: 1,
						to: undefined,
					},
				},
				description: 'Filter by subscribers ranges',
				options: [
					{
						name: 'options',
						displayName: 'Subscribers',
						values: [
							{
								displayName: 'From',
								name: 'from',
								type: 'number',
								default: 1,
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
				displayName: 'Videos Count',
				name: 'videosCount',
				type: 'fixedCollection',
				default: {
					options: {
						from: 1,
						to: undefined,
					},
				},
				description: 'Filter by total uploaded videos',
				options: [
					{
						name: 'options',
						displayName: 'Videos Count',
						values: [
							{
								displayName: 'From',
								name: 'from',
								type: 'number',
								default: 1,
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
									minValue: 2,
									numberPrecision: 0,
								},
							},
						],
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
					averageViewsFrom: '={{ $parameter.filters?.avgViews?.options?.from }}',
					averageViewsTo: '={{ $parameter.filters?.avgViews?.options?.to }}',
					medianViewsFrom: '={{ $parameter.filters?.medianViews?.options?.from }}',
					medianViewsTo: '={{ $parameter.filters?.medianViews?.options?.to }}',
					subscribersFrom: '={{ $parameter.filters?.subscribers?.options?.from }}',
					subscribersTo: '={{ $parameter.filters?.subscribers?.options?.to }}',
					videosCountFrom: '={{ $parameter.filters?.videosCount?.options?.from }}',
					videosCountTo: '={{ $parameter.filters?.videosCount?.options?.to }}',
					avgViewsToSubscribersRatioFrom:
						'={{ $parameter.filters?.avgViewsToSubscribersRatioFrom }}',
				},
			},
		},
		displayOptions: {
			show: {
				operation: ['getChannels'],
			},
		},
	},
];
