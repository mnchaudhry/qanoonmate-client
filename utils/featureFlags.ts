import { ReleaseChannel } from "@/lib/enums";

export type FeatureGate = {
  minChannel?: ReleaseChannel;
  allow?: ReleaseChannel[];
  deny?: ReleaseChannel[];
};

const channelRank: Record<ReleaseChannel, number> = {
  [ReleaseChannel.INTERNAL]: 4,
  [ReleaseChannel.ALPHA]: 3,
  [ReleaseChannel.BETA]: 2,
  [ReleaseChannel.PUBLIC]: 1,
};

export function isFeatureEnabled(userChannel: ReleaseChannel | undefined, gate: FeatureGate): boolean {
  const channel = userChannel || ReleaseChannel.PUBLIC;
  if (gate.allow && gate.allow.length > 0) return gate.allow.includes(channel);
  if (gate.deny && gate.deny.length > 0) return !gate.deny.includes(channel);
  if (gate.minChannel) return channelRank[channel] >= channelRank[gate.minChannel];
  return true;
}


