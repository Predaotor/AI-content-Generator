# Production backend Dockerfile
FROM python:3.12.0-alpine3.20 AS builder

# Install dependencies needed to build psycopg2
RUN apk add --no-cache \
    gcc \
    libpq-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && apk clean

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies with security updates
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.12.0-alpine3.20 AS runner

# Install runtime dependencies and security updates
RUN apk add --no-cache \
    libpq5 \
    curl \
    && apk upgrade --no-cache \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -r appuser && adduser -r -g appuser appuser

WORKDIR /app

# Copy Python dependencies from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY ./app .

# Set ownership
RUN chown -R appuser:appuser /app
USER appuser

# Security: Run as non-root user
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Security: Use specific user
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
