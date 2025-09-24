import type { INodeProperties } from 'n8n-workflow';
import languages from './languages.json';
import { fromField } from './SharedProperties';
import { validateAndCompileRelatedSearchCollection } from './utils';

export const getOutliersSortFields: INodeProperties[] = [
	{
		displayName: 'Sort By',
		name: 'sort',
		type: 'options',
		default: 'relevance',
		description:
			'Sort results by a specific metric. When using semantic search (applying a query with the by parameter set to semantic) the sorting option is only applied within the nearest videos found and not the entire dataset.',
		options: [
			{
				name: 'Average Views Ratio',
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
				name: 'Revenue (Estimation)',
				value: 'revenue',
				description: 'Sort by revenue estimation',
			},
			{
				name: 'RPM (Estimation)',
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
				operation: ['getOutliers'],
			},
		},
	},
];

export const getOutliersRelatedSearchFields: INodeProperties[] = [
	{
		displayName: 'Related Search',
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
				displayName: 'Video IDs',
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
				displayName: 'Thumbnail Video ID',
				name: 'thumbnailVideoId',
				type: 'string',
				description: 'Search by thumbnail similarity to this video ID',
				default: '',
				placeholder: 'dQw4w9WgXcQ',
			},
			{
				displayName: 'Related Channel IDs',
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
				operation: ['getOutliersRelated'],
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

export const getOutliersFields: INodeProperties[] = [
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
				name: 'monetizationAdsense',
				type: 'boolean',
				default: true,
				description: 'Whether the channel has AdSense enabled or not',
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
		],
		routing: {
			request: {
				qs: {
					language: '={{ $parameter.filters?.language }}',
					publishedAtFrom:
						'={{ $parameter.filters?.publishedAtFrom === "3months" ? new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString() : $parameter.filters?.publishedAtFrom === "6months" ? new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString() : $parameter.filters?.publishedAtFrom === "1month" ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : $parameter.filters?.publishedAtFrom === "1year" ? new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined }}',
					rpmEstimationFrom: '={{ $parameter.filters?.rpmEstimation?.options?.from }}',
					rpmEstimationTo: '={{ $parameter.filters?.rpmEstimation?.options?.to }}',
					classificationQuality: '={{ $parameter.filters?.classificationQuality }}',
					excludeKeyword: '={{ $parameter.filters?.excludeKeyword }}',
					from: '={{ $parameter.filters?.from }}',
				},
			},
		},
		displayOptions: {
			show: {
				operation: ['getOutliers', 'getOutliersRelated'],
			},
		},
	},
];
