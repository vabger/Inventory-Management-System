# Generated by Django 5.1 on 2024-11-11 18:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_remove_user_date_joined'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'permissions': [('admin_access', 'Can access admin routes')]},
        ),
    ]