import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { API_BASE_URL } from './consts';
import { postReceivePaginationFields, searchFields, sizeFields } from './SharedProperties';
import {
	getChannelsFields,
	getChannelsRelatedSearchFields,
	getChannelsSortFields,
} from './ChannelsDescription';

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
						name: 'Channel',
						value: 'channel',
					},
					{
						name: 'Outlier',
						value: 'outlier',
					},
				],
				default: 'channel',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['outlier'],
					},
				},
				options: [
					{
						name: 'Search',
						value: 'getOutliers',
						action: 'Search for outliers',
						description:
							'Search for videos directly from the YouTube Outliers Finder library with AI enhanced data and 30+ filters. Updated in real-time, 24/7.',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/outliers',
							},
							output: {
								postReceive: postReceivePaginationFields,
							},
						},
					},
					{
						name: 'Similar Search',
						value: 'getOutliersRelated',
						action: 'Search for similar outliers',
						description: 'Search for YouTube outliers with related content to another outlier(s)',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/outliers/related',
							},
							output: {
								postReceive: postReceivePaginationFields,
							},
						},
					},
				],
				default: 'getOutliers',
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
						name: 'Search',
						value: 'getChannels',
						action: 'Search for channels',
						description:
							'Search for channels directly from the YouTube Niche Finder with AI enhanced data and 30+ filters. Updated in real-time, 24/7.',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/channels',
							},
							output: {
								postReceive: postReceivePaginationFields,
							},
						},
					},
					{
						name: 'Similar Search',
						value: 'getChannelsRelated',
						action: 'Search for similar channels',
						description: 'Search for YouTube channels with related content to another channel',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/channels/related',
							},
							output: {
								postReceive: postReceivePaginationFields,
							},
						},
					},
				],
				default: 'getChannels',
			},
			...searchFields,
			...getChannelsRelatedSearchFields,
			...sizeFields,
			...getChannelsFields,
			...getChannelsSortFields,
		],
	};
}
