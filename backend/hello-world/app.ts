import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export enum Operator {
    ADD = 'ADD',
    SUBTRACT = 'SUBTRACT',
    MULTIPLY = 'MULTIPLY',
    DIVIDE = 'DIVIDE',
}

type BodyParameters = {
    x: number;
    y: number;
    operator: Operator;
};

export enum ErrorResponse {
    INVALID_BODY = 'Invalid body on request',
    INVALID_OPERANDS = 'Invalid operands',
    INVALID_OPERATOR = 'Invalid operator',
    ZERO_DIVISION = 'Division by 0',
    UNKNOWN_ERROR = 'Some error happened',
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const params = event.body && (JSON.parse(event?.body) as BodyParameters);
    if (!params || !params.x.toString() || !params.y.toString() || !params.operator) {
        // Converting numbers to string to allow zeros
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: ErrorResponse.INVALID_BODY,
            }),
        };
    }
    const x = params.x;
    const y = params.y;
    const operator = params.operator.toString().toUpperCase();

    if (isNaN(x) || isNaN(y)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: ErrorResponse.INVALID_OPERANDS,
            }),
        };
    }

    if (!Object.values(Operator).includes(operator as Operator)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: ErrorResponse.INVALID_OPERATOR,
            }),
        };
    }

    let result = 0;
    switch (operator) {
        case Operator.ADD:
            result = x + y;
            break;
        case Operator.SUBTRACT:
            result = x - y;
            break;
        case Operator.MULTIPLY:
            result = x * y;
            break;
        case Operator.DIVIDE:
            if (y === 0) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: ErrorResponse.ZERO_DIVISION,
                    }),
                };
            }
            result = x / y;
    }

    try {
        return {
            statusCode: 200,
            body: JSON.stringify({
                result: Math.round(result * 100) / 100,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: ErrorResponse.UNKNOWN_ERROR,
            }),
        };
    }
};
