import { ref } from "vue";

import * as Nostr from "nostr-tools";
import { RelayPool } from "nostr-relaypool";

export const feedRelays = ["wss://bostr.nokotaro.com"];

export const profileRelays = [
  "wss://bostr.nokotaro.work/",
  "wss://ipv6.nostr.wirednet.jp/",
  "wss://nos.lol/",
  "wss://nostr.wine/",
  "wss://nostr-relay.nokotaro.com/",
  "wss://nrelay-jp.c-stellar.net/",
  "wss://r.kojira.io/",
  "wss://relay-jp.nostr.wirednet.jp/",
  "wss://relay-jp.shino3.net/",
  "wss://relay.current.fyi/",
  "wss://relay.damus.io/",
  "wss://relay.nostr.band/",
  "wss://relay.nostr.wirednet.jp/",
  "wss://relay.snort.social/",
  "wss://yabu.me/",
];

export const pool = new RelayPool(normalizeUrls(feedRelays), {
  autoReconnect: true,
  logErrorsAndNotices: true,
  subscriptionCache: true,
  useEventCache: true,
  skipVerification: false,
});
pool.onerror((url, msg) => {
  console.log("pool.error", url, msg);
});
pool.onnotice((url, msg) => {
  console.log("pool.onnotice", url, msg);
});
pool.ondisconnect((url, msg) => {
  console.log("pool.ondisconnect", url, msg);
});

export function normalizeUrls(urls: string[]): string[] {
  return urls.map((url) => {
    let u = url;
    
    if (u.startsWith("http://")) { u = u.replace("http://", "ws://"); }
    else if (u.startsWith("https://")) { u = u.replace("https://", "wss://"); }
    else if (!(u.startsWith("ws://") || u.startsWith("wss://"))) { u = "wss://" + u; }

    return Nostr.utils.normalizeURL(u);
  });
}

export interface NostrEvent {
  id: string;
  sig: string;
  pubkey: string;
  kind: Nostr.Kind | number;
  content: string;
  tags: string[][];
  created_at: number;
  isReposted: Boolean | undefined;
  isFavorited: Boolean | undefined;
}

export const events = ref(new Array<NostrEvent>());
export const eventsToSearch = ref(new Array<NostrEvent>());
export const eventsReceived = ref(new Map<string, Nostr.Event>());
