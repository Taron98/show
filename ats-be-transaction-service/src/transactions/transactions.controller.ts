/** @format */
import * as express from 'express';
import {
  Body,
  Controller,
  Get,
  Post,
  Route,
  Query,
  Request,
  SuccessResponse,
  Put,
  Security,
  Tags,
  Header,
} from 'tsoa';
import {
  getTransactionsByFilter,
  getRate,
  getFee,
  getReceivingCountries,
  getTransferTypesForCountry,
  getDeliverVia,
  calculateAmount,
  create,
  updateStatus,
  getBanksByCountry,
  getDeliverViaByID,
  getAllowedStatuses,
  updateTransaction,
  createTransactionCancelRequest,
  createTransactionChangeNameRequest,
  deliverViaByShortCode,
  countryById,
  getTransactionCount,
  checkComplianceRules,
} from './transactions.service';
import {
  ResponseGetDeliverVia,
  ResponseGetTransferType,
  ResponseGetReceivingCountries,
  ResponseCalculateAmount,
  RequestCalculateAmount,
  RequestCreateTransaction,
  ResponseCreateTransaction,
  TransactionReportResponse,
  validate,
  Bank,
  DeliverViaItemResponse,
  AllowedStatusesResponse,
  RequestUpdateTransaction,
  TransactionResponse,
  TransactionCancelRequest,
  TransactionCrResponse,
  TransactionChangeNameRequest,
  UserType,
  DeliverVia,
  ComplianceCheckRequest,
  TransactionStatus,
  TransactionCountType,
  CountryResponse,
  ComplianceRuleErrorsResponse,
} from '@atservicesv2/common';
import { createTransactionJoi, updateTransactionJoi } from './transaction.validation';
import {
  reateTransactionCancelJoi,
  createTransactionChangeNameRequestJoi,
} from './transaction-cr.validation';
@Route('api/transactions')
export class TransactionsController extends Controller {
  @SuccessResponse('200', 'Success')
  @Get('')
  @Security('api_jwt', ['TRANSACTION_REPORTS'])
  @Tags('Transaction')
  public async getTransactions(
    @Request() request: express.Request,
  ): Promise<TransactionReportResponse> {
    return getTransactionsByFilter(request.query);
  }

  @SuccessResponse('200', 'Success')
  @Get('rate')
  @Security('jwt')
  @Tags('Transaction')
  public async getRate(): Promise<number | null> {
    return getRate();
  }

  @SuccessResponse('200', 'Success')
  @Get('fee')
  @Security('jwt')
  @Tags('Transaction')
  public async getFee(): Promise<number | null> {
    return getFee();
  }

  @SuccessResponse('200', 'Success')
  @Get('receivingCountries')
  @Security('jwt')
  @Tags('Transaction')
  public async getReceivingCountries(
    @Request() request: express.Request,
  ): Promise<ResponseGetReceivingCountries> {
    return await getReceivingCountries(request.query);
  }

  @SuccessResponse('200', 'Success')
  @Post('check-compliance')
  @Security('jwt')
  @Tags('Transaction')
  public async checkComplianceRules(
    @Body() complianceData: ComplianceCheckRequest,
  ): Promise<ComplianceRuleErrorsResponse> {
    return await checkComplianceRules(complianceData);
  }

  @SuccessResponse('200', 'Success')
  @Get('{countryId}/transferTypes')
  @Security('jwt')
  @Tags('Transaction')
  public async getTransactionTypesForCountry(countryId: string): Promise<ResponseGetTransferType> {
    return await getTransferTypesForCountry(countryId);
  }

  @SuccessResponse('200', 'Success')
  @Get('getDeliverVia')
  @Security('jwt')
  @Tags('Transaction')
  public async getDeliverVia(
    @Query('countryId') countryId?: string,
    @Query('transferType') transferType?: string,
  ): Promise<ResponseGetDeliverVia> {
    return await getDeliverVia(countryId, transferType);
  }

  @SuccessResponse('200', 'Success')
  @Get('deliver-via/{shortCode}')
  @Security('jwt')
  @Tags('Transaction')
  public async getDeliverViaByShortCode(shortCode: string): Promise<DeliverVia> {
    return await deliverViaByShortCode(shortCode);
  }

