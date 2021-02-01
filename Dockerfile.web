# 使用 Node 的版本
FROM node:12.18.3-stretch

# Node 環境設定為 production
ENV NODE_ENV development
RUN yarn global add @vue/cli
RUN vue --version

# Node 在容器內的位置
WORKDIR /usr/src/app

# 複製網站內容程式碼
COPY app /usr/src/app
# Project setup & Build (Production mode)
RUN yarn install && \
    yarn build

# 開放對外的 port
EXPOSE 3000

# 執行專案
# Run express server (Production mode)
CMD yarn express:run
