# LiveKit ChromeTester

A headless chrome image for simulating LiveKit subscribers.

## Usage

It's designed to be used as a Docker image, by passing a few environment variables, ChromeTester will load https://example.livekit.io with parameters that will let it join a room as a subscriber.

The following environment vars are supported:

- LIVEKIT_API_KEY: API key that matches server config
- LIVEKIT_API_SECRET: API secret that matches server config
- LIVEKIT_HOST: hostname of the LiveKit installation (e.g. wss://mylivekithost.com)
- LIVEKIT_ROOM: the room to join
- DURATION: (optional) amount of time to stay in the room before existing
- LIVEKIT_IDENTITY_PREFIX: (optional) custom name prefix for the simulated subscriber

## Kubernetes Example

To use it on Kubernetes, you'll need a deployment like the following

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: livekit-chrome-tester
  labels:
    app: chrome-tester
spec:
  replicas: 5
  selector:
    matchLabels:
      app: chrome-tester
  template:
    metadata:
      labels:
        app: chrome-tester
    spec:
      containers:
      - name: chrome-tester
        image: livekit/chrometester
        imagePullPolicy: IfNotPresent
        env:
        - name: LIVEKIT_API_KEY
          value: <yourkey>
        - name: LIVEKIT_API_SECRET
          value: <yoursecret>
        - name: LIVEKIT_HOST
          value: <yourhost>
        - name: LIVEKIT_ROOM
          value: <roomname>
```
