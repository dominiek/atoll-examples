FROM    centos:centos6
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install Atoll RPM
RUN     rpm --import https://rpm.packager.io/key
RUN     echo -e "[atoll]\nname=Repository for dominiek/atoll application.\nbaseurl=https://rpm.packager.io/gh/dominiek/atoll/centos6/master\nenabled=1" | tee /etc/yum.repos.d/atoll.repo
RUN     yum install -y atoll
RUN     /opt/atoll/bin/atoll -c /opt/atoll/atoll.yml setup --publish-api-key "docker-web-app-large"

# Install Atoll MongoDB Plugin
RUN     rpm --import https://rpm.packager.io/key
RUN     echo -e "[atoll-mongodb]\nname=Repository for dominiek/atoll-mongodb application.\nbaseurl=https://rpm.packager.io/gh/dominiek/atoll-mongodb/centos6/master\nenabled=1" | tee /etc/yum.repos.d/atoll-mongodb.repo
RUN     yum install -y atoll-mongodb
RUN     echo "plugins:" >> /opt/atoll/atoll.yml
RUN     echo "  - /opt/atoll-mongodb/bin/atoll-mongodb" >> /opt/atoll/atoll.yml

RUN     yum install -y mongodb-server mongodb
RUN     mkdir -p /data/db
EXPOSE  27017
CMD ./opt/atoll/bin/atoll -c /opt/atoll/atoll.yml -d && mongod --replSet web-app-large --smallfiles
