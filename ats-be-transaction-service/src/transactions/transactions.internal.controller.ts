/** @format */
import * as express from 'express';
import {
  Controller,
  Get,
  Route,
  Query,
  Request,
  SuccessResponse,
  Put,
  Tags,
  Security,
  Body,
  Header,
} from 'tsoa';
import {
  getTransactionsByFilter,
  getReceivingCountries,
  getDeliverVia,
  updateStatus,
  checkPhoneByCountry,
  countryById,
  deliverViaByShortCode,
  getTransactionCount,
  getDeliverViaByID,
  updateTransaction,
} from './transactions.service';
import {
  ResponseGetDeliverVia,
  ResponseGetReceivingCountries,
  TransactionReportResponse,
  CountryResponse,
  DeliverVia,
  TransactionStatus,
  TransactionCountType,
  DeliverViaItemResponse,
  RequestUpdateTransaction,
  TransactionResponse,
  validate,
} from '@atservicesv2/common';
import { updateTransactionJoi } from './transaction.validation';

@Route('api/internal/transactions')
export class TransactionsInternalController extends Controller {
  @SuccessResponse('200', 'Success')
  @Get('')
  @Tags('Transaction')
  public async getTransactions(
    @Request() request: express.Request,
  ): Promise<TransactionReportResponse> {
    return getTransactionsByFilter(request.query);
  }

  @SuccessResponse('200', 'Success')
  @Get('receivingCountries')
  @Tags('Transaction')
  public async getReceivingCountries(
    @Request() request: express.Request,
  ): Promise<ResponseGetReceivingCountries> {
    return await getReceivingCountries(request.query);
  }

  @SuccessResponse('200', 'Success')
  @Get('getDeliverVia')
  @Tags('Transaction')
  public async getDeliverVia(
    @Query('countryId') countryId?: string,
    @Query('transferType') transferType?: string,
  ): Promise<ResponseGetDeliverVia> {
    return await getDeliverVia(countryId, transferType);
  }

  @SuccessResponse('200', 'Success')
  @Get('deliver-via/{shortCode}')
  @Tags('Transaction')
  public async getDeliverViaByShortCode(shortCode: string): Promise<DeliverVia> {
    return await deliverViaByShortCode(shortCode);
  }

  @SuccessResponse('200', 'Success')
  @Get('deliverVia/{deliverViaId}')
  @Tags('Transaction')
  public async getDeliverViaById(deliverViaId: string): Promise<DeliverViaItemResponse | null> {
    return await getDeliverViaByID(deliverViaId);
  }

  @SuccessResponse('200', 'Success')
  @Get('check-phone-by-country/{country}/{phone}')
  @Tags('Transaction')
  public async checkPhoneByCountry(phone: string, country: string): Promise<CountryResponse> {
    return await checkPhoneByCountry(phone, country);
  }

  @SuccessResponse('200', 'Success')
  @Get('/country/{id}')
  @Tags('Transaction')
  public async getCountryById(id: string): Promise<CountryResponse> {
    return await countryById(id);
  }

  @SuccessResponse('200', 'Success')
  @Put('update-status/{transactionId}/{status}')
  @Tags('Transaction')
  public async updateStatus(transactionId: string, status: TransactionStatus): Promise<string> {
    await updateStatus(transactionId, status);
    return 'OK';
  }

  @SuccessResponse('200', 'Success')
  @Get('reports-count/{type}')
  @Tags('Transaction')
  public async getTransactionCount(
    @Request() request: express.Request,
    type: TransactionCountType,
  ): Promise<number> {
    return await getTransactionCount(request.query, type);
  }

  @SuccessResponse('200', 'Success')
  @Put('{id}/update/{userId}')
  @Tags('Transaction')
  public async update(
    id: string,
    @Body() reqBody: RequestUpdateTransaction,
    userId?: string,
  ): Promise<TransactionResponse | null> {
    validate(reqBody, updateTransactionJoi);
    return await updateTransaction(id, userId, reqBody);
  }
}
