FROM python:3.13
WORKDIR /usr/src/app
EXPOSE 8000
COPY requirements.txt .
RUN pip install -qr requirements.txt
COPY server.py .
COPY server_bye.py .
ENTRYPOINT [ "python3" ]
CMD ["./server.py"]



USER nobody