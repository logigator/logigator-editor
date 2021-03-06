import { Filter } from 'electron';

export function getApiUrl(): string {
	if (process.env.LOCAL_API) return process.env.LOCAL_API;
	return 'https://api.logigator.com';
}

export function getDomain(): string {
	if (process.env.LOCAL_DOMAIN) return process.env.LOCAL_DOMAIN;
	return 'https://editor.logigator.com';
}

export function getHttpFilterUrls(): Filter {
	return {
		urls: [
			'https://api.logigator.com/*',
			'http://api.logigator-local-dev.com/*',
			'https://api.logigator-local-dev.com/*',

			'https://www.gstatic.com/recaptcha/releases/*',
			'https://www.google.com/recaptcha/*'
		]
	};
}
