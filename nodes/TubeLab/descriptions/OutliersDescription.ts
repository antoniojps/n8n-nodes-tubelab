import type { INodeProperties } from 'n8n-workflow';
import languages from './languages.json';
import { fromField } from './SharedDescription';
import { validateAndCompileRelatedSearchCollection } from '../utils';

export const searchOutliersSortFields: INodeProperties[] = [
	{
		displayName: 'Sort By',
		name: 'sort',
		type: 'options',
		default: 'relevance',
		description:
			'Sort results by a specific metric. When using semantic search (applying a query with the by parameter set to semantic) the sorting option is only applied within the nearest videos found and not the entire dataset.',
		options: [
			{
				name: 'Outlier Score',
				value: 'averageViewsRatio',
				description: 'Sort by average views ratio',
			},
			{
				name: 'Published At',
				value: 'publishedAt',
				description: 'Sort by published at (this is only within the k-sample)',
			},
			{
				name: 'Relevance',
				value: 'relevance',
				description: 'Sort by relevance to search query (default for semantic searches)',
			},
			{
				name: 'Revenue',
				value: 'revenue',
				description: 'Sort by revenue estimation',
			},
			{
				name: 'RPM',
				value: 'rpm',
				description: 'Sort by RPM estimation',
			},
			{
				name: 'Views',
				value: 'views',
				description: 'Sort by views',
			},
			{
				name: 'Z-Score',
				value: 'zScore',
				description: 'Sort by zScore',
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
				operation: ['searchOutliers'],
			},
		},
	},
];

export const searchOutliersRelatedSearchFields: INodeProperties[] = [
	{
		displayName: 'Similar By',
		name: 'relatedSearch',
		type: 'collection',
		placeholder: 'Add search criteria',
		default: {},
		description:
			'Search for outliers based on related content. At least one search criterion must be provided.',
		typeOptions: {
			multipleValues: false,
			minRequiredFields: 1,
			maxAllowedFields: 1,
		},
		options: [
			{
				displayName: 'Videos',
				name: 'videoId',
				type: 'string',
				description: 'YouTube video IDs to search for related content (max 10)',
				default: [],
				placeholder: 'dQw4w9WgXcQ',
				typeOptions: {
					multipleValues: true,
					minValue: 1,
					maxValue: 10,
				},
			},
			{
				displayName: 'Thumbnail',
				name: 'thumbnailVideoId',
				type: 'string',
				description: 'Search by thumbnail similarity to this video ID',
				default: '',
				placeholder: 'dQw4w9WgXcQ',
			},
			{
				displayName: 'Channels',
				name: 'relatedChannelId',
				type: 'string',
				description: 'Search by related channel videos (max 2 channel IDs)',
				default: [],
				placeholder: 'UChn5jutPQB_bRjnG80pzl5w',
				typeOptions: {
					multipleValues: true,
					minValue: 1,
					maxValue: 2,
				},
			},
		],
		displayOptions: {
			show: {
				operation: ['searchOutliersRelated'],
			},
		},
		routing: {
			send: {
				preSend: [validateAndCompileRelatedSearchCollection],
			},
			request: {
				qs: {
					videoId: '={{ $parameter.relatedSearch?.videoId }}',
					thumbnailVideoId: '={{ $parameter.relatedSearch?.thumbnailVideoId }}',
					relatedChannelId: '={{ $parameter.relatedSearch?.relatedChannelId }}',
				},
			},
		},
	},
];

