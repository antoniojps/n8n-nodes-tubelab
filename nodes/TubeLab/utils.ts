import {
	IDataObject,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
	NodeOperationError,
} from 'n8n-workflow';

export const API_BASE_URL = 'https://public-api.tubelab.net';
export const YOUTUBE_CHANNEL_ID = /^[A-Za-z0-9_-]{24}$/;
export const YOUTUBE_VIDEO_ID = /^[a-zA-Z0-9-_]{11}$/;

function validateChannelIds(channelIds: string[]): { valid: string[]; invalid: string[] } {
	return {
		valid: channelIds.filter((id) => YOUTUBE_CHANNEL_ID.test(id)),
		invalid: channelIds.filter((id) => !YOUTUBE_CHANNEL_ID.test(id)),
	};
}

function validateVideoIds(videoIds: string[]): { valid: string[]; invalid: string[] } {
	return {
		valid: videoIds.filter((id) => YOUTUBE_VIDEO_ID.test(id)),
		invalid: videoIds.filter((id) => !YOUTUBE_VIDEO_ID.test(id)),
	};
}

function validateVideoId(videoId: string): boolean {
	return YOUTUBE_VIDEO_ID.test(videoId);
}

export async function validateAndCompileRelatedChannelIds(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const channelIds = this.getNodeParameter('relatedChannelId') as string[];
	const { invalid } = validateChannelIds(channelIds);

	if (invalid.length > 0) {
		throw new NodeOperationError(
			this.getNode(),
			'Invalid channel IDs found. Please adjust the "Related Channel IDs" parameter and try again. Invalid channel IDs: ' +
				invalid.join(', '),
		);
	}

	return requestOptions;
}

export async function validateAndCompileVideoIds(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const videoIds = this.getNodeParameter('videoId') as string[];
	const { invalid } = validateVideoIds(videoIds);

	if (invalid.length > 0) {
		throw new NodeOperationError(
			this.getNode(),
			'Invalid video IDs found. Please adjust the "Video IDs" parameter and try again. Invalid video IDs: ' +
				invalid.join(', '),
		);
	}

	return requestOptions;
}

export async function validateAndCompileThumbnailVideoId(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const videoId = this.getNodeParameter('thumbnailVideoId') as string;

	if (videoId && !validateVideoId(videoId)) {
		throw new NodeOperationError(
			this.getNode(),
			`Invalid thumbnail video ID: ${videoId}. Please provide a valid YouTube video ID.`,
		);
	}

	return requestOptions;
}

export async function validateAndCompileRelatedSearchCollection(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const relatedSearch = this.getNodeParameter('relatedSearch') as {
		videoId?: string[];
		thumbnailVideoId?: string;
		relatedChannelId?: string[];
	};

	// Check if at least one field is provided
	const hasVideoIds = relatedSearch.videoId && relatedSearch.videoId.length > 0;
	const hasThumbnailVideoId =
		relatedSearch.thumbnailVideoId && relatedSearch.thumbnailVideoId.trim() !== '';
	const hasRelatedChannelIds =
		relatedSearch.relatedChannelId && relatedSearch.relatedChannelId.length > 0;

	if (!hasVideoIds && !hasThumbnailVideoId && !hasRelatedChannelIds) {
		throw new NodeOperationError(
			this.getNode(),
			'At least one search criterion must be provided in Related Search: Video IDs, Thumbnail Video ID, or Related Channel IDs.',
		);
	}

	// Validate video IDs if provided
	if (hasVideoIds) {
		const { invalid: invalidVideoIds } = validateVideoIds(relatedSearch.videoId!);
		if (invalidVideoIds.length > 0) {
			throw new NodeOperationError(
				this.getNode(),
				'Invalid video IDs found in Related Search. Please adjust the "Video IDs" parameter and try again. Invalid video IDs: ' +
					invalidVideoIds.join(', '),
			);
		}
	}

	// Validate thumbnail video ID if provided
	if (hasThumbnailVideoId && !validateVideoId(relatedSearch.thumbnailVideoId!)) {
		throw new NodeOperationError(
			this.getNode(),
			`Invalid thumbnail video ID in Related Search: ${relatedSearch.thumbnailVideoId}. Please provide a valid YouTube video ID.`,
		);
	}

	// Validate channel IDs if provided
	if (hasRelatedChannelIds) {
		const { invalid: invalidChannelIds } = validateChannelIds(relatedSearch.relatedChannelId!);
		if (invalidChannelIds.length > 0) {
			throw new NodeOperationError(
				this.getNode(),
				'Invalid channel IDs found in Related Search. Please adjust the "Related Channel IDs" parameter and try again. Invalid channel IDs: ' +
					invalidChannelIds.join(', '),
			);
		}
	}

	return requestOptions;
}

export async function validateAndCompileScanChannelIds(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const channelIds = this.getNodeParameter('channelIds') as string[];
	const { invalid } = validateChannelIds(channelIds);

	if (invalid.length > 0) {
		throw new NodeOperationError(
			this.getNode(),
			'Invalid channel IDs found. Please provide valid YouTube channel IDs (24 characters). Invalid channel IDs: ' +
				invalid.join(', '),
		);
	}

	return requestOptions;
}

/**
 * Make an API request to TubeLab
 *
 */
export async function tubeLabApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject,
	query?: IDataObject,
) {
	const options = {
		method,
		body,
		qs: query,
		url: `${API_BASE_URL}/v1/${endpoint}`,
		json: true,
	} satisfies IHttpRequestOptions;

	if (options.qs && Object.keys(options.qs).length === 0) {
		delete options.qs;
	}

	return await this.helpers.requestWithAuthentication.call(this, 'tubeLabApi', options);
}
