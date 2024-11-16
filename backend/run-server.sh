python manage.py makemigrations
python manage.py migrate

sudo systemctl start redis

celery -A backend worker --loglevel=info &

python manage.py runserver