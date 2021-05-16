# TodoApp+
## レトロゲームなスタイルのTodoアプリPWA
### フロントエンドスタック 
- パッケージマネージャー:  
  - yarn - https://classic.yarnpkg.com/lang/en/
- フレームワーク: 
  - Preact X - https://preactjs.com/
- スタイル:
  - CSS Modules - https://github.com/css-modules/css-modules/blob/master/README.md
- アプリケーションデータ管理:
  - IndexedDB - https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API
  - DexieDB - https://dexie.org/
    - useLiveQuery Hook - https://dexie.org/docs/dexie-react-hooks/useLiveQuery()
  - js-cookie - https://github.com/js-cookie/js-cookie

## CLI Commands
*   `yarn install`: デペンデンシーインストールします

*   `yarn dev`: ポート8080で開発サーバーを実行します

*   `yarn serve`: 本番サーバーを実行する

*   `yarn build`: アプリケーションをビルドする

*   `yarn lint`: eslintを使用してすべてのtypescriptファイルをリントします

*   `yarn test`: JestとEnzymeを[`enzyme-adapter-preact-pure`](https://github.com/preactjs/enzyme-adapter-preact-pure)で実行します 


 物事がどのように機能するかの詳細な説明については、[CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).
