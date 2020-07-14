## Notes when start k8s:
+ Need to run these cmds:
https://kubernetes.github.io/ingress-nginx/deploy/

+ Create secrets:
$ kubectl create secret generic jwt-secret --from-literal=JWT_KEY=sdsad
$ kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=[secret-stripe-key]

+ Setup Host with: ticketing.dev

+ Type: 'thisisunsafe' on Chrome 

+ NATs streaming ARGs:
https://docs.nats.io/nats-streaming-server/configuring/cmdline
http://localhost:8222/streaming

+ To fix "Unable to find ..." from ts-node-dev:
remove / add attribute: --poll
ex: ts-node-dev src/index.ts