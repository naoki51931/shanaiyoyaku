from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.executors.pool import ThreadPoolExecutor
from zoneinfo import ZoneInfo  # Python 3.9 以上

scheduler = BackgroundScheduler(
    jobstores={"default": MemoryJobStore()},
    executors={"default": ThreadPoolExecutor(10)},
    timezone=ZoneInfo("Asia/Tokyo")  # ★ここがポイント
)