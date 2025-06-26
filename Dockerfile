FROM node:20-alpine

# 設置工作目錄
WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 安裝所有依賴（包括 devDependencies）
RUN npm ci

# 複製應用程式碼（僅複製 Strapi 需要的檔案）
COPY src ./src
COPY config ./config
COPY database ./database
COPY public ./public

# 複製必要的配置檔案
COPY .env* ./
COPY favicon.png ./

# 設置生產環境
ENV NODE_ENV=production

# 暴露端口
EXPOSE 1337

# 直接啟動，跳過構建步驟
CMD ["npm", "run", "develop"] 