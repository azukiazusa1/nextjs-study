# ポモドーロ・セッション

<p align="center">
  <img src="./docs/images/logo_transparent.png" alt="Pomodoro Session" width="400" height="400">
</p>

ポモドーロ・セッションは最大 4 人でランダムに集まり、ポモドーロ・テクニックをみんなで実践するサービスです。

https://pomodoro-session.vercel.app/

## プロジェクトの構成

このプロジェクトは [Turborepo](https://turborepo.org/) + [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces/) によるモノレポ構成となっています。

|                          | 概要                                         |
| ------------------------ | -------------------------------------------- |
| `docs`                   | プロジェクトに関するドキュメントを配置する   |
| `apps`                   |                                              |
| ├ `api`                  | バックエンドのアプリケーション               |
| └ `web`                  | フロントエンドのアプリケーション             |
| `packages`               |                                              |
| ├ `models`               | フロントエンドとバックエンドで共通する型定義 |
| ├ `eslint-config-custom` | `eslint` の設定ファイル                      |
| └ `tsconfig`             | `tsconfig.json`                              |

## 開発環境の構築

### Requirement

このプロジェクトは [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces/) を使用しているため、以下の環境が必要です

|         | バージョン |
| ------- | ---------- |
| Node.js | 16.x       |
| npm     | 8.x        |

Node.js のバージョン管理には [Volta](https://volta.sh/) を使用することを推奨します。このプロジェクトでは Node.js のバージョンが Volta によりピン留めされているので、このプロジェクトに移動すると自動で適切なバージョンの Node.js をインストールします。

#### Install

```sh
$ npm run install
```

#### Setting up a local environment

始めに下記コマンドで Redis を起動します。

```sh
$ docker compose up -d
```

続いて以下コマンドで全てのアプリケーション、パッケージを起動します。

```sh
$ npm run dev
```

#### Test

```sh
$ npm run test
```

#### Build

```sh
$ npm run build
```

#### Other commands

##### 特定のワークスペースのみコマンドを実行したい場合

プロジェクトルートで `-w` オプションによりワークスペースを指定して実行します。

（例：`web` ワークスペースのみで `storybook` を起動する）

```sh
$ npm run storybook -w apps/web
```

##### 特定のワークスペースのみにパッケージをインストールしたい場合、

プロジェクトルートで `-w` オプションによりワークスペースを指定して実行します。

（例：`api` ワークスペースのみに `lodash` をインストールする）

```sh
$ npm install -w apps/api lodash
```

### Documents

[Documents](./docs/README.md)
