/**
 * Fyers API v3 Client Wrapper
 * Handles authentication, API calls, and error handling
 */

import type {
  FyersAuthConfig,
  FyersAccessToken,
  FyersQuotesResponse,
  PlaceOrderRequest,
  OrderResponse,
  OrdersResponse,
  PositionsResponse,
  HoldingsResponse,
  FundsResponse,
  HistoricalDataRequest,
  HistoricalDataResponse,
  ProfileResponse,
  FyersDepthResponse,
} from './types';

export class FyersClient {
  private fyers: any;
  private config: FyersAuthConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(config: FyersAuthConfig) {
    this.config = config;
    // Use our wrapper to load only the API service, avoiding problematic websocket modules
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { FyersApi } = require('./api-wrapper.js');
    this.fyers = new FyersApi({
      AppID: this.config.appId,
      RedirectURL: this.config.redirectUri,
      enableLogging: false,
    });
  }

  /**
   * Generate authorization URL for OAuth flow
   */
  generateAuthUrl(state: string = 'sample_state'): string {
    // AppID and RedirectURL already set in constructor
    const authUrl = this.fyers.generateAuthCode({ state });
    return authUrl;
  }

  /**
   * Generate access token from auth code
   */
  async generateAccessToken(authCode: string): Promise<FyersAccessToken> {
    try {
      const response = await this.fyers.generate_access_token({
        client_id: this.config.appId,
        secret_key: this.config.secretKey,
        auth_code: authCode,
      });

      if (response.s === 'ok' && response.access_token) {
        this.accessToken = response.access_token;
        // Fyers tokens typically expire in 24 hours
        this.tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

        return {
          access_token: response.access_token,
          expires_at: this.tokenExpiry,
        };
      }

      throw new Error(response.message || 'Failed to generate access token');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Set access token manually (for stored tokens)
   */
  setAccessToken(token: string, expiresAt?: number): void {
    this.accessToken = token;
    this.tokenExpiry = expiresAt || null;
    this.fyers.setAccessToken(token);
  }

  /**
   * Check if token is valid
   */
  isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    return Date.now() < this.tokenExpiry;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.isTokenValid() ? this.accessToken : null;
  }

  /**
   * Ensure client has valid access token
   */
  private ensureAuthenticated(): void {
    if (!this.isTokenValid()) {
      throw new Error('No valid access token. Please authenticate first.');
    }
  }

  // ============================================================================
  // Market Data APIs
  // ============================================================================

  /**
   * Get quotes for symbols
   */
  async getQuotes(symbols: string[]): Promise<FyersQuotesResponse> {
    this.ensureAuthenticated();

    try {
      const response = await this.fyers.getQuotes({
        symbols: symbols.join(','),
      });

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get market depth for a symbol
   */
  async getMarketDepth(symbol: string): Promise<FyersDepthResponse> {
    this.ensureAuthenticated();

    try {
      const response = await this.fyers.getMarketDepth({
        symbol,
        ohlcv_flag: 1,
      });

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get historical data
   */
  async getHistoricalData(
    request: HistoricalDataRequest
  ): Promise<HistoricalDataResponse> {
    this.ensureAuthenticated();

    try {
      const response = await this.fyers.getHistory({
        symbol: request.symbol,
        resolution: request.resolution,
        date_format: request.date_format,
        range_from: request.range_from,
        range_to: request.range_to,
        cont_flag: request.cont_flag || '1',
      });

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ============================================================================
  // Order Management APIs
  // ============================================================================

  /**
   * Place a new order
   */
  async placeOrder(orderRequest: PlaceOrderRequest): Promise<OrderResponse> {
    this.ensureAuthenticated();

    try {
      const response = await this.fyers.place_order({
        symbol: orderRequest.symbol,
        qty: orderRequest.qty,
        type: orderRequest.type,
        side: orderRequest.side,
        productType: orderRequest.productType,
        limitPrice: orderRequest.limitPrice || 0,
        stopPrice: orderRequest.stopPrice || 0,
        validity: orderRequest.validity || 'DAY',
        disclosedQty: orderRequest.disclosedQty || 0,
        offlineOrder: orderRequest.offlineOrder || false,
        stopLoss: orderRequest.stopLoss || 0,
        takeProfit: orderRequest.takeProfit || 0,
      });

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Modify an existing order
   */
  async modifyOrder(
    orderId: string,
    modifications: Partial<PlaceOrderRequest>
  ): Promise<OrderResponse> {
    this.ensureAuthenticated();

    try {
      const response = await this.fyers.modify_order({
        id: orderId,
        ...modifications,
      });

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<OrderResponse> {
    this.ensureAuthenticated();

    try {
      const response = await this.fyers.cancel_order({
        id: orderId,
      });

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all orders
   */
  async getOrders(): Promise<OrdersResponse> {
    this.ensureAuthenticated();

    try {
      const response = await this.fyers.get_orders();
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<OrdersResponse> {
    this.ensureAuthenticated();

    try {
      const response = await this.fyers.get_orders({
        id: orderId,
      });

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ============================================================================
  // Portfolio APIs
  // ============================================================================

  /**
   * Get all positions
   */
  async getPositions(): Promise<PositionsResponse> {
    this.ensureAuthenticated();

    try {
      const response = await this.fyers.get_positions();
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all holdings
   */
  async getHoldings(): Promise<HoldingsResponse> {
    this.ensureAuthenticated();

    try {
      const response = await this.fyers.get_holdings();
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get fund limits
   */
  async getFunds(): Promise<FundsResponse> {
    this.ensureAuthenticated();

    try {
      const response = await this.fyers.get_funds();
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Convert position (e.g., Intraday to CNC)
   */
  async convertPosition(
    symbol: string,
    positionSide: number,
    convertQty: number,
    convertFrom: string,
    convertTo: string
  ): Promise<OrderResponse> {
    this.ensureAuthenticated();

    try {
      const response = await this.fyers.convert_position({
        symbol,
        positionSide,
        convertQty,
        convertFrom,
        convertTo,
      });

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ============================================================================
  // Profile & Account APIs
  // ============================================================================

  /**
   * Get user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    this.ensureAuthenticated();

    try {
      const response = await this.fyers.get_profile();
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ============================================================================
  // Error Handling
  // ============================================================================

  private handleError(error: any): Error {
    if (error.response?.data) {
      const errorData = error.response.data;
      return new Error(
        `Fyers API Error (${errorData.code}): ${errorData.message || 'Unknown error'}`
      );
    }

    if (error.message) {
      return new Error(`Fyers API Error: ${error.message}`);
    }

    return new Error('An unknown error occurred with Fyers API');
  }
}

/**
 * Create a new Fyers client instance
 */
export function createFyersClient(config?: FyersAuthConfig): FyersClient {
  const authConfig: FyersAuthConfig = config || {
    appId: process.env.FYERS_APP_ID || '',
    secretKey: process.env.FYERS_SECRET_KEY || '',
    redirectUri: process.env.FYERS_REDIRECT_URI || '',
  };

  if (!authConfig.appId || !authConfig.secretKey || !authConfig.redirectUri) {
    throw new Error(
      'Missing Fyers API configuration. Please check your environment variables.'
    );
  }

  return new FyersClient(authConfig);
}
