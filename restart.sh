#!/bin/bash
/home/$USER/primerjalnik-cen-venv/bin/uwsgi --stop /home/$USER/primerjalnik-cen.pid

/home/$USER/primerjalnik-cen-venv/bin/uwsgi -s /home/$USER/primerjalnik-cen.sock --manage-script-name --workers 4 --pidfile /home/$USER/primerjalnik-cen.pid --master --daemonize /var/log/primerjalnik-cen/daemon.log --mount /=web:app  --virtualenv /home/$USER/primerjalnik-cen-venv/ -H /home/$USER/primerjalnik-cen-venv/