
# http://askubuntu.com/a/227513
locale-gen en_US en_US.UTF-8 fi_FI fi_FI.UTF-8
dpkg-reconfigure locales

apt-get update
apt-get install -y git nodejs npm

# In ubuntu node executable is installed as nodejs.
# Renaming it to node.
ln -s /usr/bin/nodejs /usr/bin/node

# Installing Heroku toolbelt
wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh

