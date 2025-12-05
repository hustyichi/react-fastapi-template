import taskiq_fastapi
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from taskiq import TaskiqDepends
from taskiq_redis import RedisAsyncResultBackend, RedisStreamBroker

from app.config import settings
from app.database import get_async_session
from app.models import Item

result_backend: RedisAsyncResultBackend = RedisAsyncResultBackend(
    redis_url=settings.REDIS_URL,
)

broker = RedisStreamBroker(
    url=settings.REDIS_URL,
).with_result_backend(result_backend)

taskiq_fastapi.init(broker, "app.main:app")


@broker.task
async def hello_world_task(db: AsyncSession = TaskiqDepends(get_async_session)):
    """异步解析简历任务"""
    results = await db.execute(select(Item))
    items = results.scalars().all()
    print(f"Got {len(items)} items from db")
