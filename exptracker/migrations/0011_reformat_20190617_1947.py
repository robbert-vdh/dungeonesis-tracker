from django.db import migrations

from ..models import LogType


def fix_star_spend_logs(apps, schema_editor):
    """
    Modify log entries with only an integer as value so they all have the same
    JSON object format.

    """
    LogEntry = apps.get_model("exptracker", "LogEntry")

    incorrect_entries = LogEntry.objects.filter(type=LogType.STARS_SPENT).exclude(
        value__has_key="amount"
    )
    for entry in incorrect_entries:
        assert type(entry.value) == int

        # F-expressions don't work in combination with JSONField
        entry.value = {"amount": entry.value, "reason": None}
        entry.save()


class Migration(migrations.Migration):
    dependencies = [("exptracker", "0010_character_dead")]

    operations = [migrations.RunPython(fix_star_spend_logs)]
