# Google Apps Script設定手順

このドキュメントでは、MBTI診断アプリからスプレッドシートにデータを送信するためのGoogle Apps Scriptの設定方法を説明します。

## 1. Google Apps Scriptプロジェクトの作成

1. [Google Apps Script](https://script.google.com/)にアクセス
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を「MBTI Spreadsheet Service」などに変更

## 2. スクリプトコードの追加

1. `google-apps-script.js`ファイルの内容をコピー
2. Google Apps Scriptエディタに貼り付け
3. `SPREADSHEET_ID`を実際のスプレッドシートIDに変更

```javascript
const SPREADSHEET_ID = 'your_actual_spreadsheet_id_here';
```

## 3. スプレッドシートIDの取得

1. 対象のGoogleスプレッドシートを開く
2. URLからスプレッドシートIDをコピー
   - URL形式: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - 例: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`

## 4. スプレッドシートの準備

1. スプレッドシートに「Sheet1」という名前のシートがあることを確認
2. 以下の列ヘッダーを追加（推奨）:
   - A: Timestamp
   - B: ID
   - C: Name
   - D: Team
   - E: Leader Percentage
   - F: Player Percentage
   - G: Persona A
   - H: Persona B
   - I: Persona C
   - J: Persona D
   - K: Persona E
   - L: Persona F
   - M: Completed At

## 5. Web Appとしてデプロイ

1. 「デプロイ」→「新しいデプロイ」をクリック
2. 「種類の選択」で「ウェブアプリ」を選択
3. 以下の設定を行う:
   - **説明**: MBTI Spreadsheet Service
   - **次のユーザーとして実行**: 自分
   - **アクセスできるユーザー**: 全員（重要！）
4. 「デプロイ」をクリック
5. 承認を求められた場合は「許可を確認」をクリック
6. 生成されたWeb App URLをコピー

## 6. 環境変数の設定

### ローカル開発の場合
1. プロジェクトのルートに`.env`ファイルを作成
2. 以下の内容を追加:

```env
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_WEB_APP_ID/exec
```

### Vercelデプロイの場合
1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Environment Variables」を選択
3. 以下の環境変数を追加:
   - **Name**: `VITE_GOOGLE_APPS_SCRIPT_URL`
   - **Value**: `https://script.google.com/macros/s/YOUR_WEB_APP_ID/exec`
   - **Environment**: Production, Preview, Development すべてにチェック
4. 「Save」をクリック
5. 必要に応じて再デプロイを実行

## 7. テスト

1. Google Apps Scriptエディタで`testAppendRow`関数を実行
2. スプレッドシートにテストデータが追加されることを確認
3. `checkConfig`関数を実行して設定を確認

## 8. トラブルシューティング

### CORSエラーが発生する場合

**症状**: ブラウザのコンソールに以下のエラーが表示される
```
Access to fetch at 'https://script.google.com/...' from origin 'https://your-domain.com' has been blocked by CORS policy
```

**解決方法**:

1. **Google Apps Scriptの再デプロイ**
   - Google Apps Scriptエディタで「デプロイ」→「管理デプロイ」を選択
   - 既存のデプロイを削除
   - 「新しいデプロイ」で再作成
   - 「アクセスできるユーザー」を必ず「全員」に設定

2. **Web App設定の確認**
   - 「次のユーザーとして実行」が「自分」に設定されているか確認
   - 「アクセスできるユーザー」が「全員」に設定されているか確認

3. **ブラウザのキャッシュクリア**
   - ブラウザの開発者ツール（F12）を開く
   - 右クリック→「空にする」→「すべて」を選択
   - ページを再読み込み

4. **環境変数の確認**
   - Vercelダッシュボードで環境変数が正しく設定されているか確認
   - 環境変数変更後は再デプロイが必要

### 権限エラーが発生する場合

**症状**: 403エラーや権限不足のエラーが表示される

**解決方法**:
- スプレッドシートの共有設定を確認
- Google Apps Scriptプロジェクトにスプレッドシートへのアクセス権限があることを確認
- スプレッドシートIDが正しいことを確認

### データが追加されない場合

**症状**: エラーは出ないが、スプレッドシートにデータが追加されない

**解決方法**:
- スプレッドシートIDが正しいことを確認
- シート名が「Sheet1」であることを確認
- Google Apps Scriptのログを確認（「実行」→「実行ログを表示」）

### 404エラーが発生する場合

**症状**: Google Apps Scriptが見つからないエラー

**解決方法**:
- Web App URLが正しいか確認
- デプロイが正常に完了しているか確認
- URLの末尾に`/exec`が付いているか確認

### ネットワークエラーが発生する場合

**症状**: "Failed to fetch"エラーが表示される

**解決方法**:
- インターネット接続を確認
- Google Apps Scriptが停止していないか確認
- URLが正しいか確認

## 9. デバッグ方法

### Google Apps Scriptのログ確認
1. Google Apps Scriptエディタで「実行」→「実行ログを表示」を選択
2. エラーメッセージや処理状況を確認

### ブラウザの開発者ツール
1. F12キーで開発者ツールを開く
2. 「Console」タブでエラーメッセージを確認
3. 「Network」タブでリクエスト/レスポンスを確認

### アプリ内の設定状況確認
1. 診断結果画面で「設定状況を表示」をクリック
2. 接続状態や設定情報を確認

## セキュリティに関する注意

- Web App URLは公開されるため、必要に応じて追加の認証を実装することを検討してください
- 本番環境では、より厳密なアクセス制御を実装することを推奨します
- スプレッドシートの共有設定は必要最小限にしてください

## よくある質問

**Q: 環境変数を変更したのに反映されない**
A: Vercelの場合、環境変数変更後は再デプロイが必要です。

**Q: ローカルでは動作するが、デプロイ後は動作しない**
A: 環境変数がVercelに正しく設定されているか確認してください。

**Q: CORSエラーが解決しない**
A: Google Apps Scriptを完全に再デプロイし、ブラウザのキャッシュをクリアしてください。
