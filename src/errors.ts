export class VZapsError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(message: string, options: { status?: number; code?: string; details?: unknown } = {}) {
    super(message);
    this.name = 'VZapsError';
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
  }
}

export class VZapsAuthenticationError extends VZapsError {
  constructor(message = 'Invalid VZaps client credentials', details?: unknown) {
    super(message, { status: 401, code: 'AUTHENTICATION_FAILED', details });
    this.name = 'VZapsAuthenticationError';
  }
}

export class VZapsTimeoutError extends VZapsError {
  constructor(message = 'VZaps request timed out') {
    super(message, { code: 'REQUEST_TIMEOUT' });
    this.name = 'VZapsTimeoutError';
  }
}
