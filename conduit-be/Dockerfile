# Sử dụng Node.js 20
FROM node:20 AS builder

# Set thư mục làm việc
WORKDIR /app

# Copy package.json và yarn.lock trước
COPY package.json yarn.lock ./

# Cài đặt dependencies
RUN yarn install --frozen-lockfile --legacy-peer-deps

# Copy toàn bộ source code
COPY . .

# Copy thư mục Prisma
COPY prisma ./prisma

# 🔥 Chạy Prisma Generate trước khi build
RUN npx prisma generate --schema=prisma/schema.prisma

# Build ứng dụng
RUN yarn build

# Chạy môi trường production
FROM node:20 AS runner
WORKDIR /app

# Thiết lập biến môi trường
ENV NODE_ENV=production

#  Sửa lại đường dẫn để đảm bảo tất cả file cần thiết được copy
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/prisma ./prisma 
COPY --from=builder /app/node_modules ./node_modules 

# Expose port
EXPOSE 3000
#  Cấu hình lại CMD để chạy chính xác
CMD ["node", "dist/apps/main-service/apps/main-service/src/main.js"]
