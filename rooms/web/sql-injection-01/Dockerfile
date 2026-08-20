FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

ENV FLAG="HC{sql_injection_union_select_admin_pwned}"
EXPOSE 80

CMD ["python", "app.py"]
