# Generated by Django 2.2.1 on 2022-05-31 12:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scriptwriter', '0010_transaction_plan'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscription',
            name='plan',
            field=models.TextField(default=''),
        ),
    ]