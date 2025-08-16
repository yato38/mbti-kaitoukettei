# Google Sheets API設定手順

このプロジェクトはGoogle Sheets APIを使用してスプレッドシートにデータを送信します。

## 1. Google Cloud Consoleでの設定

### 1.1 プロジェクトの作成
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成するか、既存のプロジェクトを選択

### 1.2 Google Sheets APIの有効化
1. 「APIとサービス」→「ライブラリ」を選択
2. 「Google Sheets API」を検索して選択
3. 「有効にする」をクリック

### 1.3 APIキーの作成
1. 「APIとサービス」→「認証情報」を選択
2. 「認証情報を作成」→「APIキー」を選択
3. **注意**: OAuth同意画面の設定を求められた場合は「後で設定」または「スキップ」を選択してください（APIキー方式では不要です）
4. 作成されたAPIキーをコピー

### 1.4 APIキーの制限設定（推奨）
1. 作成したAPIキーをクリック
2. 「アプリケーションの制限」で「HTTPリファラー」を選択
3. 以下のドメインを追加：
   - `https://your-app.vercel.app/*`
   - `http://localhost:3000/*`（開発用）
4. 「APIの制限」で「Google Sheets API」のみを選択

## 2. スプレッドシートの準備

### 2.1 スプレッドシートの作成
1. [Google Sheets](https://sheets.google.com/)で新しいスプレッドシートを作成
2. スプレッドシートのURLからIDを取得
   - URL例: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### 2.2 スプレッドシートの権限設定
1. スプレッドシートを開く
2. 「共有」ボタンをクリック
3. 「リンクを知っている全員が編集可能」に設定

### 2.3 ヘッダー行の設定
スプレッドシートの最初の行に以下のヘッダーを設定：
```
タイムスタンプ | ID | 名前 | チーム | リーダー% | プレイヤー% | ペルソナA | ペルソナB | ペルソナC | ペルソナD | ペルソナE | ペルソナF | 完了日時
```

## 3. 環境変数の設定

### 3.1 ローカル開発環境
プロジェクトルートに`.env.local`ファイルを作成：
```env
VITE_SPREADSHEET_ID=your_spreadsheet_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

### 3.2 Vercel本番環境
1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Environment Variables」を選択
3. 以下の環境変数を追加：
   - `VITE_SPREADSHEET_ID`: スプレッドシートID
   - `VITE_GOOGLE_API_KEY`: Google APIキー

## 4. 動作確認

1. アプリケーションを起動
2. 右上の設定状況インジケーターを確認
   - ✅ スプレッドシートID: 正常
   - ✅ APIキー: 正常
3. 診断を実行してデータがスプレッドシートに送信されることを確認

## 5. トラブルシューティング

### 5.1 よくあるエラー

**OAuth同意画面の設定を求められる**
- APIキー方式ではOAuth同意画面は不要です
- 「後で設定」または「スキップ」を選択してAPIキー作成を続行してください

**403 Forbidden**
- APIキーが無効または制限されている
- Google Sheets APIが有効になっていない

**404 Not Found**
- スプレッドシートIDが間違っている
- スプレッドシートが存在しない

**401 Unauthorized**
- APIキーが無効
- スプレッドシートの権限設定が不適切

### 5.2 セキュリティのベストプラクティス
- APIキーは公開リポジトリにコミットしない
- APIキーには適切な制限を設定する
- 定期的にAPIキーをローテーションする

## 6. 参考リンク
- [Google Sheets API ドキュメント](https://developers.google.com/sheets/api)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Sheets](https://sheets.google.com/)
