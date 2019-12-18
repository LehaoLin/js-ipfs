'use strict'

const TCP = require('libp2p-tcp')
const MulticastDNS = require('libp2p-mdns')
const WS = require('libp2p-websockets')
const Bootstrap = require('libp2p-bootstrap')
const KadDHT = require('libp2p-kad-dht')
const GossipSub = require('libp2p-gossipsub')
const Multiplex = require('pull-mplex')
const SECIO = require('libp2p-secio')

module.exports = () => {
  return {
    dialer: {
      maxParallelDials: 150, // 150 total parallel multiaddr dials
      maxDialsPerPeer: 4, // Allow 4 multiaddrs to be dialed per peer in parallel
      dialTimeout: 10e3 // 10 second dial timeout per peer dial
    },
    modules: {
      transport: [
        TCP,
        WS,
        wsstar
      ],
      streamMuxer: [
        Multiplex
      ],
      connEncryption: [
        SECIO
      ],
      peerDiscovery: [
        MulticastDNS,
        Bootstrap,
        wsstar.discovery
      ],
      dht: KadDHT,
      pubsub: GossipSub
    },
    config: {
      peerDiscovery: {
        autoDial: true,
        mdns: {
          enabled: true
        },
        bootstrap: {
          enabled: true
        },
        websocketStar: {
          enabled: true
        }
      },
      dht: {
        kBucketSize: 20,
        enabled: false,
        randomWalk: {
          enabled: false
        }
      },
      pubsub: {
        enabled: true,
        emitSelf: true
      }
    }
  }
}
