/**
 * Google Apps Script for MBTI Diagnosis Spreadsheet
 * このスクリプトをGoogle Apps Scriptにコピーして、Web Appとしてデプロイしてください
 */

// スプレッドシートIDを設定してください
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

/**
 * Web Appのエントリーポイント
 */
function doPost(e) {
  try {
    // CORSヘッダーを設定
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // リクエストデータを取得
    const requestData = JSON.parse(e.postData.contents);
    
    if (requestData.action === 'appendRow') {
      const result = appendRowToSpreadsheet(requestData.data);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    } else {
      throw new Error('無効なアクションです');
    }
  } catch (error) {
    console.error('エラー:', error);
    const errorResponse = {
      success: false,
      error: error.message
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      });
  }
}

/**
 * OPTIONSリクエストを処理（CORS用）
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

/**
 * スプレッドシートに行を追加
 */
function appendRowToSpreadsheet(data) {
  try {
    // スプレッドシートを取得
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('Sheet1');
    
    if (!sheet) {
      throw new Error('Sheet1が見つかりません');
    }

    // データを配列として準備
    const rowData = [
      data[0],  // timestamp
      data[1],  // id
      data[2],  // name
      data[3],  // team
      data[4],  // leaderPercentage
      data[5],  // playerPercentage
      data[6],  // personaA
      data[7],  // personaB
      data[8],  // personaC
      data[9],  // personaD
      data[10], // personaE
      data[11], // personaF
      data[12]  // completedAt
    ];

    // 行を追加
    sheet.appendRow(rowData);
    
    console.log('データが正常に追加されました:', rowData);
    
    return {
      success: true,
      message: 'データが正常に追加されました'
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
    new Date().toISOString()
  ];
  
  const result = appendRowToSpreadsheet(testData);
  console.log('テスト結果:', result);
}
