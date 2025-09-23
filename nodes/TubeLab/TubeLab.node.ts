import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { API_BASE_URL } from './consts';
import { sharedFields } from './SharedProperties';
import { getChannelsFields } from './ChannelsDescription';
import { paginate } from './utils';

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
							send: {
								paginate: true,
							},
							operations: {
								pagination: paginate,
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
							send: {
								paginate: true,
							},
							operations: {
								pagination: paginate,
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
			...sharedFields,
			...getChannelsFields,
		],
	};
}
