import { DiagnosisResult } from '../types';

// Google Sheets API設定
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || '';
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

interface SpreadsheetRow {
  timestamp: string;
  id: string;
  name: string;
  team: string;
  leaderPercentage: number;
  playerPercentage: number;
  personaA: number;
  personaB: number;
  personaC: number;
  personaD: number;
  personaE: number;
  personaF: number;
  completedAt: string;
}

export class SpreadsheetService {
  private static instance: SpreadsheetService;
  private spreadsheetId: string;
  private apiKey: string;

  private constructor() {
    this.spreadsheetId = SPREADSHEET_ID;
    this.apiKey = GOOGLE_API_KEY;
  }

  public static getInstance(): SpreadsheetService {
    if (!SpreadsheetService.instance) {
      SpreadsheetService.instance = new SpreadsheetService();
    }
    return SpreadsheetService.instance;
  }

  /**
   * 診断結果をスプレッドシートに送信
   */
  public async sendResult(result: DiagnosisResult): Promise<boolean> {
    try {
      if (!this.spreadsheetId || !this.apiKey) {
        throw new Error('スプレッドシートIDまたはAPIキーが設定されていません');
      }

      const rowData = this.convertResultToRow(result);
      const success = await this.appendRow(rowData);
      
      if (success) {
        console.log('診断結果がスプレッドシートに正常に送信されました');
        return true;
      } else {
        throw new Error('スプレッドシートへの送信に失敗しました');
      }
    } catch (error) {
      console.error('スプレッドシート送信エラー:', error);
      throw error;
    }
  }

  /**
   * 診断結果をスプレッドシートの行データに変換
   */
  private convertResultToRow(result: DiagnosisResult): SpreadsheetRow {
    return {
      timestamp: new Date().toISOString(),
      id: result.userInfo.id,
      name: result.userInfo.name,
      team: result.userInfo.team,
      leaderPercentage: result.leaderPercentage,
      playerPercentage: result.playerPercentage,
      personaA: result.personaScores.A || 0,
      personaB: result.personaScores.B || 0,
      personaC: result.personaScores.C || 0,
      personaD: result.personaScores.D || 0,
      personaE: result.personaScores.E || 0,
      personaF: result.personaScores.F || 0,
      completedAt: result.completedAt,
    };
  }

  /**
   * Google Sheets APIを使用して行を追加
   */
  private async appendRow(rowData: SpreadsheetRow): Promise<boolean> {
    try {
      const values = [
        [
          rowData.timestamp,
          rowData.id,
          rowData.name,
          rowData.team,
          rowData.leaderPercentage,
          rowData.playerPercentage,
          rowData.personaA,
          rowData.personaB,
          rowData.personaC,
          rowData.personaD,
          rowData.personaE,
          rowData.personaF,
          rowData.completedAt,
        ]
      ];

      console.log('スプレッドシートID:', this.spreadsheetId);
      console.log('送信データ:', values);

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Sheet1!A:M:append?valueInputOption=USER_ENTERED&key=${this.apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values,
        }),
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Success response:', data);
      return true;
    } catch (error) {
      console.error('Google Sheets API エラー:', error);
      
      // より詳細なエラー情報を提供
      if (error instanceof Error) {
        if (error.message.includes('403')) {
          throw new Error('APIキーが無効です。Google Cloud ConsoleでAPIキーを確認してください。');
        } else if (error.message.includes('404')) {
          throw new Error('スプレッドシートが見つかりません。スプレッドシートIDを確認してください。');
        } else if (error.message.includes('400')) {
          throw new Error('リクエストが無効です。データ形式を確認してください。');
        } else if (error.message.includes('401')) {
          throw new Error('認証エラーです。APIキーとGoogle Sheets APIの設定を確認してください。');
        }
      }
      
      return false;
    }
  }

  /**
   * 設定の検証
   */
  public validateConfig(): boolean {
    const isValid = !!(this.spreadsheetId && this.apiKey);
    console.log('設定検証結果:', {
      hasSpreadsheetId: !!this.spreadsheetId,
      hasApiKey: !!this.apiKey,
      isValid
    });
    return isValid;
  }

  /**
   * 設定情報を取得（デバッグ用）
   */
  public getConfigInfo(): { hasSpreadsheetId: boolean; hasApiKey: boolean } {
    return {
      hasSpreadsheetId: !!this.spreadsheetId,
      hasApiKey: !!this.apiKey,
    };
  }
}

// シングルトンインスタンスをエクスポート
export const spreadsheetService = SpreadsheetService.getInstance();
