# Generated by Django 4.2.6 on 2024-05-08 17:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('task_tracker_api', '0022_alter_log_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='taskcomment',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='task_tracker_api.logicuser', verbose_name='Пользователь'),
        ),
    ]
