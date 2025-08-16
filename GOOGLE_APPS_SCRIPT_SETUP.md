# Google Apps Script セットアップガイド

## 概要
このガイドでは、MBTI診断アプリケーションでGoogle Apps Scriptを使用してスプレッドシートにデータを送信するための設定方法を説明します。

## 手順

### 1. Google Apps Scriptプロジェクトの作成

1. [Google Apps Script](https://script.google.com/) にアクセス
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を「MBTI Diagnosis Spreadsheet」に変更

### 2. スプレッドシートの準備

1. [Google Sheets](https://sheets.google.com/) で新しいスプレッドシートを作成
2. スプレッドシートIDをコピー（URLの `/d/` と `/edit` の間の文字列）
3. スプレッドシートの最初のシート名を「Sheet1」に変更
4. 以下の列ヘッダーを追加（推奨）:
   - A: Timestamp
   - B: ID
   - C: Name
   - D: Team
   - E: Leader Percentage
   - F: Player Percentage
   - G: Persona A Score
   - H: Persona B Score
   - I: Persona C Score
   - J: Persona D Score
   - K: Persona E Score
   - L: Persona F Score
   - M: Persona A Percentage
   - N: Persona B Percentage
   - O: Persona C Percentage
   - P: Persona D Percentage
   - Q: Persona E Percentage
   - R: Persona F Percentage
   - S: Completed At

### 3. コードの設定

1. `google-apps-script.js` ファイルの内容をコピー
2. Google Apps Scriptエディタに貼り付け
3. `SPREADSHEET_ID` を実際のスプレッドシートIDに変更：

```javascript
const SPREADSHEET_ID = 'あなたのスプレッドシートID';
```

### 4. Web Appとしてデプロイ

1. 「デプロイ」→「新しいデプロイ」をクリック
2. 「種類の選択」で「ウェブアプリ」を選択
3. 以下の設定を行う：
   - **説明**: MBTI Diagnosis API
   - **次のユーザーとして実行**: 自分
   - **アクセスできるユーザー**: 全員（重要！）
4. 「デプロイ」をクリック
5. 承認を求められたら「許可」をクリック
6. 生成されたURLをコピー

### 5. 環境変数の設定

1. プロジェクトルートに `.env` ファイルを作成（存在しない場合）
2. 以下の内容を追加：

```env
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

`YOUR_SCRIPT_ID` を実際のスクリプトIDに置き換えてください。

## CORSエラーの解決方法

CORSエラーが発生した場合、以下の手順を試してください：

### 1. Google Apps Scriptの再デプロイ
1. Google Apps Scriptエディタで「デプロイ」→「管理デプロイ」をクリック
2. 既存のデプロイを削除
3. 新しいデプロイを作成（上記の手順4を参照）

### 2. Web App設定の確認
- 「アクセスできるユーザー」が「全員」に設定されていることを確認
- 「次のユーザーとして実行」が「自分」に設定されていることを確認

### 3. ブラウザのキャッシュクリア
1. ブラウザの開発者ツールを開く（F12）
2. ネットワークタブで「キャッシュを無効化」にチェック
3. ページを再読み込み

### 4. URLの確認
- Google Apps ScriptのURLが正しいことを確認
- URLの末尾に `/exec` が含まれていることを確認

### 5. スプレッドシートの権限確認
1. スプレッドシートを開く
2. 「共有」ボタンをクリック
3. 「リンクを知っている全員」に設定されていることを確認

## テスト方法

### 1. Google Apps Scriptでのテスト
1. Google Apps Scriptエディタで `testAppendRow` 関数を実行
2. スプレッドシートにデータが追加されることを確認

### 2. 設定確認
1. Google Apps Scriptエディタで `checkConfig` 関数を実行
2. スプレッドシートの設定が正しいことを確認

### 3. ブラウザでのテスト
1. アプリケーションを起動
2. 診断を完了
3. スプレッドシートにデータが送信されることを確認

## トラブルシューティング

### よくあるエラーと解決方法

#### CORSエラー
```
Access to fetch at '...' has been blocked by CORS policy
```
**解決方法**: Google Apps Scriptを再デプロイし、Web App設定で「アクセスできるユーザー」を「全員」に設定

#### 403エラー
```
Access denied
```
**解決方法**: Google Apps Scriptの権限設定を確認

#### 404エラー
```
Not found
```
**解決方法**: Google Apps ScriptのURLが正しいことを確認

#### スプレッドシートエラー
```
Spreadsheet not found
```
**解決方法**: スプレッドシートIDが正しいことを確認

## セキュリティに関する注意

- Google Apps ScriptのURLは公開されるため、機密情報を含めないでください
- 必要に応じて、IPアドレス制限や認証機能を追加することを検討してください
- 定期的にログを確認し、不正なアクセスがないか監視してください

## サポート

問題が解決しない場合は、以下を確認してください：

1. Google Apps Scriptの実行ログ
2. ブラウザの開発者ツールのコンソール
3. ネットワークタブでのリクエスト/レスポンス
4. スプレッドシートの共有設定
