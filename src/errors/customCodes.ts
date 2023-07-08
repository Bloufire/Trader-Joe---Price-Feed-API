export class HTTPError extends Error {
    constructor(message: string, public code: number) {
        super(message);
        this.name = 'HTTPError';
    }
}

export class RPCError extends Error {
    constructor(message: string, public code: number) {
        super(message);
        this.name = 'RPCError';
    }
}

export class ContractError extends Error {
    constructor(message: string, public code: number) {
        super(message);
        this.name = 'ContractError';
        this.stack = message
    }
}
  