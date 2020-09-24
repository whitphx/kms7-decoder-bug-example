FROM kurento/kurento-media-server-exp:bionic-gstreamer

# HACK: Install the latest version of entrypoint.sh because the base image contains the older version.
RUN apt-get update && apt-get install --no-install-recommends --yes \
    ca-certificates \
 && wget -q -O /entrypoint.sh https://raw.githubusercontent.com/Kurento/kurento-docker/master/kurento-media-server/entrypoint.sh \
 && chmod +x /entrypoint.sh \
 && apt-get remove -y ca-certificates \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*
