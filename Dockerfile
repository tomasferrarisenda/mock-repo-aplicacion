# Stage 0, "dev-stage", based on Node.js, to build and compile AngularJS
FROM node:8.11.3 as dev-stage

# Load the volume on container
VOLUME  ["/bindmount"]
WORKDIR /bindmount

# See https://crbug.com/795759
RUN apt-get update && apt-get install -yq libgconf-2-4

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update && apt-get install -y wget --no-install-recommends \
	&& wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
	&& sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
	&& apt-get update \
	&& apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
	--no-install-recommends \
	&& rm -rf /var/lib/apt/lists/* \
	&& apt-get purge --auto-remove -y curl \
	&& rm -rf /src/*.deb

#install project dependencies
RUN npm install grunt grunt-cli --global
RUN npm install bower --global
# RUN npm rebuild node-sass --force
RUN npm install webpack@3.6 --global
RUN npm install webpack-dev-server@2.11 --global

# Fix for bower
RUN echo '{ "allow_root": true }' > /root/.bowerrc

# Exposing the port of webpack
EXPOSE 8888

# Install project dependencies when container starts if there is not arguments
CMD npm install && npm start