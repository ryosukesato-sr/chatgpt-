/**
 * Googleフォーム送信時に実行される関数
 * 領収書ファイルを指定のフォルダに整理し、ファイル名を変更します。
 */
function organizeSubmittedReceipt(e) {
  Logger.log(JSON.stringify(e));
  try {
    // スプレッドシートへの参照は残しますが、ヘッダーチェックや書き込みは行いません
    const sheet = e.range.getSheet(); 
    const formData = e.namedValues;

    const submitterName = formData['氏名'] ? formData['氏名'][0] : null;
    const submissionMonthString = formData['提出対象月'] ? formData['提出対象月'][0] : null;
    const uploadedFileLinks = formData['領収書ファイル'];

    if (!submitterName || !submissionMonthString || !uploadedFileLinks || uploadedFileLinks.length === 0) {
      Logger.log('エラー: 氏名、提出対象月、または領収書ファイルがフォームの回答に含まれていません。');
      return;
    }
    const fileUrl = uploadedFileLinks[0];
    const fileIdMatch = fileUrl.match(/id=([^&]+)/);
    if (!fileIdMatch || !fileIdMatch[1]) {
      Logger.log('エラー: アップロードされたファイルのURLからファイルIDを抽出できませんでした。URL: ' + fileUrl);
      return;
    }
    const uploadedFileId = fileIdMatch[1];

    const match = submissionMonthString.match(/(\d{4})年\s*(\d{1,2})月/);
    if (!match) {
      Logger.log(`エラー: '提出対象月' の形式が不正です。期待する形式: "YYYY年M月" (例: "2025年5月")。入力値: ${submissionMonthString}`);
      return;
    }
    const year = match[1];
    const month = ('0' + match[2]).slice(-2);

    const folderNameYYYY_MM = `${year}_${month}`; // 例: 2025_05
    const fileNameYYYYMM = `${year}${month}`;   // 例: 202505

    const file = DriveApp.getFileById(uploadedFileId);
    const originalFileName = file.getName();
    const newFileName = `CHATGPT_${submitterName}_${fileNameYYYYMM}.pdf`;

    // --- ★変更箇所 (IDがCHATGPTフォルダ自体を指す場合)★ ---
    const CHATGPT_FOLDER_ID_IN_SHARED_DRIVE = '1MapqE-pcIRZfdoKmsKGWI3jWDqiXinzU'; // ★ご指定のID (CHATGPTフォルダのID)★
    let chatGptFolderInSharedDrive;
    try {
      chatGptFolderInSharedDrive = DriveApp.getFolderById(CHATGPT_FOLDER_ID_IN_SHARED_DRIVE);
      Logger.log(`指定されたCHATGPTフォルダ '${chatGptFolderInSharedDrive.getName()}' を取得しました。`);
    } catch (err) {
      Logger.log(`エラー: 指定されたCHATGPTフォルダID '${CHATGPT_FOLDER_ID_IN_SHARED_DRIVE}' が見つからないか、アクセスできませんでした。詳細: ${err.toString()}`);
      return;
    }
    
    // CHATGPTフォルダ（取得済み）の中に 'YYYY_MM' (月別) フォルダを作成/取得
    let targetFolder = getOrCreateFolder(chatGptFolderInSharedDrive, folderNameYYYY_MM);
    // --- ★変更箇所ここまで★ ---

    file.moveTo(targetFolder).setName(newFileName);
    Logger.log(`ファイル '${originalFileName}' を '${targetFolder.getName()}' (${targetFolder.getId()}) 内の '${newFileName}' に移動・リネームしました。`);

    // スプレッドシートへのステータス更新処理は削除されました

  } catch (error) {
    Logger.log(`エラーが発生しました: ${error.toString()}\nスタックトレース: ${error.stack}`);
    // エラー発生時のスプレッドシートへの書き込み処理も削除されました
  }
}


// --- 以下のヘルパー関数 (getOrCreateFolder) は変更なし ---
/**
 * 指定された親フォルダ内に指定された名前のフォルダを取得、なければ作成するヘルパー関数
 * @param {GoogleAppsScript.Drive.Folder} parentFolder 親フォルダオブジェクト
 * @param {string} folderName 作成または取得するフォルダ名
 * @return {GoogleAppsScript.Drive.Folder} 取得または作成されたフォルダオブジェクト
 */
function getOrCreateFolder(parentFolder, folderName) {
  let folderIterator = parentFolder.getFoldersByName(folderName);
  if (folderIterator.hasNext()) {
    return folderIterator.next();
  } else {
    Logger.log(`フォルダ '${folderName}' を '${parentFolder.getName()}' 内に作成しました。`);
    return parentFolder.createFolder(folderName);
  }
}