export const searchOutliersFields: INodeProperties[] = [
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
				displayName: 'Average Views Ratio',
				name: 'averageViewsRatio',
				type: 'fixedCollection',
				default: {
					options: {
						from: 1,
						to: undefined,
					},
				},
				description: 'Filter by average views ratio (outlier score) ranges',
				options: [
					{
						name: 'options',
						displayName: 'Average Views Ratio',
						values: [
							{
								displayName: 'From',
								name: 'from',
								type: 'number',
								default: undefined,
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
				displayName: 'Content Kind (Type)',
				name: 'type',
				type: 'options',
				description: 'Wether you want to search videos or shorts',
				default: 'video',
				options: [
					{
						name: 'Video',
						value: 'video',
					},
					{
						name: 'Short',
						value: 'short',
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
				displayName: 'Duration',
				name: 'duration',
				type: 'fixedCollection',
				default: {
					options: {
						from: 1,
						to: undefined,
					},
				},
				description: 'Filter by video duration (in minutes)',
				options: [
					{
						name: 'options',
						displayName: 'Duration',
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
				displayName: 'Exclude Keywords',
				name: 'excludeKeyword',
				type: 'string',
				description: 'Exclude videos from search results by keyword',
				default: [],
				typeOptions: {
					multipleValues: true,
					maxValue: 20,
				},
			},
			{
				displayName: 'Faceless (AI)',
				name: 'classificationIsFaceless',
				type: 'boolean',
				default: true,
				description: 'Whether the channel has faceless potential or not',
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
				displayName: 'Monetization (Adsense)',
				name: 'channelMonetizationAdsense',
				type: 'boolean',
				default: true,
				description: 'Whether the channel has AdSense enabled or not',
			},
			{
				displayName: 'Published At',
				name: 'publishedAtFrom',
				type: 'options',
				description: "Filter by a videos's upload date",
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
						name: 'Last Week',
						value: '1week',
					},
					{
						name: 'Last Year',
						value: '1year',
					},
				],
			},
			{
				displayName: 'Reference ID (Scan)',
				name: 'referenceId',
				type: 'string',
				default: '',
				description:
					'The reference ID to use for the search. This is used to filter the results by a specific scan.',
			},
			{
				displayName: 'Revenue Estimation',
				name: 'revenueEstimation',
				type: 'fixedCollection',
				default: {
					options: {
						from: 1,
						to: undefined,
					},
				},
				description: 'Filter by revenue estimations',
				options: [
					{
						name: 'options',
						displayName: 'Revenue Estimation',
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
									minValue: 10,
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
				displayName: 'Search By',
				name: 'by',
				type: 'options',
				description: 'Search by semantics (meaning of words) or lexical (exact words)',
				placeholder: '',
				default: 'semantic',
				options: [
					{
						name: 'Semantic',
						value: 'semantic',
						description: 'Meaning of words',
					},
					{
						name: 'Lexical',
						value: 'lexical',
						description: 'Exact word matches',
					},
				],
			},
			{
				displayName: 'Subscribers',
				name: 'subscribersCount',
				type: 'fixedCollection',
				default: {
					options: {
						from: 1,
						to: undefined,
					},
				},
				description: 'Filter by channel subscribers range',
				options: [
					{
						name: 'options',
						displayName: 'Subscribers',
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
									minValue: 200,
									numberPrecision: 0,
								},
							},
						],
					},
				],
			},

			{
				displayName: 'Views',
				name: 'viewCount',
				type: 'fixedCollection',
				default: {
					options: {
						from: 1000,
						to: undefined,
					},
				},
				description: 'Filter by view count ranges',
				options: [
					{
						name: 'options',
						displayName: 'Views',
						values: [
							{
								displayName: 'From',
								name: 'from',
								type: 'number',
								default: undefined,
								typeOptions: {
									minValue: 1000,
									numberPrecision: 0,
								},
							},
							{
								displayName: 'To',
								name: 'to',
								type: 'number',
								default: undefined,
								typeOptions: {
									minValue: 5000,
									numberPrecision: 0,
								},
							},
						],
					},
				],
			},
			{
				displayName: 'Z-Score (Mathematical Outlier Score)',
				name: 'zScore',
				type: 'fixedCollection',
				default: {
					options: {
						from: 1,
						to: undefined,
					},
				},
				description: 'Filter by z-score (mathematical outlier score) ranges',
				options: [
					{
						name: 'options',
						displayName: 'Z-Score',
						values: [
							{
								displayName: 'From',
								name: 'from',
								type: 'number',
								default: undefined,
								typeOptions: {
									minValue: 1,
									numberPrecision: 1,
								},
							},
							{
								displayName: 'To',
								name: 'to',
								type: 'number',
								default: undefined,
								typeOptions: {
									minValue: 2,
									numberPrecision: 1,
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
					averageViewsRatioFrom: '={{ $parameter.filters?.averageViewsRatio?.options?.from }}',
					averageViewsRatioTo: '={{ $parameter.filters?.averageViewsRatio?.options?.to }}',
					language: '={{ $parameter.filters?.language }}',
					publishedAtFrom:
						'={{ $parameter.filters?.publishedAtFrom === "3months" ? new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString() : $parameter.filters?.publishedAtFrom === "6months" ? new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString() : $parameter.filters?.publishedAtFrom === "1month" ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : $parameter.filters?.publishedAtFrom === "1year" ? new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString() : $parameter.filters?.publishedAtFrom === "1week" ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() : undefined }}',
					rpmEstimationFrom: '={{ $parameter.filters?.rpmEstimation?.options?.from }}',
					rpmEstimationTo: '={{ $parameter.filters?.rpmEstimation?.options?.to }}',
					revenueEstimationFrom: '={{ $parameter.filters?.revenueEstimation?.options?.from }}',
					revenueEstimationTo: '={{ $parameter.filters?.revenueEstimation?.options?.to }}',
					classificationQuality: '={{ $parameter.filters?.classificationQuality }}',
					excludeKeyword: '={{ $parameter.filters?.excludeKeyword }}',
					from: '={{ $parameter.filters?.from }}',
					viewCountFrom: '={{ $parameter.filters?.viewCount?.options?.from }}',
					viewCountTo: '={{ $parameter.filters?.viewCount?.options?.to }}',
					zScoreFrom: '={{ $parameter.filters?.zScore?.options?.from }}',
					zScoreTo: '={{ $parameter.filters?.zScore?.options?.to }}',
					type: '={{ $parameter.filters?.type }}',
					durationFrom:
						'={{ $parameter.filters?.duration?.options?.from ? $parameter.filters?.duration?.options?.from * 60 : undefined }}',
					durationTo:
						'={{ $parameter.filters?.duration?.options?.to ? $parameter.filters?.duration?.options?.to * 60 : undefined }}',
					subscribersCountFrom: '={{ $parameter.filters?.subscribersCount?.options?.from }}',
					subscribersCountTo: '={{ $parameter.filters?.subscribersCount?.options?.to }}',
					channelMonetizationAdsense: '={{ $parameter.filters?.channelMonetizationAdsense }}',
					referenceId: '={{ $parameter.filters?.referenceId }}',
					classificationIsFaceless: '={{ $parameter.filters?.classificationIsFaceless }}',
				},
			},
		},
		displayOptions: {
			show: {
				operation: ['searchOutliers', 'searchOutliersRelated'],
			},
		},
	},
];
