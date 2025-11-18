# React 用 Dockerfile (最適化版)
FROM node:20

WORKDIR /usr/src/front

# 依存ファイルのみコピーして node_modules を Docker 内で生成
COPY package.json package-lock.json ./

# package.json に書かれた react-scripts を含む依存を正しくインストール
RUN npm ci

# アプリ本体をコピー
COPY . .

# 本番ビルド
RUN npm run build

EXPOSE 3000

# serve を使って build をホスト（ローカルに serve が不要）
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
