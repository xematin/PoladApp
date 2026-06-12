"""Celery application configuration for PoladApp."""
import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("poladapp")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# Periodic tasks
app.conf.beat_schedule = {
    "check-pending-orders-every-5-min": {
        "task": "apps.orders.tasks.check_pending_orders",
        "schedule": crontab(minute="*/5"),
    },
}


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
