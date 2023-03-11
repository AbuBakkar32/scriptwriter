# Generated by Django 3.2.9 on 2023-03-08 17:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scriptwriter', '0017_comment_bg_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='experience',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='client',
            name='write',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='client',
            name='country',
            field=models.TextField(default='England', null=True),
        ),
    ]