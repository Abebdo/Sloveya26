type WebSocketListener = (data: any) => void;

export class TelemetryWebSocket {
  private url: string;
  private ws: WebSocket | null = null;
  private listeners: Set<WebSocketListener> = new Set();
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private isExplicitlyClosed = false;

  constructor(url?: string) {
    if (url) {
        this.url = url;
    } else if (typeof window !== "undefined") {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        this.url = `${protocol}//${window.location.host}/api/v1/telemetry/ws`;
    } else {
        this.url = "ws://localhost:8000/api/v1/telemetry/ws";
    }
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
        return;
    }

    this.isExplicitlyClosed = false;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
        console.log("WebSocket connected");
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
    };

    this.ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            this.notifyListeners(data);
        } catch (e) {
            console.error("Failed to parse WebSocket message", e);
        }
    };

    this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        if (!this.isExplicitlyClosed) {
            this.scheduleReconnect();
        }
    };

    this.ws.onerror = (error) => {
        console.error("WebSocket error", error);
        this.ws?.close();
    };
  }

  public disconnect() {
    this.isExplicitlyClosed = true;
    if (this.ws) {
        this.ws.close();
        this.ws = null;
    }
    if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
    }
  }

  public subscribe(listener: WebSocketListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(data: any) {
    this.listeners.forEach((listener) => listener(data));
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
        console.log("Reconnecting WebSocket...");
        this.reconnectTimeout = null;
        this.connect();
    }, 3000);
  }
}

export const telemetryService = new TelemetryWebSocket();
