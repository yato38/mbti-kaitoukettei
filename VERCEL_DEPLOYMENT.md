# Vercelデプロイとスプレッドシート設定ガイド

## 問題の概要

Vercelでデプロイされたアプリでスプレッドシートへの送信時にエラーが発生する主な原因：

1. **環境変数の未設定**
2. **CORSエラー**
3. **Google APIキーの設定不備**

## 解決手順

### 1. Vercelでの環境変数設定

Vercelのダッシュボードで以下の環境変数を設定してください：

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. Settings → Environment Variables に移動
4. 以下の環境変数を追加：

```
VITE_SPREADSHEET_ID=your_actual_spreadsheet_id
VITE_GOOGLE_API_KEY=your_actual_google_api_key
```

**重要**: 環境変数を追加後、新しいデプロイが必要です。

### 2. Google Cloud Consoleでの設定

#### 2.1 Google Sheets APIの有効化

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクトを選択（または新規作成）
3. 「APIとサービス」→「ライブラリ」に移動
4. 「Google Sheets API」を検索して有効化

#### 2.2 APIキーの作成と設定

1. 「APIとサービス」→「認証情報」に移動
2. 「認証情報を作成」→「APIキー」を選択
3. 作成されたAPIキーをコピー
4. APIキーをクリックして設定画面を開く

#### 2.3 APIキーの制限設定

**重要**: セキュリティのため、APIキーに適切な制限を設定してください：

1. **APIの制限**: 「Google Sheets API」のみを選択
2. **アプリケーションの制限**: 
   - 「HTTPリファラー」を選択
   - 以下のパターンを追加：
     ```
     https://your-vercel-domain.vercel.app/*
     https://your-vercel-domain.vercel.app
     ```

### 3. スプレッドシートの設定

1. Google Sheetsでスプレッドシートを作成
2. スプレッドシートIDをコピー（URLの `/d/` と `/edit` の間の文字列）
3. スプレッドシートを「リンクを知っている全員が編集可能」に設定

### 4. デバッグ方法

#### 4.1 ブラウザの開発者ツールで確認

1. F12キーで開発者ツールを開く
2. Consoleタブでエラーメッセージを確認
3. NetworkタブでAPIリクエストの詳細を確認

#### 4.2 設定状況の確認

アプリの右上に表示される設定状況インジケーターで：
- ✅ 正常: 環境変数が正しく設定されている
- ❌ エラー: 環境変数が未設定または無効

### 5. よくあるエラーと解決方法

#### 5.1 CORSエラー
```
Access to fetch at 'https://sheets.googleapis.com/...' from origin 'https://your-domain.vercel.app' has been blocked by CORS policy
```

**解決方法**: APIキーのHTTPリファラー制限を確認

#### 5.2 403 Forbidden
```
{
  "error": {
    "code": 403,
    "message": "API key not valid. Please pass a valid API key."
  }
}
```

**解決方法**: 
- APIキーが正しく設定されているか確認
- Google Sheets APIが有効化されているか確認

#### 5.3 404 Not Found
```
{
  "error": {
    "code": 404,
    "message": "Requested entity was not found."
  }
}
```

**解決方法**: スプレッドシートIDが正しいか確認

### 6. 代替案（フォールバック）

環境変数が設定されていない場合、アプリは自動的にローカルストレージに結果を保存します。

### 7. 再デプロイ

環境変数を変更した後は、必ず新しいデプロイを行ってください：

1. Vercelダッシュボードで「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック
3. または、GitHubにプッシュして自動デプロイをトリガー

## トラブルシューティング

問題が解決しない場合は、以下を確認してください：

1. ブラウザのコンソールでエラーメッセージを確認
2. Vercelのデプロイログを確認
3. Google Cloud ConsoleのAPI使用量を確認
4. スプレッドシートの権限設定を確認

## サポート

問題が解決しない場合は、以下を提供してください：
- ブラウザコンソールのエラーメッセージ
- Vercelのデプロイログ
- 設定状況インジケーターの状態
