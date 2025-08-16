import React from 'react';
import { spreadsheetService } from '../services/spreadsheetService';

const ConfigStatus: React.FC = () => {
  const configInfo = spreadsheetService.getConfigInfo();
  const isValid = spreadsheetService.validateConfig();

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: isValid ? '#d4edda' : '#f8d7da',
      border: `1px solid ${isValid ? '#c3e6cb' : '#f5c6cb'}`,
      borderRadius: '4px',
      padding: '8px 12px',
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '300px',
      wordBreak: 'break-word'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        設定状況: {isValid ? '✅ 正常' : '❌ エラー'}
      </div>
      <div style={{ fontSize: '11px' }}>
        <div>Google Apps Script URL: {configInfo.hasAppsScriptUrl ? '✅' : '❌'}</div>
      </div>
      {!isValid && (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '10px', 
          color: '#721c24',
          background: '#f8d7da',
          padding: '4px',
          borderRadius: '2px'
        }}>
          <strong>設定が必要:</strong>
          <br />
          • Vercelの環境変数でVITE_GOOGLE_APPS_SCRIPT_URLを設定
          <br />
          • Google Apps ScriptをWeb Appとしてデプロイ
          <br />
          • スプレッドシートIDをGoogle Apps Scriptに設定
        </div>
      )}
    </div>
  );
};

export default ConfigStatus;
