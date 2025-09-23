import {
	DeclarativeRestApiSettings,
	IExecutePaginationFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

export async function paginate(
	this: IExecutePaginationFunctions,
	requestOptions: DeclarativeRestApiSettings.ResultOptions,
): Promise<INodeExecutionData[]> {
	if (!requestOptions.options.qs) requestOptions.options.qs = {};

	const executions: INodeExecutionData[] = [];
	const requestedLimit = this.getNodeParameter('limit', 50) as number;
	// Hard cap at 1000 results for safety
	const limit = Math.min(requestedLimit, 1000);
	// Use API's max page size for efficiency
	const pageSize = 40;
	let currentPage = 0;

	while (executions.length < limit) {
		// Calculate how many items we still need
		const remainingItems = limit - executions.length;
		const requestSize = Math.min(pageSize, remainingItems);

		// Set page number and size
		requestOptions.options.qs.from = currentPage;
		requestOptions.options.qs.size = requestSize;

		const responseData = await this.makeRoutingRequest(requestOptions);

		if (!responseData || responseData.length === 0) {
			// No response, break
			break;
		}

		// Extract results from response
		const results = responseData[0].json;
		let newItems: any[] = [];

		if (results && Array.isArray(results.hits)) {
			newItems = results.hits;
		}

		if (newItems.length === 0) {
			// No more items available, break
			break;
		}

		// Add items up to the remaining limit
		const itemsToAdd = newItems.slice(0, remainingItems);
		executions.push(...itemsToAdd.map((item: any) => ({ json: item })));

		// Check if we have pagination info to make better decisions
		const pagination = results.pagination as any;
		if (pagination && typeof pagination === 'object') {
			// If we got fewer items than requested, we've reached the end
			if (newItems.length < requestSize) {
				break;
			}

			// If we've reached the total available items
			if (
				typeof pagination.from === 'number' &&
				typeof pagination.size === 'number' &&
				typeof pagination.total === 'number' &&
				pagination.from + pagination.size >= pagination.total
			) {
				break;
			}
		} else {
			// Fallback: If we got fewer items than requested, we've reached the end
			if (newItems.length < requestSize) {
				break;
			}
		}

		currentPage++;
	}

	return executions;
}
