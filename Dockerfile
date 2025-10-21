# Stage 1: ติดตั้ง Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Stage 2: Build โปรเจกต์
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# สั่งให้ Prisma สร้าง Client ตอน Build
RUN npx prisma generate

RUN npm run build

# Stage 3: Production Image (ไฟล์เล็ก)
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy ไฟล์ที่จำเป็นจาก Stage 'builder'
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy schema ของ Prisma ไปด้วย
COPY --from=builder /app/prisma ./prisma

# <-- เพิ่มบรรทัดนี้เพื่อให้ runtime ของ Prisma อยู่ใน runner image
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]