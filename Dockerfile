# base image
FROM node:12.4.0-slim as build

RUN apt-get update && apt-get install nginx vim -y --no-install-recommends git

# set working directory
WORKDIR /app

# commit_hash
ARG release

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV RELEASE=$release

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --production
RUN npm install @angular-builders/custom-webpack@8.4.1

# add app
COPY . /app

# generate build
RUN ng build --configuration=production --output-path=dist --source-map=false

############
### prod ###
############

# base image
FROM nginx

# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html

COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/run.sh ./

# expose port 80
EXPOSE 80

# run nginx
CMD bash run.sh