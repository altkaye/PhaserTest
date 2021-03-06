var writeToLocal = function(filename, content) {
    var ua = navigator.userAgent.toLowerCase();
    try {
        if (ua.indexOf('firefox') != -1) {  // Firefox
            filename = (ua.indexOf('windows') != -1 ? 'C:\\tmp\\' : '/tmp/') + filename;
            // ローカルファイルにアクセスする権限を取得
            // fileスキームじゃない場合は about:config で
            // signed.applets.codebase_principal_support を true にする必要あり;
            netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
            // ファイルコンポーネントの取得＋ローカルファイル操作用のインターフェイスの取得;
            var file = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
            file.initWithPath(filename);
            var fileStream = Components
                .classes['@mozilla.org/network/file-output-stream;1']
                .createInstance(Components.interfaces.nsIFileOutputStream);
            // ファイルが存在しない場合は664の権限で新規作成して書き込み権限で開く
            // cf. https://developer.mozilla.org/en/NsIFileOutputStream
            //     http://www.oxymoronical.com/experiments/apidocs/interface/nsIFileOutputStream;
            fileStream.init(file,
                0x02 | 0x08,  // 0x01: 読み取り専用, 0x02: 書き込み, 0x03: 読み書き, 0x08: 新規作成, 0x10: 追記
                0664,         // mode
                0             // 第4引数は現在サポートしていないとか
            );
            // cf. http://www.oxymoronical.com/experiments/apidocs/interface/nsIConverterOutputStream
            var converterStream = Components
                .classes['@mozilla.org/intl/converter-output-stream;1']
                .createInstance(Components.interfaces.nsIConverterOutputStream);
            converterStream.init(fileStream, 'UTF-8', content.length,
                Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
            converterStream.writeString(content);
            converterStream.close();
            fileStream.close();
            alert('書き込みが完了しました！');
        } else if (ua.indexOf('chrome') != -1) {  // Google Chrome
            // 起動オプションに --unlimited-quota-for-files --allow-file-access-from-files をつける必要あり
            function errorCallback(e) {
                alert('Error: ' + e.code);
            }
            function fsCallback(fs) {
                fs.root.getFile(filename, { create: true }, function(fileEntry) {
                    fileEntry.createWriter(function(fileWriter) {
                        fileWriter.onwriteend = function(e) {
                            alert('書き込みが完了しました！');
                        };
                        fileWriter.onerror = function(e) {
                            alert('Failed: ' + e);
                        };
                        var bb = new WebKitBlobBuilder();
                        bb.append(content);
                        var output = bb.getBlob('text/plain');
                        fileWriter.write(output);
                    }, errorCallback);
                }, errorCallback);
            }
            // 現時点ではたぶん第1引数はPERSISTENTもTEMPORARYディレクトリ名が異なるだけだし、
            // 第2引数は極端な話0でもOK
            webkitRequestFileSystem(PERSISTENT, 1024, fsCallback, errorCallback);
        } else if (ua.indexOf('msie')) {  // MS IE
            filename = 'C:\\tmp\\' + filename;
            // インターネットオプションで「スクリプトを実行しても安全だとマークされていない
            // ActiveX コントロールの初期化とスクリプトの実行（セキュリティで保護されていない）」
            // を有効にする必要あり
            var fso = new ActiveXObject('Scripting.FileSystemObject');
            // ファイルを新規作成して書き込みモードで開く (文字コードはUTF-16)
            // cf. http://msdn.microsoft.com/ja-jp/library/cc428044.aspx
            //     http://msdn.microsoft.com/ja-jp/library/cc428042.aspx
            var file = fso.OpenTextFile(filename,
                2,     // 1: 読み取り専用, 2: 書き込み, 8: 追記
                true,  // ファイルが存在しなければ新規作成するかどうか
                -1     // -2: OSのデフォルト文字コード, -1: UTF-16, 0: ASCII
            );
            file.Write(content);
            file.Close();
            alert('書き込みが完了しました！');
            /*
             * ADODB.Stream を使う場合（レジストリをいじっても何故か書き込めない・・・）
             */
            // var adodbStream = new ActiveXObject('ADODB.Stream');
            // adodbStream.type = 2;  // テキストファイル（バイナリは1）
            // adodbStream.charset = 'UTF-8';
            // adodbStream.open(filename);
            // adodbStream.writeText(content);
            // adodbStream.saveToFile(filename, 2);  // 上書き保存（1だと新規作成のみが対象）
            // adodbStream.close();
        } else {
            alert('エラー: ローカルファイルへの書き込み方がわかりません・・・');
        }
    } catch (e) {
        alert('Error: ' + e);
    }
}