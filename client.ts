import * as WebSocket from 'ws';

interface ISensorReading {
  timestamp: number;
  sequence_number: number;

  sensor_readings: [
    {
        timestamp: number,
        sensor_id: number,
        x: number,
        y: number,
        z: number,
    }
  ]
}

class WebSocketClient {
    private socket: WebSocket;
    private serverUrl: string;
    private sessionStarted: boolean;
    private seqNumber: number;
  
    constructor(serverUrl: string) {
      this.serverUrl = serverUrl;
      this.sessionStarted = false;
      this.seqNumber = 0;
    }
  
    public startSession(): void {
      if (!this.sessionStarted) {
        this.socket = new WebSocket(this.serverUrl);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.sessionStarted = true;
      } else {
        console.error("Session already started");
      }
    }
  
    public stopSession(): void {
      if (this.sessionStarted) {
        this.socket.close();
        this.sessionStarted = false;
      } else {
        console.error("Session already stopped");
      }
    }
  
    public sendData(sensorReadings: [{
      timestamp: number,
      sensor_id: number,
      x: number,
      y: number,
      z: number
    }]): void {
      if (this.sessionStarted) {
        const data : ISensorReading = {
            timestamp: new Date().getTime(),
            sequence_number: this.seqNumber++,
            sensor_readings: sensorReadings,
        }
        this.socket.send(JSON.stringify(data));
      } else {
        console.error("Session not started");
      }
    }
  
    private onOpen(): void {
      console.log("WebSocket connection opened");
    }
  
    private onMessage(event: MessageEvent): void {
      console.log("WebSocket message received: ", event.data);
    }
  
    private onError(error: Event): void {
      console.error("WebSocket error: ", error);
    }
  
    private onClose(event: CloseEvent): void {
      console.log("WebSocket connection closed with code: ", event.code);
      this.sessionStarted = false;
    }
  }
  