  @SuccessResponse('200', 'Success')
  @Post('calculateAmount')
  @Security('jwt')
  @Tags('Transaction')
  public async calculateAmount(
    @Body() body: RequestCalculateAmount,
  ): Promise<ResponseCalculateAmount> {
    const { deliverVia, sendingCurrency, receivingCurrency, amount } = body;
    return await calculateAmount(deliverVia, sendingCurrency, receivingCurrency, amount);
  }

  @SuccessResponse('200', 'Success')
  @Post('create')
  @Security('jwt', ['SEND_MONEY'])
  @Tags('Transaction')
  public async createTransaction(
    @Body() reqBody: RequestCreateTransaction,
    @Header('user-id') userId: string,
    @Header('user-type') userType: UserType,
    @Header('user-agent-id') agentId?: string,
    @Header('user-branch-id') branchId?: string,
  ): Promise<ResponseCreateTransaction | ComplianceRuleErrorsResponse> {
    validate(reqBody, createTransactionJoi);
    return await create(reqBody, userId, userType, agentId, branchId);
  }

  @SuccessResponse('200', 'Success')
  @Get('{countryId}/banks')
  @Security('jwt')
  @Tags('Transaction')
  public async getBanksByCountry(countryId: string): Promise<Array<Bank> | null> {
    return await getBanksByCountry(countryId);
  }

  @SuccessResponse('200', 'Success')
  @Get('deliverVia/{deliverViaId}')
  @Security('jwt')
  @Tags('Transaction')
  public async getDeliverViaById(deliverViaId: string): Promise<DeliverViaItemResponse | null> {
    return await getDeliverViaByID(deliverViaId);
  }

  @SuccessResponse('200', 'Success')
  @Post('cancel-request')
  @Security('jwt', ['SEND_MONEY'])
  @Tags('Transaction')
  public async createTransactionCancelRequest(
    @Body() reqBody: TransactionCancelRequest,
  ): Promise<TransactionCrResponse> {
    validate(reqBody, reateTransactionCancelJoi);
    return await createTransactionCancelRequest(reqBody);
  }

  @SuccessResponse('200', 'Success')
  @Post('change-name-request')
  @Security('jwt', ['SEND_MONEY'])
  @Tags('Transaction')
  public async createTransactionChangeNameRequest(
    @Body() reqBody: TransactionChangeNameRequest,
  ): Promise<TransactionCrResponse> {
    validate(reqBody, createTransactionChangeNameRequestJoi);
    return await createTransactionChangeNameRequest(reqBody);
  }

  @SuccessResponse('200', 'Success')
  @Get('allowed-statuses/{status}')
  @Security('jwt')
  @Tags('Transaction')
  public async getApplicableStatuses(status: string): Promise<AllowedStatusesResponse | null> {
    return await getAllowedStatuses(status);
  }

  @SuccessResponse('200', 'Success')
  @Put('{id}/update')
  @Security('jwt', ['SEND_MONEY'])
  @Tags('Transaction')
  public async update(
    id: string,
    @Body() reqBody: RequestUpdateTransaction,
    @Header('user-id') userId?: string,
  ): Promise<TransactionResponse | null> {
    validate(reqBody, updateTransactionJoi);
    return await updateTransaction(id, userId, reqBody);
  }

  @SuccessResponse('200', 'Success')
  @Put('update-status/{transactionId}/{status}')
  @Security('jwt')
  @Tags('Transaction')
  public async updateStatus(transactionId: string, status: TransactionStatus): Promise<string> {
    await updateStatus(transactionId, status);
    return 'OK';
  }

  @SuccessResponse('200', 'Success')
  @Get('reports-count/{type}')
  @Security('jwt', ['TRANSACTION_REPORTS'])
  @Tags('Transaction')
  public async getTransactionCount(
    @Request() request: express.Request,
    type: TransactionCountType,
  ): Promise<number> {
    return await getTransactionCount(request.query, type);
  }

  @SuccessResponse('200', 'Success')
  @Get('/country/{id}')
  @Security('jwt')
  @Tags('Transaction')
  public async getCountryById(id: string): Promise<CountryResponse> {
    return await countryById(id);
  }
}
