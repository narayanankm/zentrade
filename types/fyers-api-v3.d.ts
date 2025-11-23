/**
 * Type definitions for fyers-api-v3
 * This package doesn't have official types, so we declare them here
 */

declare module 'fyers-api-v3' {
  export namespace fyersModel {
    class FyersModel {
      setAppId(appId: string): void;
      setRedirectUrl(redirectUrl: string): void;
      setAccessToken(token: string): void;
      setSecret(secret: string): void;
      generateAuthCode(): string;
      generate_access_token(config: {
        client_id: string;
        secret_key: string;
        auth_code: string;
      }): Promise<any>;
      getQuotes(params: { symbols: string }): Promise<any>;
      getMarketDepth(params: { symbol: string; ohlcv_flag: number }): Promise<any>;
      getHistory(params: {
        symbol: string;
        resolution: string;
        date_format: string;
        range_from: string;
        range_to: string;
        cont_flag: string;
      }): Promise<any>;
      place_order(params: any): Promise<any>;
      modify_order(params: any): Promise<any>;
      cancel_order(params: { id: string }): Promise<any>;
      get_orders(params?: { id?: string }): Promise<any>;
      get_positions(): Promise<any>;
      get_holdings(): Promise<any>;
      get_funds(): Promise<any>;
      get_profile(): Promise<any>;
      convert_position(params: any): Promise<any>;
    }
  }

  export namespace fyersDataSocket {
    class FyersDataSocket {
      constructor(accessToken: string);
      connect(): void;
      disconnect(): void;
      subscribe(symbols: string[]): void;
      unsubscribe(symbols: string[]): void;
      mode(mode: any): void;
      on(event: string, callback: (...args: any[]) => void): void;
      LiteMode: any;
      FullMode: any;
    }
  }
}
