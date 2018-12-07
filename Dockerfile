FROM ruby:2.5.1
MAINTAINER Simao Belchior <simao.belchior@vizzuality.com>

ENV NAME=cw-indonesia
ENV RAKE_ENV=production
ENV RAILS_ENV=production
ENV COUNTRY_ISO=IDN
ENV CW_API_URL="https://www.climatewatchdata.org/api/v1"
ENV API_URL="/api/v1"
ENV S3_BUCKET_NAME="wri-sites"

# Install dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/* \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs build-essential patch zlib1g-dev liblzma-dev libicu-dev \
    && npm install -g yarn

# Create app directory
RUN mkdir -p /opt/$NAME
WORKDIR /opt/$NAME

# Install app dependencies
COPY . /opt/$NAME/

RUN gem install bundler --no-ri --no-rdoc
RUN cd /opt/$NAME && bundle install --jobs 4 --deployment

# Env variables
ARG secretKey
ENV SECRET_KEY_BASE $secretKey

EXPOSE 3000

# Rails assets compile
RUN bundle exec rake assets:precompile

# Start app
ENTRYPOINT ["./entrypoint.sh"]
