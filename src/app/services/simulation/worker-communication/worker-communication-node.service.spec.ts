import { TestBed } from '@angular/core/testing';

import { WorkerCommunicationNodeService } from './worker-communication-node.service';

describe('WorkerCommunicationNodeService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: WorkerCommunicationNodeService = TestBed.inject(WorkerCommunicationNodeService);
		expect(service).toBeTruthy();
	});
});
