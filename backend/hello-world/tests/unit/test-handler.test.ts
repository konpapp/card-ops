import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler, ErrorResponse, Operator } from '../../app';
import { expect, describe, it } from '@jest/globals';

const setRequestBody = (body?: unknown): APIGatewayProxyEvent => {
    return {
        httpMethod: 'post',
        body: JSON.stringify(body),
        headers: {},
        isBase64Encoded: false,
        multiValueHeaders: {},
        multiValueQueryStringParameters: {},
        path: '/',
        pathParameters: {},
        queryStringParameters: {},
        requestContext: {
            accountId: '123456789012',
            apiId: '1234',
            authorizer: {},
            httpMethod: 'post',
            identity: {
                accessKey: '',
                accountId: '',
                apiKey: '',
                apiKeyId: '',
                caller: '',
                clientCert: {
                    clientCertPem: '',
                    issuerDN: '',
                    serialNumber: '',
                    subjectDN: '',
                    validity: { notAfter: '', notBefore: '' },
                },
                cognitoAuthenticationProvider: '',
                cognitoAuthenticationType: '',
                cognitoIdentityId: '',
                cognitoIdentityPoolId: '',
                principalOrgId: '',
                sourceIp: '',
                user: '',
                userAgent: '',
                userArn: '',
            },
            path: '/hello',
            protocol: 'HTTP/1.1',
            requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
            requestTimeEpoch: 1428582896000,
            resourceId: '123456',
            resourcePath: '/hello',
            stage: 'dev',
        },
        resource: '',
        stageVariables: {},
    };
};

describe('Unit test for app handler', function () {
    describe('request fails', () => {
        it('missing body parameters', async () => {
            const event = setRequestBody({ x: 1, y: 2 });
            const result: APIGatewayProxyResult = await lambdaHandler(event);

            expect(result.statusCode).toEqual(400);
            expect(result.body).toEqual(
                JSON.stringify({
                    message: ErrorResponse.INVALID_BODY,
                }),
            );
        });

        it('wrong operands', async () => {
            const event = setRequestBody({ x: 'one', y: 2, operator: Operator.ADD });
            const result: APIGatewayProxyResult = await lambdaHandler(event);

            expect(result.statusCode).toEqual(400);
            expect(result.body).toEqual(
                JSON.stringify({
                    message: ErrorResponse.INVALID_OPERANDS,
                }),
            );
        });

        it('wrong operator', async () => {
            const event = setRequestBody({ x: 1, y: 2, operator: 'adds' });
            const result: APIGatewayProxyResult = await lambdaHandler(event);

            expect(result.statusCode).toEqual(400);
            expect(result.body).toEqual(
                JSON.stringify({
                    message: ErrorResponse.INVALID_OPERATOR,
                }),
            );
        });

        it('division by zero', async () => {
            const event = setRequestBody({ x: 1, y: 0, operator: Operator.DIVIDE });
            const result: APIGatewayProxyResult = await lambdaHandler(event);

            expect(result.statusCode).toEqual(400);
            expect(result.body).toEqual(
                JSON.stringify({
                    message: ErrorResponse.ZERO_DIVISION,
                }),
            );
        });
    });

    describe('request succeeds', () => {
        it('adds two numbers', async () => {
            const event = setRequestBody({ x: 1, y: 2, operator: Operator.ADD });
            const result: APIGatewayProxyResult = await lambdaHandler(event);

            expect(result.statusCode).toEqual(200);
            expect(result.body).toEqual(
                JSON.stringify({
                    result: 3,
                }),
            );
        });

        it('subtracts two numbers', async () => {
            const event = setRequestBody({ x: 3, y: 2, operator: Operator.SUBTRACT });
            const result: APIGatewayProxyResult = await lambdaHandler(event);

            expect(result.statusCode).toEqual(200);
            expect(result.body).toEqual(
                JSON.stringify({
                    result: 1,
                }),
            );
        });

        it('multiplies two numbers', async () => {
            const event = setRequestBody({ x: 2, y: 3, operator: Operator.MULTIPLY });
            const result: APIGatewayProxyResult = await lambdaHandler(event);

            expect(result.statusCode).toEqual(200);
            expect(result.body).toEqual(
                JSON.stringify({
                    result: 6,
                }),
            );
        });

        it('divides two numbers', async () => {
            const event = setRequestBody({ x: 6, y: 3, operator: Operator.DIVIDE });
            const result: APIGatewayProxyResult = await lambdaHandler(event);

            expect(result.statusCode).toEqual(200);
            expect(result.body).toEqual(
                JSON.stringify({
                    result: 2,
                }),
            );
        });

        it('formats to two decimals when required', async () => {
            const event = setRequestBody({ x: 1, y: 3, operator: Operator.DIVIDE });
            const result: APIGatewayProxyResult = await lambdaHandler(event);

            expect(result.statusCode).toEqual(200);
            expect(result.body).toEqual(
                JSON.stringify({
                    result: 0.33,
                }),
            );
        });
    });
});
