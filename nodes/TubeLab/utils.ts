import { IExecuteSingleFunctions, IHttpRequestOptions, NodeOperationError } from 'n8n-workflow';

export const YOUTUBE_CHANNEL_ID = /^[A-Za-z0-9_-]{24}$/;

function validateChannelIds(channelIds: string[]): { valid: string[]; invalid: string[] } {
	return {
		valid: channelIds.filter((id) => YOUTUBE_CHANNEL_ID.test(id)),
		invalid: channelIds.filter((id) => !YOUTUBE_CHANNEL_ID.test(id)),
	};
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
			'Invalid channel IDs found.Please adjust the "Related Channel IDs" parameter and try again. Invalid channel IDs: ' +
				invalid.join(', '),
		);
	}

	return requestOptions;
}
