# Generated by Django 2.2.1 on 2022-05-29 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scriptwriter', '0008_auto_20220314_1313'),
    ]

    operations = [
        migrations.CreateModel(
            name='AudioStore',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uniqueID', models.TextField(default='')),
                ('name', models.TextField(default='')),
                ('data', models.TextField(default='')),
            ],
        ),
        migrations.CreateModel(
            name='CharacterStore',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uniqueID', models.TextField(default='')),
                ('data', models.TextField(default='{}')),
            ],
        ),
        migrations.CreateModel(
            name='StructureSampleStore',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uniqueID', models.TextField(default='')),
                ('name', models.TextField(default='')),
                ('data', models.TextField(default='')),
            ],
        ),
    ]
