import { useEffect, useState } from 'react';
import { telemetryService } from '../services/websocket';
import { SystemTelemetry } from '../types/diagnostic';

export const useWebSocket = () => {
  const [telemetry, setTelemetry] = useState<SystemTelemetry | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Ensure connection is active
    telemetryService.connect();

    // Subscribe to updates
    const unsubscribe = telemetryService.subscribe((message: any) => {
        if (message.type === 'telemetry') {
            setTelemetry(message.data);
            setIsConnected(true);
        } else if (message.type === 'pong') {
            setIsConnected(true);
        }
    });

    // We do not disconnect on unmount to allow shared usage of the singleton service.
    // The service handles reconnection automatically.

    return () => {
        unsubscribe();
    };
  }, []);

  return { telemetry, isConnected };
};
