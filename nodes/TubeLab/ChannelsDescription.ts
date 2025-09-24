import type { INodeProperties } from 'n8n-workflow';
import languages from './languages.json';
import { fromField } from './SharedProperties';
import { validateAndCompileRelatedChannelIds } from './utils';

export const getChannelsSortFields: INodeProperties[] = [
	{
		displayName: 'Sort By',
		name: 'sort',
		type: 'options',
		default: 'relevance',
		description:
			'Sort results by a specific metric. When using semantic search, sorting is only applied within the nearest videos found and not the entire dataset.',
		options: [
			{
				name: 'Average Views',
				value: 'averageViews',
				description: 'Sort by the average number of views across all videos',
			},
			{
				name: 'Average Views to Subscribers Ratio',
				value: 'avgViewsToSubscribersRatio',
				description: 'Sort by the ratio of average views to subscriber count (engagement metric)',
			},
			{
				name: 'Found At',
				value: 'foundAt',
				description: 'Sort by when the channel was discovered and added to the database',
			},
			{
				name: 'Recency',
				value: 'recency',
				description: 'Sort by when the channel started uploading content',
			},
			{
				name: 'Relevance',
				value: 'relevance',
				description: 'Sort by relevance to search query (default for semantic searches)',
			},
			{
				name: 'Revenue Monthly (Estimation)',
				value: 'revenueMonthly',
				description: 'Sort by estimated monthly revenue from AdSense',
			},
			{
				name: 'RPM (Estimation)',
				value: 'rpm',
				description: 'Sort by estimated Revenue Per Mille (revenue per 1000 views)',
			},
			{
				name: 'Subscribers',
				value: 'subscribers',
				description: 'Sort by total number of channel subscribers',
			},
			{
				name: 'View Variation Coefficient',
				value: 'viewVariationCoefficient',
				description: 'Sort by consistency of view counts (lower = more consistent performance)',
			},
		],
		routing: {
			request: {
				qs: {
					sortBy: '={{ $value == "relevance" ? undefined : $value }}',
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

export const getChannelsRelatedSearchFields: INodeProperties[] = [
	{
		displayName: 'Related Channel IDs',
		name: 'relatedChannelId',
		type: 'string',
		description: 'The IDs of the channels to search for related channels',
		default: [],
		placeholder: 'UChn5jutPQB_bRjnG80pzl5w',
		typeOptions: {
			multipleValues: true,
			minValue: 1,
			maxValue: 10,
		},
		required: true,
		displayOptions: {
			show: {
				operation: ['getChannelsRelated'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'relatedChannelId',
				preSend: [validateAndCompileRelatedChannelIds],
			},
		},
	},
];

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
				displayName: 'Average Video Duration',
				name: 'avgDuration',
				type: 'fixedCollection',
				default: {
					options: {
						from: 1,
						to: undefined,
					},
				},
				description: 'Filter avg. video duration (in minutes).',
				options: [
					{
						name: 'options',
						displayName: 'Average Video Duration',
						values: [
							{
								displayName: 'From (Minutes)',
								name: 'from',
								type: 'number',
								default: undefined,
								typeOptions: {
									minValue: 1,
									numberPrecision: 0,
								},
							},
							{
								displayName: 'To (Minutes)',
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
				displayName: 'Content Quality (AI Classification)',
				name: 'classificationQuality',
				type: 'options',
				description: 'Content quality classification. Useful to filter out low quality channels.',
				placeholder: '',
				default: 'neutral',
				options: [
					{
						name: 'High Quality',
						value: 'positive',
						description:
							'Original channels with good packaging or uploading content with more effort',
					},
					{
						name: 'General',
						value: 'neutral',
						description: 'Generic content, neither good or bad',
					},
					{
						name: 'Low Quality',
						value: 'negative',
						description: 'AI Slop, kids content, bushcraft, compilations, etc',
					},
				],
			},
			{
				displayName: 'Exclude Niches',
				name: 'excludeNiche',
				type: 'string',
				description: 'Exclude niches from search results by category',
				default: [],
				typeOptions: {
					multipleValues: true,
					maxValue: 20,
				},
			},
			{
				displayName: 'Faceless (AI Classification)',
				name: 'classificationIsFaceless',
				type: 'boolean',
				default: true,
				description: 'Whether channel content has faceless potential or not',
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
			fromField,
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
				displayName: 'Monetization (Adsense)',
				name: 'monetizationAdsense',
				type: 'boolean',
				default: true,
				description: 'Whether the channel has AdSense enabled or not',
			},
			{
				displayName: 'Revenue Monthly Estimation',
				name: 'revenueMonthlyEstimation',
				type: 'fixedCollection',
				default: {
					options: {
						from: 1,
						to: undefined,
					},
				},
				description: 'Filter by monthly revenue estimations',
				options: [
					{
						name: 'options',
						displayName: 'Revenue Monthly Estimation',
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
									minValue: 100,
									numberPrecision: 0,
								},
							},
						],
					},
				],
			},
			{
				displayName: 'RPM Estimation',
				name: 'rpmEstimation',
				type: 'fixedCollection',
				default: {
					options: {
						from: 1,
						to: undefined,
					},
				},
				description: 'Filter by RPM estimations',
				options: [
					{
						name: 'options',
						displayName: 'RPM Estimation',
						values: [
							{
								displayName: 'From',
								name: 'from',
								type: 'number',
								default: 1,
								typeOptions: {
									minValue: 0,
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
					revenueMonthlyEstimationFrom:
						'={{ $parameter.filters?.revenueMonthlyEstimation?.options?.from }}',
					revenueMonthlyEstimationTo:
						'={{ $parameter.filters?.revenueMonthlyEstimation?.options?.to }}',
					rpmEstimationFrom: '={{ $parameter.filters?.rpmEstimation?.options?.from }}',
					rpmEstimationTo: '={{ $parameter.filters?.rpmEstimation?.options?.to }}',
					avgDurationFrom:
						'={{ $parameter.filters?.avgDuration?.options?.from ? $parameter.filters?.avgDuration?.options?.from * 60 : undefined }}',
					avgDurationTo:
						'={{ $parameter.filters?.avgDuration?.options?.to ? $parameter.filters?.avgDuration?.options?.to * 60 : undefined }}',
					monetizationAdsense: '={{ $parameter.filters?.monetizationAdsense }}',
					classificationQuality: '={{ $parameter.filters?.classificationQuality }}',
					classificationIsFaceless: '={{ $parameter.filters?.classificationIsFaceless }}',
					excludeNiche: '={{ $parameter.filters?.excludeNiche }}',
					from: '={{ $parameter.filters?.from }}',
				},
			},
		},
		displayOptions: {
			show: {
				operation: ['getChannels', 'getChannelsRelated'],
			},
		},
	},
];
