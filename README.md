# ChatGPT領収書提出管理システム

Google Apps Scriptを使用したChatGPT利用に関する領収書の提出・管理を自動化するシステムです。

## 機能概要

- Googleフォームによる領収書提出の受付
- Googleスプレッドシートによる提出状況の管理
- Slack連携による自動通知・リマインド
- Googleドライブへの自動ファイル整理
- フォームの提出対象月の自動更新

## システム構成

詳細は [Docs/システム要件書.md](Docs/システム要件書.md) を参照してください。

## 主要機能

### 1. 提出状況管理 (`提出状況`)
- フォーム送信時にスプレッドシートを自動更新
- 提出状況に応じたSlack通知

### 2. 自動通知機能 (`提出状況通知`)
- 毎月20日に提出依頼通知
- 過去の未完了月へのリマインド
- 完了通知とフォーム自動更新

### 3. ファイル管理 (`フォーム送信保存場所指定.gs`)
- 提出された領収書ファイルの自動整理
- 月別フォルダへの自動振り分けとリネーム

### 4. 新規ユーザー登録 (`新規追加`)
- 新規登録時の過去月への「未加入」自動入力

### 5. ユーザー情報取得
- `Slack一覧出力`: Slackユーザー一覧の取得
- `Googleユーザー`: Google Workspaceユーザー一覧の取得

## セットアップ

### 1. ScriptPropertiesの設定（必須）

このシステムは機密情報をGoogle Apps ScriptのScriptPropertiesに保存します。
初回セットアップ時は、必ず以下の手順を実行してください：

1. Google Apps Scriptエディタを開く
2. [Docs/ScriptProperties設定.md](Docs/ScriptProperties設定.md) を参照
3. `setupScriptProperties`関数を実行して、必要な機密情報を設定

**設定が必要な項目:**
- `SLACK_WEBHOOK_URL`: Slack一般チャンネルのWebhook URL
- `SLACK_WEBHOOK_URL_ADMIN`: Slack管理者チャンネルのWebhook URL
- `SLACK_WEBHOOK_DRIVE_STORAGE`: Slackドライブ保管通知のWebhook URL
- `FORM_ID`: GoogleフォームのID
- `SLACK_API_TOKEN`: Slack APIのOAuth Token

詳細は [Docs/ScriptProperties設定.md](Docs/ScriptProperties設定.md) を参照してください。

### 2. 必要な権限
- Google Workspace管理者権限（ユーザー一覧取得時）
- Slack API権限（ユーザー一覧取得時）
- Googleドライブへのアクセス権限

### 3. トリガー設定
- `onEdit`: スプレッドシート編集時（自動）
- `recordSubmissionStatusBasedOnActualLayout`: フォーム送信時
- `organizeSubmittedReceipt`: フォーム送信時
- `notifyReceiptStatusWithSummary`: 日次実行（推奨: 毎朝9時）

## 注意事項

⚠️ **機密情報の取り扱い**
- このリポジトリには機密情報（Slack Webhook URL、OAuth Token等）は含まれていません
- すべての機密情報はGoogle Apps ScriptのScriptPropertiesに保存されます
- ScriptPropertiesの設定は初回セットアップ時に必ず行ってください

## ライセンス

内部利用専用

