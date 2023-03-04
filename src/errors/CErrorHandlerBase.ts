class CErrorHandlerBase extends Error {
    statusCode: number;
    composedErrorMessage: { [composedErrorMessage: string]: string };

    constructor(statusCode: number, menssage: string) {
        super(menssage);
        this.statusCode = statusCode;
        this.composedErrorMessage = {};
    }
}

export default CErrorHandlerBase;
