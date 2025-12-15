/**
 * Symbol master data for Indian stock market
 * Contains popular NSE and BSE stocks with their details
 */

export interface SymbolData {
  symbol: string; // Full symbol like NSE:TCS-EQ
  displayName: string; // Short name like TCS, WIPRO
  companyName: string; // Full company name
  exchange: 'NSE' | 'BSE';
  type: 'EQ' | 'INDEX';
}

/**
 * Popular NSE stocks for autocomplete
 */
export const POPULAR_SYMBOLS: SymbolData[] = [
  // Nifty 50 Index
  { symbol: 'NSE:NIFTY50-INDEX', displayName: 'NIFTY', companyName: 'Nifty 50 Index', exchange: 'NSE', type: 'INDEX' },
  { symbol: 'NSE:NIFTYBANK-INDEX', displayName: 'BANKNIFTY', companyName: 'Bank Nifty Index', exchange: 'NSE', type: 'INDEX' },

  // Top IT Companies
  { symbol: 'NSE:TCS-EQ', displayName: 'TCS', companyName: 'Tata Consultancy Services', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:INFY-EQ', displayName: 'INFY', companyName: 'Infosys Limited', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:WIPRO-EQ', displayName: 'WIPRO', companyName: 'Wipro Limited', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:HCLTECH-EQ', displayName: 'HCLTECH', companyName: 'HCL Technologies', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:TECHM-EQ', displayName: 'TECHM', companyName: 'Tech Mahindra', exchange: 'NSE', type: 'EQ' },

  // Banking & Financial Services
  { symbol: 'NSE:HDFCBANK-EQ', displayName: 'HDFCBANK', companyName: 'HDFC Bank', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:ICICIBANK-EQ', displayName: 'ICICIBANK', companyName: 'ICICI Bank', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:SBIN-EQ', displayName: 'SBIN', companyName: 'State Bank of India', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:KOTAKBANK-EQ', displayName: 'KOTAKBANK', companyName: 'Kotak Mahindra Bank', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:AXISBANK-EQ', displayName: 'AXISBANK', companyName: 'Axis Bank', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:INDUSINDBK-EQ', displayName: 'INDUSINDBK', companyName: 'IndusInd Bank', exchange: 'NSE', type: 'EQ' },

  // FMCG & Consumer Goods
  { symbol: 'NSE:ITC-EQ', displayName: 'ITC', companyName: 'ITC Limited', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:HINDUNILVR-EQ', displayName: 'HINDUNILVR', companyName: 'Hindustan Unilever', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:NESTLEIND-EQ', displayName: 'NESTLEIND', companyName: 'Nestle India', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:BRITANNIA-EQ', displayName: 'BRITANNIA', companyName: 'Britannia Industries', exchange: 'NSE', type: 'EQ' },

  // Energy & Utilities
  { symbol: 'NSE:RELIANCE-EQ', displayName: 'RELIANCE', companyName: 'Reliance Industries', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:ONGC-EQ', displayName: 'ONGC', companyName: 'Oil & Natural Gas Corporation', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:NTPC-EQ', displayName: 'NTPC', companyName: 'NTPC Limited', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:POWERGRID-EQ', displayName: 'POWERGRID', companyName: 'Power Grid Corporation', exchange: 'NSE', type: 'EQ' },

  // Automobiles
  { symbol: 'NSE:MARUTI-EQ', displayName: 'MARUTI', companyName: 'Maruti Suzuki India', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:TATAMOTORS-EQ', displayName: 'TATAMOTORS', companyName: 'Tata Motors', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:M&M-EQ', displayName: 'M&M', companyName: 'Mahindra & Mahindra', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:BAJAJ-AUTO-EQ', displayName: 'BAJAJ-AUTO', companyName: 'Bajaj Auto', exchange: 'NSE', type: 'EQ' },

  // Pharmaceuticals
  { symbol: 'NSE:SUNPHARMA-EQ', displayName: 'SUNPHARMA', companyName: 'Sun Pharmaceutical', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:DRREDDY-EQ', displayName: 'DRREDDY', companyName: 'Dr. Reddy\'s Laboratories', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:CIPLA-EQ', displayName: 'CIPLA', companyName: 'Cipla Limited', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:APOLLOHOSP-EQ', displayName: 'APOLLOHOSP', companyName: 'Apollo Hospitals', exchange: 'NSE', type: 'EQ' },

  // Metals & Mining
  { symbol: 'NSE:TATASTEEL-EQ', displayName: 'TATASTEEL', companyName: 'Tata Steel', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:HINDALCO-EQ', displayName: 'HINDALCO', companyName: 'Hindalco Industries', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:COALINDIA-EQ', displayName: 'COALINDIA', companyName: 'Coal India', exchange: 'NSE', type: 'EQ' },

  // Telecom
  { symbol: 'NSE:BHARTIARTL-EQ', displayName: 'BHARTIARTL', companyName: 'Bharti Airtel', exchange: 'NSE', type: 'EQ' },

  // Cement
  { symbol: 'NSE:ULTRACEMCO-EQ', displayName: 'ULTRACEMCO', companyName: 'UltraTech Cement', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:GRASIM-EQ', displayName: 'GRASIM', companyName: 'Grasim Industries', exchange: 'NSE', type: 'EQ' },

  // Others
  { symbol: 'NSE:ADANIENT-EQ', displayName: 'ADANIENT', companyName: 'Adani Enterprises', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:ADANIPORTS-EQ', displayName: 'ADANIPORTS', companyName: 'Adani Ports', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:ASIANPAINT-EQ', displayName: 'ASIANPAINT', companyName: 'Asian Paints', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:BAJFINANCE-EQ', displayName: 'BAJFINANCE', companyName: 'Bajaj Finance', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:BAJAJFINSV-EQ', displayName: 'BAJAJFINSV', companyName: 'Bajaj Finserv', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:LT-EQ', displayName: 'LT', companyName: 'Larsen & Toubro', exchange: 'NSE', type: 'EQ' },
  { symbol: 'NSE:TITAN-EQ', displayName: 'TITAN', companyName: 'Titan Company', exchange: 'NSE', type: 'EQ' },
];

/**
 * Search symbols by query string
 * Matches against displayName, companyName, and symbol
 */
export function searchSymbols(query: string, limit: number = 10): SymbolData[] {
  if (!query || query.trim().length === 0) {
    return POPULAR_SYMBOLS.slice(0, limit);
  }

  const searchTerm = query.toUpperCase().trim();

  const matches = POPULAR_SYMBOLS.filter((symbol) => {
    return (
      symbol.displayName.toUpperCase().includes(searchTerm) ||
      symbol.companyName.toUpperCase().includes(searchTerm) ||
      symbol.symbol.toUpperCase().includes(searchTerm)
    );
  });

  return matches.slice(0, limit);
}

/**
 * Get symbol by display name
 */
export function getSymbolByName(displayName: string): SymbolData | undefined {
  return POPULAR_SYMBOLS.find(
    (s) => s.displayName.toUpperCase() === displayName.toUpperCase()
  );
}
