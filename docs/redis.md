# Redis 設計書

## Redis の使用目的

以下の目的で Redis を使用する。

- Pub/Sub 機能を用いて Websocketの通信情報を複数のサーバー間で同期させる
- セッションデータとして部屋情報・参加者情報を保存する

## Redis のキー一覧

| 論理名 | 物理名 | データ型 | 概要 | 値例 | 有効期限 | 
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| 参加者の所属部屋 | `participant:${participantId}:room` | `String` | 参加者の所属する部屋 ID を保存する。参加者が所属する部屋がない場合、空文字(`""`)を返す | `"7AIh-8PYceM35hSuAABR"` | |
| 参加者 | `participant:${participantId}` | `Hash` | 参加者の情報を保存する | `"7AIh-8PYceM35hSuAABR"` | |
| ├ 名前 | `username` | `Hash`（子） | 参加者が入力したの名前 | `"ユーザー1"` | |
| ├ アバター | `avatar` | `Hash`（子） | 参加者が選択したアバターのID | `"1"` | |
| └ スコア | `score` | `Hash`（子） | 参加者が獲得したスコア | `"12"` | |
| 部屋 | `room:${roomId}` | `Hash` | 部屋の情報を保存する |　| |
| ├ 作成日時（ミリ秒） | `createdAt` | `Hash`（子） | 部屋が作成された日時（ミリ秒）。 | `"1653056191155"` | |
| 部屋の参加者一覧 | `room:${roomId}:paticipants` | `Set` | 部屋に所属している参加者のIDの一覧。最大4人まで | `["7AIh-8PYceM35hSuAABR", "yTI7SzuAtqF38nf6AABL"]` | |
| 参加可能な部屋一覧 | `availableRooms` | `Set` | 参加可能な部屋（=参加者が4人未満の部屋）の部屋IDの一覧を保存する | `["P0lBFUiAENhohswoy7Zx9", "M2n0QUI3_9R5_yNBeZ14T"]` | |

