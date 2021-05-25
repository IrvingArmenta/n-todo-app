# TodoApp+
## レトロゲームなスタイルのTodoアプリPWA
### フロントエンドスタック 
- パッケージマネージャー:  
  - yarn - https://classic.yarnpkg.com/lang/en/
- フレームワーク: 
  - Preact X - https://preactjs.com/
- スタイル:
  - CSS Modules - https://github.com/css-modules/css-modules/blob/master/README.md
- アニメーション
  - animejs - https://animejs.com/
  - react-transition-group - https://reactcommunity.org/react-transition-group/
- アプリケーションデータ管理:
  - IndexedDB - https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API
  - DexieDB - https://dexie.org/
    - useLiveQuery Hook - https://dexie.org/docs/dexie-react-hooks/useLiveQuery()
  - js-cookie - https://github.com/js-cookie/js-cookie
## 開発のための指示
<span style="color: red;">**NOTE**</span>: このガイドは、 `node`と` yarn`がローカルにインストールされていることを前提としています
```
 yarn v1.22.10
 node v14.15.5
```
--- 
1 - リポジトリのクローンを作成（またはダウンロード）
```bash
$ git clone git@github.com:IrvingArmenta/n-todo-app.git
```
2 - フォルダに移動します
```bash
$ cd ./n-todo-app
```
3 - 依存関係をインストールする (yarn）
```bash
$ yarn install
```
4 - `yarn dev`を実行し、開発環境` [localhost：3000] `を開きます
```bash
$ yarn dev 
```
ハッピーコーディング！

その他の利用可能なスクリプトについては、以下を参照してください:
## CLI Commands
*   `yarn install`: デペンデンシーインストールします

*   `yarn dev`: ポート8080で開発サーバーを実行します

*   `yarn serve`: 本番サーバーを実行する

*   `yarn build`: アプリケーションをビルドする

*   `yarn lint`: eslintを使用してすべてのtypescriptファイルをリントします

*   `yarn test`: JestとEnzymeを[`enzyme-adapter-preact-pure`](https://github.com/preactjs/enzyme-adapter-preact-pure)で実行します 


 物事がどのように機能するかの詳細な説明については、[CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).

デプロイ URL:  
https://n-todo-app.vercel.app/