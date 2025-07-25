import { CustomError } from "./custom.error";

export class Forbidden extends CustomError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }

    public static Error(): Forbidden {
        return new Forbidden();
    }
}