# Dockerfile


FROM debian:jessie

RUN export DEBIAN_FRONTEND=noninteractive \
 && apt-get -q update \
 && apt-get -qy --no-install-recommends install python3 python3-pip \
 && rm -rf /var/lib/apt/lists/*

EXPOSE 6543

ENV CELERY_BROKER_URL=amqp://guest@rabbit

WORKDIR /opt/service
CMD ["./run.sh"]
COPY run.sh run.sh

COPY config.ini config.ini

COPY requirements.txt /tmp/requirements.txt
RUN export DEBIAN_FRONTEND=noninteractive \
 && pip3 install -q -r /tmp/requirements.txt

COPY . /tmp/build
RUN export DEBIAN_FRONTEND=noninteractive \
 && pip3 install -q /tmp/build \
 && rm -rf /tmp/build


# EOF
