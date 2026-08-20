FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends iputils-ping && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN pip install --no-cache-dir Flask

COPY app.py .
EXPOSE 80

CMD ["python", "app.py"]
