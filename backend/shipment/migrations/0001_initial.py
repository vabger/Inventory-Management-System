# Generated by Django 5.1 on 2024-11-26 15:10

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Shipment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('type', models.CharField(choices=[('Inbound', 'Inbound'), ('Outbound', 'Outbound')], max_length=10)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Assigned', 'Assigned'), ('In Progress', 'In Progress'), ('Completed', 'Completed')], default='Pending', max_length=15)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='ShipmentItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField()),
            ],
        ),
    ]