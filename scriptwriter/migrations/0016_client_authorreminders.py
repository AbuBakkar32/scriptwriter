# Generated by Django 3.2.9 on 2022-10-28 10:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scriptwriter', '0015_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='authorReminders',
            field=models.TextField(default=''),
        ),
    ]
