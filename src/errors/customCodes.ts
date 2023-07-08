// Represents an HTTP error with an associated status code
export class HTTPError extends Error {
    constructor(message: string, public code: number) {
        super(message);
        this.name = 'HTTPError';
    }
}

// Represents an RPC (Remote Procedure Call) error with an associated code
export class RPCError extends Error {
    constructor(message: string, public code: number) {
        super(message);
        this.name = 'RPCError';
    }
}

// Represents a contract error with an associated code and stack trace
export class ContractError extends Error {
    constructor(message: string, public code: number) {
        super(message);
        this.name = 'ContractError';
        this.stack = message // Set the stack trace to the error message for better debugging
    }
}
  