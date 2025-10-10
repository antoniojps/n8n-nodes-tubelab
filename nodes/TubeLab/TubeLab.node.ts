import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { API_BASE_URL, validateAndCompileChannelId, validateAndCompileVideoId } from './utils';
import {
	postReceivePaginationFields,
	searchFields,
	sizeFields,
	searchChannelsFields,
	searchChannelsRelatedSearchFields,
	searchChannelsSortFields,
	searchOutliersFields,
	searchOutliersRelatedSearchFields,
	searchOutliersSortFields,
	getScanFields,
	postScanFields,
	postReceiveYouTubeFields,
	getChannelFields,
	postReceiveChannelFields,
} from './descriptions';
import { getVideoFields } from './descriptions/VideosDescription';

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
						name: 'Search',
						value: 'search',
					},
					{
						name: 'Channel',
						value: 'channel',
					},
					{
						name: 'Video',
						value: 'video',
					},
					{
						name: 'Scan',
						value: 'scan',
					},
				],
				default: 'search',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['search'],
					},
				},
				options: [
					{
						name: 'Search Channels',
						value: 'searchChannels',
						action: 'Search for channels',
						description:
							'Search for channels directly from the YouTube Niche Finder with AI enhanced data and 30+ filters. Updated in real-time, 24/7.',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/search/channels',
							},
							output: {
								postReceive: postReceivePaginationFields,
							},
						},
					},
					{
						name: 'Search Similar Channels',
						value: 'searchChannelsRelated',
						action: 'Search for similar channels',
						description: 'Search for YouTube channels with related content to another channel',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/search/channels/related',
							},
							output: {
								postReceive: postReceivePaginationFields,
							},
						},
					},
					{
						name: 'Search Outliers',
						value: 'searchOutliers',
						action: 'Search for outliers',
						description:
							'Search for videos directly from the TubeLab Outliers library with AI enhanced data and 30+ filters. Updated in real-time, 24/7.',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/search/outliers',
							},
							output: {
								postReceive: postReceivePaginationFields,
							},
						},
					},
					{
						name: 'Search Similar Outliers',
						value: 'searchOutliersRelated',
						action: 'Search for similar outliers',
						description: 'Search for YouTube outliers with related content to another outlier(s)',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/search/outliers/related',
							},
							output: {
								postReceive: postReceivePaginationFields,
							},
						},
					},
				],
				default: 'searchOutliers',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['scan'],
					},
				},
				options: [
					{
						name: 'Start a Scan',
						value: 'postScan',
						action: 'Start a scan',
						description:
							'Start a TubeLab scan to search for fresh outliers and channels on any given topic',
						routing: {
							request: {
								method: 'POST',
								url: '/v1/scan',
							},
						},
					},
					{
						name: 'Get Scan',
						value: 'getScan',
						action: 'Get a scan',
						description: 'Get the status of a scan and used inputs',
						routing: {
							request: {
								method: 'GET',
								url: '=/v1/scan/{{$parameter["id"]}}',
							},
						},
					},
				],
				default: 'postScan',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['video'],
					},
				},
				options: [
					{
						name: 'Details',
						value: 'getVideoDetails',
						action: 'Get details',
						description: 'Fetch the details of a video',
						routing: {
							request: {
								method: 'GET',
								url: '=/v1/video/{{$parameter["videoId"]}}',
							},
							send: {
								preSend: [validateAndCompileVideoId],
							},
							output: {
								postReceive: postReceiveYouTubeFields,
							},
						},
					},
					{
						name: 'Transcript',
						value: 'getVideoTranscript',
						action: 'Get transcript',
						description: 'Fetches the transcript of a video including timestamps',
						routing: {
							request: {
								method: 'GET',
								url: '=/v1/video/transcript/{{$parameter["videoId"]}}',
							},
							send: {
								preSend: [validateAndCompileVideoId],
							},
							output: {
								postReceive: postReceiveYouTubeFields,
							},
						},
					},
					{
						name: 'Comments',
						value: 'getVideoComments',
						action: 'Get comments',
						description: 'Fetch the first 100 comments of a video',
						routing: {
							request: {
								method: 'GET',
								url: '=/v1/video/comments/{{$parameter["videoId"]}}',
							},
							send: {
								preSend: [validateAndCompileVideoId],
							},
							output: {
								postReceive: postReceiveYouTubeFields,
							},
						},
					},
				],
				default: 'getVideoTranscript',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['channel'],
					},
				},
				options: [
					{
						name: 'Get Videos',
						value: 'getChannelVideos',
						action: 'Get videos',
						description: 'Fetch the videos of a channel and relevant metrics',
						routing: {
							request: {
								method: 'GET',
								url: '=/v1/channel/{{$parameter["channelId"]}}',
							},
							send: {
								preSend: [validateAndCompileChannelId],
							},
							output: {
								postReceive: postReceiveChannelFields,
							},
						},
					},
					{
						name: 'Get Shorts',
						value: 'getChannelShorts',
						action: 'Get shorts',
						description: 'Fetches the shorts of a channel and relevant metrics',
						routing: {
							request: {
								method: 'GET',
								url: '=/v1/channel/shorts/{{$parameter["channelId"]}}',
							},
							send: {
								preSend: [validateAndCompileChannelId],
							},
							output: {
								postReceive: postReceiveChannelFields,
							},
						},
					},
				],
				default: 'getChannelVideos',
			},
			...searchFields,
			...searchChannelsRelatedSearchFields,
			...searchOutliersRelatedSearchFields,
			...sizeFields,
			...searchChannelsFields,
			...searchChannelsSortFields,
			...searchOutliersFields,
			...searchOutliersSortFields,
			...getScanFields,
			...postScanFields,
			...getVideoFields,
			...getChannelFields,
		],
	};
}
