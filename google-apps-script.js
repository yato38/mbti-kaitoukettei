/**
 * Google Apps Script for MBTI Diagnosis Spreadsheet
 * このスクリプトをGoogle Apps Scriptにコピーして、Web Appとしてデプロイしてください
 */

// スプレッドシートIDを設定してください
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

/**
 * CORSヘッダーを設定する関数
 */
function setCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'true'
  };
}

/**
 * Web Appのエントリーポイント
 */
function doPost(e) {
  try {
    // CORSヘッダーを設定
    const headers = setCorsHeaders();
    headers['Content-Type'] = 'application/json; charset=utf-8';

    // リクエストデータを取得
    const requestData = JSON.parse(e.postData.contents);
    
    console.log('受信したリクエスト:', requestData);
    
    if (requestData.action === 'appendRow') {
      const result = appendRowToSpreadsheet(requestData.data);
      console.log('処理結果:', result);
      
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    } else {
      throw new Error('無効なアクションです: ' + requestData.action);
    }
  } catch (error) {
    console.error('エラー:', error);
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(setCorsHeaders());
  }
}

/**
 * GETリクエストを処理（ヘルスチェック用）
 */
function doGet(e) {
  const headers = setCorsHeaders();
  headers['Content-Type'] = 'application/json; charset=utf-8';
  
  const response = {
    success: true,
    message: 'Google Apps Script is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    cors: 'enabled'
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}

/**
 * OPTIONSリクエストを処理（CORS用）
 */
function doOptions(e) {
  const headers = setCorsHeaders();
  headers['Content-Type'] = 'text/plain; charset=utf-8';
  
  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(headers);
}

/**
 * スプレッドシートに行を追加
 */
function appendRowToSpreadsheet(data) {
  try {
    console.log('スプレッドシートID:', SPREADSHEET_ID);
    console.log('追加するデータ:', data);
    
    // スプレッドシートを取得
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (!spreadsheet) {
      throw new Error('スプレッドシートが見つかりません。IDを確認してください: ' + SPREADSHEET_ID);
    }
    
    const sheet = spreadsheet.getSheetByName('Sheet1');
    if (!sheet) {
      throw new Error('Sheet1が見つかりません。シート名を確認してください');
    }

    // データを配列として準備
    const rowData = [
      data[0] || new Date().toISOString(),  // timestamp
      data[1] || '',  // id
      data[2] || '',  // name
      data[3] || '',  // team
      data[4] || 0,   // leaderPercentage
      data[5] || 0,   // playerPercentage
      data[6] || 0,   // personaA
      data[7] || 0,   // personaB
      data[8] || 0,   // personaC
      data[9] || 0,   // personaD
      data[10] || 0,  // personaE
      data[11] || 0,  // personaF
      data[12] || 0,  // personaAPercentage
      data[13] || 0,  // personaBPercentage
      data[14] || 0,  // personaCPercentage
      data[15] || 0,  // personaDPercentage
      data[16] || 0,  // personaEPercentage
      data[17] || 0,  // personaFPercentage
      data[18] || new Date().toISOString()  // completedAt
    ];

    // 行を追加
    sheet.appendRow(rowData);
    
    console.log('データが正常に追加されました:', rowData);
    
    return {
      success: true,
      message: 'データが正常に追加されました',
      timestamp: new Date().toISOString(),
      rowCount: sheet.getLastRow()
    };
  } catch (error) {
    console.error('スプレッドシート追加エラー:', error);
    throw new Error(`スプレッドシートへの追加に失敗しました: ${error.message}`);
  }
}

/**
 * テスト用関数
 */
function testAppendRow() {
  const testData = [
    new Date().toISOString(),
    'test-id',
    'テストユーザー',
    'テストチーム',
    50,
    50,
    10,
    20,
    30,
    40,
    50,
    60,
    15,  // personaAPercentage
    25,  // personaBPercentage
    35,  // personaCPercentage
    45,  // personaDPercentage
    55,  // personaEPercentage
    65,  // personaFPercentage
    new Date().toISOString()
  ];
  
  const result = appendRowToSpreadsheet(testData);
  console.log('テスト結果:', result);
  return result;
}

/**
 * 設定確認用関数
 */
function checkConfig() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('Sheet1');
    
    return {
      success: true,
      spreadsheetId: SPREADSHEET_ID,
      spreadsheetName: spreadsheet.getName(),
      sheetExists: !!sheet,
      lastRow: sheet ? sheet.getLastRow() : 0,
      lastColumn: sheet ? sheet.getLastColumn() : 0
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      spreadsheetId: SPREADSHEET_ID
    };
  }
}
