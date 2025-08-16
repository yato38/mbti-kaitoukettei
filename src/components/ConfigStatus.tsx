import React, { useState, useEffect } from 'react';
import { spreadsheetService } from '../services/spreadsheetService';

const ConfigStatus: React.FC = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const configInfo = spreadsheetService.getConfigInfo();
  const isValid = spreadsheetService.validateConfig();

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const health = await spreadsheetService.healthCheck();
      setIsHealthy(health);
    } catch (error) {
      setIsHealthy(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (isValid) {
      checkHealth();
    }
  }, [isValid]);

  return (
    <div className="bg-green-900/40 p-6 rounded-xl border border-green-700/50 backdrop-blur-sm text-left">
      <h3 className="text-lg font-bold mb-4 text-green-300">設定状況</h3>
      
      <div className="space-y-3 text-green-200">
        <div className="flex items-center justify-between">
          <span>Google Apps Script URL:</span>
          <span className={configInfo.hasAppsScriptUrl ? 'text-green-400' : 'text-red-400'}>
            {configInfo.hasAppsScriptUrl ? '✅ 設定済み' : '❌ 未設定'}
          </span>
        </div>
        
        {configInfo.hasAppsScriptUrl && (
          <div className="text-sm text-green-300 bg-green-900/30 p-2 rounded">
            <div className="font-semibold mb-1">URL:</div>
            <div className="break-all">{configInfo.appsScriptUrl}</div>
          </div>
        )}
        
        {isValid && (
          <div className="flex items-center justify-between">
            <span>接続状態:</span>
            <div className="flex items-center space-x-2">
              {isChecking ? (
                <span className="text-yellow-400">🔄 確認中...</span>
              ) : isHealthy === true ? (
                <span className="text-green-400">✅ 接続OK</span>
              ) : isHealthy === false ? (
                <span className="text-red-400">❌ 接続エラー</span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
              <button
                onClick={checkHealth}
                disabled={isChecking}
                className="text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-2 py-1 rounded"
              >
                再確認
              </button>
            </div>
          </div>
        )}
      </div>

      {!isValid && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
          <div className="text-red-300 font-semibold mb-2">設定が必要:</div>
          <ul className="text-red-200 text-sm space-y-1">
            <li>• Vercelの環境変数でVITE_GOOGLE_APPS_SCRIPT_URLを設定</li>
            <li>• Google Apps ScriptをWeb Appとしてデプロイ</li>
            <li>• スプレッドシートIDをGoogle Apps Scriptに設定</li>
          </ul>
        </div>
      )}

      {isValid && isHealthy === false && (
        <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
          <div className="text-yellow-300 font-semibold mb-2">接続エラー:</div>
          <ul className="text-yellow-200 text-sm space-y-1">
            <li>• Google Apps Scriptの再デプロイが必要</li>
            <li>• Web Appの設定で「アクセスできるユーザー」を「全員」に設定</li>
            <li>• スプレッドシートIDが正しいか確認</li>
            <li>• ブラウザのキャッシュをクリア</li>
          </ul>
        </div>
      )}

      <div className="mt-4 text-xs text-green-400">
        詳細な設定手順は <code className="bg-green-900/50 px-1 rounded">GOOGLE_APPS_SCRIPT_SETUP.md</code> を参照してください。
      </div>
    </div>
  );
};

export default ConfigStatus;
