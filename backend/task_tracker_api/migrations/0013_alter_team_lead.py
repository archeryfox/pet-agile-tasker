# Generated by Django 4.2.6 on 2024-05-08 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task_tracker_api', '0012_alter_employee_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='team',
            name='lead',
            field=models.ManyToManyField(to='task_tracker_api.logicuser', verbose_name='Руководитель'),
        ),
    ]
