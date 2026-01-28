import asyncio
import json
import time
from typing import Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from solveya.api.dependencies import get_health_monitor
from solveya.services.health import HealthMonitor

router = APIRouter(tags=["Telemetry"])

@router.websocket("/ws")
async def telemetry_websocket(
    websocket: WebSocket,
    monitor: HealthMonitor = Depends(get_health_monitor)
):
    """
    Real-time telemetry WebSocket endpoint.
    """
    await websocket.accept()

    # Connection state
    is_active = True

    # Heartbeat task
    # We'll use a producer/consumer pattern or just a select loop

    try:
        while is_active:
            # We want to send telemetry periodically AND listen for incoming messages.
            # asyncio.wait_for on receive?

            # Send Telemetry
            telemetry = monitor.get_system_telemetry()
            # Convert to dict via Pydantic model or manual
            # SystemTelemetry is dataclass.
            # We can construct JSON.
            payload = {
                "type": "telemetry",
                "data": {
                    "cpu_usage": telemetry.cpu_usage,
                    "memory_usage": telemetry.memory_usage,
                    "active_jobs": telemetry.active_jobs,
                    "queue_depth": telemetry.queue_depth,
                    "timestamp": telemetry.timestamp
                }
            }

            await websocket.send_json(payload)

            # Wait for incoming messages for a short duration (e.g., 1s interval)
            # If message received, handle it. If timeout, loop to send next telemetry.
            try:
                # 1 second update rate
                message = await asyncio.wait_for(websocket.receive(), timeout=1.0)

                if message["type"] == "websocket.receive":
                    data = message.get("text")
                    if data:
                        try:
                            msg_obj = json.loads(data)
                            if msg_obj.get("type") == "ping":
                                await websocket.send_json({
                                    "type": "pong",
                                    "timestamp": time.time()
                                })
                        except json.JSONDecodeError:
                            pass

                    bytes_data = message.get("bytes")
                    if bytes_data:
                        # Handle binary data?
                        # Echo or acknowledge size?
                        await websocket.send_json({
                            "type": "ack_binary",
                            "size": len(bytes_data)
                        })

            except asyncio.TimeoutError:
                # Time to send next telemetry
                continue

    except WebSocketDisconnect:
        is_active = False
    except Exception as e:
        # Unexpected error
        if is_active:
            await websocket.close(code=1011) # Internal Error
