# Generated by Django 2.2.1 on 2022-03-05 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scriptwriter', '0004_miniscript_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='notepad',
            name='userID',
            field=models.TextField(default=''),
        ),
    ]
