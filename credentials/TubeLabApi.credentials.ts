import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';
import { API_BASE_URL } from '../nodes/TubeLab/consts';

export class TubeLabApi implements ICredentialType {
	name = 'tubeLabApi';
	displayName = 'TubeLab API';
	documentationUrl = 'https://tubelab.ai/docs/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Api-Key " + $credentials.apiKey}}',
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: API_BASE_URL,
			url: '/v1/channels',
			headers: {
				Authorization: '={{"Api-Key " + $credentials.apiKey}}',
			},
			qs: {
				query: 'minecraft',
			},
		},
	};
}
