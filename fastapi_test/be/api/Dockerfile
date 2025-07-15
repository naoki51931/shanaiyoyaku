FROM python:3.12

WORKDIR /usr/src/server

RUN pip install --upgrade pip
RUN pip install --upgrade setuptools

ADD requirements.txt .
RUN pip install -r requirements.txt

RUN apt-get update && apt-get install -y default-mysql-client


EXPOSE 8000

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]