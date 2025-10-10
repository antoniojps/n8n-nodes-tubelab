import type { INodeProperties } from 'n8n-workflow';

export const getVideoFields: INodeProperties[] = [
	{
		displayName: 'Video ID',
		name: 'videoId',
		type: 'string',
		placeholder: 'YouTube Video ID',
		default: '',
		description:
			'The YouTube Video ID to fetch. Found at the end of the URL `https://youtube.com/watch?v=VIDEO_ID`.',
		displayOptions: {
			show: {
				operation: ['getVideoTranscript', 'getVideoComments', 'getVideoDetails'],
			},
		},
	},
];
