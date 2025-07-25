import { CustomError } from "./custom.error";

export class Unauthorized extends CustomError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }

    public static Error(): Unauthorized {
        return new Unauthorized();
    }
}