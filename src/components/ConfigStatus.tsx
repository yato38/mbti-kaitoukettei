import React from 'react';
import { spreadsheetService } from '../services/spreadsheetService';

export const ConfigStatus: React.FC = () => {
  const configInfo = spreadsheetService.getConfigInfo();
  const isValid = spreadsheetService.validateConfig();

  return (
    <div className="config-status bg-green-900/30 p-4 rounded-lg border border-green-700/50 backdrop-blur-sm">
      <h3 className="text-lg font-bold mb-3 text-green-300">スプレッドシート設定状況</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-green-200">スプレッドシートID:</span>
          <span className={`font-mono ${configInfo.hasSpreadsheetId ? 'text-green-400' : 'text-red-400'}`}>
            {configInfo.hasSpreadsheetId ? '設定済み' : '未設定'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-green-200">Google APIキー:</span>
          <span className={`font-mono ${configInfo.hasApiKey ? 'text-green-400' : 'text-red-400'}`}>
            {configInfo.hasApiKey ? '設定済み' : '未設定'}
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-green-700/30">
          <span className="text-green-200 font-semibold">全体状態:</span>
          <span className={`font-bold ${isValid ? 'text-green-400' : 'text-red-400'}`}>
            {isValid ? '準備完了' : '設定が必要'}
          </span>
        </div>
      </div>
      
      {!isValid && (
        <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
          <p className="text-yellow-200 text-sm">
            <strong>設定が必要:</strong> スプレッドシートへの送信を有効にするには、
            環境変数ファイル（.env）にスプレッドシートIDとGoogle APIキーを設定してください。
          </p>
        </div>
      )}
    </div>
  );
};
