FROM python:3.12

WORKDIR /usr/src/server

# 必要なシステムパッケージをインストール
RUN apt-get update && apt-get install -y \
    default-mysql-client \
    libmariadb-dev-compat \
    libmariadb-dev \
    build-essential \
    gcc \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# pip を最新化
RUN pip install --upgrade pip setuptools wheel

# requirements.txt をコピーしてインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# プロジェクト全体をコピー
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

