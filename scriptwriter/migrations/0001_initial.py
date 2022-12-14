# Generated by Django 3.2.8 on 2022-01-18 02:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fullName', models.CharField(max_length=200)),
                ('email', models.TextField(default='')),
                ('password', models.TextField(default='')),
                ('country', models.TextField(default='')),
                ('userID', models.TextField(default='')),
                ('emailVerification', models.TextField(default='')),
                ('emailVerificationValue', models.TextField(default='')),
                ('resetPasswordValue', models.TextField(default='')),
                ('createdon', models.TextField(default='')),
                ('season', models.TextField(default='')),
                ('state', models.TextField(default='')),
                ('authoredScript', models.TextField(default='')),
                ('accountType', models.TextField(default='')),
                ('nightMode', models.TextField(default='')),
                ('onePageWriting', models.TextField(default='')),
                ('autoSaveTimeOut', models.TextField(default='')),
                ('waterMarkStatus', models.TextField(default='')),
                ('waterMarkDisplayText', models.TextField(default='')),
                ('waterMarkDisplayOpacity', models.TextField(default='')),
            ],
        ),
        migrations.CreateModel(
            name='IDManager',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idValue', models.TextField(default='')),
                ('idName', models.TextField(default='')),
            ],
        ),
        migrations.CreateModel(
            name='Script',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(default='')),
                ('body', models.TextField(default='')),
                ('uniqueID', models.TextField(default='')),
                ('createdon', models.TextField(default='')),
                ('status', models.TextField(default='')),
                ('userID', models.TextField(default='')),
                ('authorsID', models.TextField(default='')),
            ],
        ),
    ]
