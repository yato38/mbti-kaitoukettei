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
   - **アクセスできるユーザー**: 全員
4. 「デプロイ」をクリック
5. 承認を求められた場合は「許可を確認」をクリック
6. 生成されたWeb App URLをコピー

## 6. 環境変数の設定

1. プロジェクトのルートに`.env`ファイルを作成（存在しない場合）
2. 以下の内容を追加:

```env
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_WEB_APP_ID/exec
```

## 7. テスト

1. Google Apps Scriptエディタで`testAppendRow`関数を実行
2. スプレッドシートにテストデータが追加されることを確認

## 8. トラブルシューティング

### 権限エラーが発生する場合
- スプレッドシートの共有設定を確認
- Google Apps Scriptプロジェクトにスプレッドシートへのアクセス権限があることを確認

### CORSエラーが発生する場合
- Web Appの設定で「アクセスできるユーザー」が「全員」に設定されていることを確認

### データが追加されない場合
- スプレッドシートIDが正しいことを確認
- シート名が「Sheet1」であることを確認
- Google Apps Scriptのログを確認

## セキュリティに関する注意

- Web App URLは公開されるため、必要に応じて追加の認証を実装することを検討してください
- 本番環境では、より厳密なアクセス制御を実装することを推奨します
