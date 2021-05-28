docker pull yichiz5/searec

docker rm -f searec

docker run -d \
    -p 80:80 \
    --name searec \
    yichiz5/searec