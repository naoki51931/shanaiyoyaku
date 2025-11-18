# fe/front/Dockerfile
FROM node:20

WORKDIR /usr/src/front

# 依存関係インストール
COPY package*.json ./
RUN npm ci

# ソースをコピー
COPY . .

# ここでは build だけ準備しておく
# （実際に /usr/src/front/build → volume に見えるのはコンテナ起動後）
RUN npm run build

# front コンテナ単体ではサーバを立てないので、単に生かしておくだけ
CMD ["sh", "-c", "echo 'front image ready (build済み)' && tail -f /dev/null"]

