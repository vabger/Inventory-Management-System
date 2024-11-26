python manage.py makemigrations
python manage.py migrate

sudo systemctl start redis

celery -A backend worker --loglevel=info & > /dev/null

python manage.py runserver localhost:8000
