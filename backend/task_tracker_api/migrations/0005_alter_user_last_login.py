# Generated by Django 4.2.6 on 2024-05-07 21:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task_tracker_api', '0004_alter_user_last_login'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='last_login',
            field=models.DateTimeField(auto_created=True, blank=True, null=True),
        ),
    ]
