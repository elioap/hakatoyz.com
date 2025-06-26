FROM node:20-alpine

# 設置工作目錄
WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production

# 複製應用程式碼
COPY . .

# 建置 Strapi
RUN npm run build

# 暴露端口
EXPOSE 1337

# 啟動命令
CMD ["npm", "start"] 