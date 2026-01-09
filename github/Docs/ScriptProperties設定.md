# ScriptProperties設定ガイド

このシステムは機密情報をGoogle Apps ScriptのScriptPropertiesに保存します。以下の手順で設定してください。

## 設定方法

### 1. Google Apps Scriptエディタで設定関数を実行

以下の関数を実行して、必要な機密情報をScriptPropertiesに設定します：

```javascript
/**
 * ScriptPropertiesに機密情報を設定する関数
 * この関数は初回セットアップ時に1回だけ実行してください
 */
function setupScriptProperties() {
  const properties = PropertiesService.getScriptProperties();
  
  // Slack Webhook URL（一般チャンネル）
  // TODO: 実際のWebhook URLに置き換えてください
  properties.setProperty('SLACK_WEBHOOK_URL', 'YOUR_SLACK_WEBHOOK_URL_HERE');
  
  // Slack Webhook URL（管理者チャンネル）
  // TODO: 実際のWebhook URLに置き換えてください
  properties.setProperty('SLACK_WEBHOOK_URL_ADMIN', 'YOUR_SLACK_WEBHOOK_URL_ADMIN_HERE');
  
  // Slack Webhook URL（ドライブ保管通知）
  // TODO: 実際のWebhook URLに置き換えてください
  properties.setProperty('SLACK_WEBHOOK_DRIVE_STORAGE', 'YOUR_SLACK_WEBHOOK_DRIVE_STORAGE_HERE');
  
  // GoogleフォームID
  // TODO: 実際のフォームIDに置き換えてください
  properties.setProperty('FORM_ID', 'YOUR_FORM_ID_HERE');
  
  // Slack API Token（Slack一覧出力で使用）
  // TODO: 実際のOAuth Tokenに置き換えてください
  properties.setProperty('SLACK_API_TOKEN', 'YOUR_SLACK_API_TOKEN_HERE');
  
  Logger.log('ScriptPropertiesの設定が完了しました。');
}
```

### 2. 実行手順

1. Google Apps Scriptエディタを開く
2. 上記の`setupScriptProperties`関数を新しいファイル（例: `設定.gs`）に追加
3. 関数を選択して実行
4. 初回実行時は権限の承認が必要です（「権限を確認」→「詳細」→「chatgptに移動（安全ではないページ）」）
5. 実行が完了したら、設定ファイルは削除して構いません

### 3. 設定値の確認

以下の関数で設定値を確認できます：

```javascript
function checkScriptProperties() {
  const properties = PropertiesService.getScriptProperties();
  const keys = ['SLACK_WEBHOOK_URL', 'SLACK_WEBHOOK_URL_ADMIN', 'SLACK_WEBHOOK_DRIVE_STORAGE', 'FORM_ID', 'SLACK_API_TOKEN'];
  
  keys.forEach(key => {
    const value = properties.getProperty(key);
    Logger.log(`${key}: ${value ? '設定済み' : '未設定'}`);
  });
}
```

## 設定が必要な項目

| 項目名 | 説明 | 使用ファイル |
|--------|------|------------|
| `SLACK_WEBHOOK_URL` | Slack一般チャンネルのWebhook URL | 提出状況通知 |
| `SLACK_WEBHOOK_URL_ADMIN` | Slack管理者チャンネルのWebhook URL | 提出状況通知, 提出状況 |
| `SLACK_WEBHOOK_DRIVE_STORAGE` | Slackドライブ保管通知のWebhook URL | 提出状況通知 |
| `FORM_ID` | GoogleフォームのID | 提出状況通知 |
| `SLACK_API_TOKEN` | Slack APIのOAuth Token | Slack一覧出力 |

## 注意事項

⚠️ **機密情報の取り扱い**
- ScriptPropertiesに保存された情報は、スクリプトを実行できるユーザーのみがアクセス可能です
- スクリプトの共有時は、権限管理に注意してください
- 値の変更や削除はGoogle Apps Scriptエディタから行えます

## トラブルシューティング

### エラー: プロパティが未設定です

ScriptPropertiesが正しく設定されていない場合、各機能が正常に動作しません。`setupScriptProperties`関数を実行して設定を確認してください。

### 値を更新したい場合

`setupScriptProperties`関数を再実行するか、以下のように個別に更新できます：

```javascript
PropertiesService.getScriptProperties().setProperty('SLACK_WEBHOOK_URL', '新しい値');
```

### 値を削除したい場合

```javascript
PropertiesService.getScriptProperties().deleteProperty('SLACK_WEBHOOK_URL');
```

