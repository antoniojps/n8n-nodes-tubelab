import type { INodeProperties } from 'n8n-workflow';
import { validateAndCompileScanChannelIds } from '../utils';

export const getScanFields: INodeProperties[] = [
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		placeholder: 'Add scan ID',
		default: '',
		description: 'The ID of the scan to get information about',
		displayOptions: {
			show: {
				operation: ['getScan'],
			},
		},
	},
];

export const postScanFields: INodeProperties[] = [
	{
		displayName: 'Find By',
		name: 'findBy',
		type: 'options',
		description: 'Start the scan from queries (search results) or channels',
		default: 'query',
		options: [
			{
				name: 'Query',
				value: 'query',
			},
			{
				name: 'Channels',
				value: 'channels',
			},
		],
		displayOptions: {
			show: {
				operation: ['postScan'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'findBy',
			},
		},
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		description: 'Search queries',
		default: [],
		placeholder: 'Add search terms',
		typeOptions: {
			multipleValues: true,
			maxValue: 10,
		},
		displayOptions: {
			show: {
				operation: ['postScan'],
				findBy: ['query'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'query',
			},
		},
	},
	{
		displayName: 'Channel IDs',
		name: 'channelIds',
		type: 'string',
		description: 'YouTube channel IDs (must be valid 24-character YouTube channel IDs)',
		default: [],
		placeholder: 'UCxxxxxxxxxxxxxxxxxxxxxx',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				operation: ['postScan'],
				findBy: ['channels'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'query',
				preSend: [validateAndCompileScanChannelIds],
			},
		},
	},
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		description:
			'Determines how many outliers and channels to search for (check documentation for more details)',
		default: 'fast',
		options: [
			{
				name: 'Fast',
				value: 'fast',
			},
			{
				name: 'Standard',
				value: 'standard',
			},
			{
				name: 'Test',
				value: 'test',
			},
		],
		displayOptions: {
			show: {
				operation: ['postScan'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'mode',
			},
		},
	},
];
