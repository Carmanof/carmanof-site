const BLOB_BASE = "https://gtcko1hhlyrih3ll.public.blob.vercel-storage.com/carmanof";

type VideoAsset = {
  video: string;
  poster: string;
};

type ManagedVideoAsset = {
  videoUrl?: string;
  posterUrl?: string;
  youtubeId?: string;
};

const files: Record<string, [string, string]> = {
  "-FqhKQWDWmY": ["-FqhKQWDWmY-1q41oaUCSUObwyuupGZ3UlwWOVPLeu.mp4", "-FqhKQWDWmY-WMQX4PlmQ8dadWZWNZIaqnUoBxC98U.webp"],
  "-qyv3CoX--w": ["-qyv3CoX--w-uEeWhwwLjjj6eAzjtc4Auqz9Pd492y.mp4", "-qyv3CoX--w-E3q01oLFmSXKoEhpa8XQyecdfVV8KT.webp"],
  "0WzIZFBFl7c": ["0WzIZFBFl7c-3amFEn2MNAuaNFj9QtAXK2bpojoB68.mp4", "0WzIZFBFl7c-aoIndRTk7CTMV7lne19mIMiRPGxVsY.webp"],
  "2VUjv7XHZoo": ["2VUjv7XHZoo-xhXTtXA52aKh97TmbS9dz9EqAToGnu.mp4", "2VUjv7XHZoo-EZhlIFim7vlTlJUn76Dw91Wq05KoIT.webp"],
  "6kL1rUEtNwQ": ["6kL1rUEtNwQ-6SnOHLqsL4XB4yuuiArrGAD3szvuAw.mp4", "6kL1rUEtNwQ-kXvyTohoSIy9mRarUSbKQZ6brNfI4E.webp"],
  "f8EohEHaHds": ["f8EohEHaHds-Aff2yUctgGnlYFCv7nfo2Yvxr75q5b.mp4", "f8EohEHaHds-ve2zE9lqjj558aux5TWa8ggspJg741.webp"],
  "FOLvdJuajEM": ["FOLvdJuajEM-KVbYiE3s2EH5o18OstX3lbtOzvM7rL.mp4", "FOLvdJuajEM-3Yjp789h5Q3F6JJ8CGvb5JAyPZN24n.webp"],
  "GH6-JoHjpYc": ["GH6-JoHjpYc-tAsS4RCQNCtvrnn9f6FQhEB2NCeYkG.mp4", "GH6-JoHjpYc-bjXJeFEyQz9Jdej6hcoI1ss8O2NA3o.webp"],
  "gWLJxdV_F0Q": ["gWLJxdV_F0Q-RLce2ywb6iu3MWr7YYVJhNcFaEwW7X.mp4", "gWLJxdV_F0Q-SXXCHvxJ5mUsfky1xNLk2BJGCWVo8E.webp"],
  "iq0fddIiLIM": ["iq0fddIiLIM-14rYtCmPDHOGf1bnbIizIJobMfESQS.mp4", "iq0fddIiLIM-XdbecxsLm6tpe5tauh0POJCX19KDFw.webp"],
  "Kmrh2kalX5Y": ["Kmrh2kalX5Y-U7Qh2h612qEgIIXHaYVolS3aWG5FiH.mp4", "Kmrh2kalX5Y-03S3dB27IrWVQBjweUPg26smlQq7yb.webp"],
  "kzHdRZxFJH0": ["kzHdRZxFJH0-lSqhNtXxfRqVCCXmuo15b9pr7UvzAl.mp4", "kzHdRZxFJH0-yIxttujH0xyqangejVrAtaVyTzmjwy.webp"],
  "ni8A3rliTlw": ["ni8A3rliTlw-9EFGR8OkUvkAhqDMbTfQmgGz4zSyH3.mp4", "ni8A3rliTlw-SApL6TOVCbMKD0mikFBfg9bzCvP7qu.webp"],
  "nSgDOLhBMmg": ["nSgDOLhBMmg-fO8vgPqcXiKKfbxRd46HHnAKOYnFeT.mp4", "nSgDOLhBMmg-w9ZNuosjucg59BJMBKzl9I8j5YMB0q.webp"],
  "r57fUAHv5R8": ["r57fUAHv5R8-IPvJVjA79YaxeXT2fp3bNaAj2chaso.mp4", "r57fUAHv5R8-OhESE13ilROtcTLSgrUEqj4VTaKXSY.webp"],
  "zApeCgjOFlY": ["zApeCgjOFlY-tNVxIHUK0A3KvKOCIGOXVWa6iihmMg.mp4", "zApeCgjOFlY-fxyRM42zlOomjmExvo3DluLtmMWxgY.webp"],
  "ZK4Rh921osw": ["ZK4Rh921osw-h3fx8j2e2Nw8UBFWD0TfnX1oYIGHwD.mp4", "ZK4Rh921osw-pTWqKvhUMZNtDp0yqWDdIBVJB9l4UI.webp"],
};

export function getVideoAsset(youtubeId: string): VideoAsset | undefined {
  const asset = files[youtubeId];
  if (!asset) return undefined;

  return {
    video: `${BLOB_BASE}/videos/${asset[0]}`,
    poster: `${BLOB_BASE}/posters/${asset[1]}`,
  };
}

export function getVideoPoster(youtubeId: string) {
  return getVideoAsset(youtubeId)?.poster ?? "/images/more-examples/example-04-v2.webp";
}

export function resolveVideoAsset({
  videoUrl,
  posterUrl,
  youtubeId,
}: ManagedVideoAsset): VideoAsset | undefined {
  if (videoUrl) {
    return {
      video: videoUrl,
      poster:
        posterUrl ??
        (youtubeId ? getVideoPoster(youtubeId) : undefined) ??
        "/images/more-examples/example-04-v2.webp",
    };
  }

  return youtubeId ? getVideoAsset(youtubeId) : undefined;
}

