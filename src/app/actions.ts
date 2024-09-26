"use server";

import { ollama } from "@/util/video";
import { s3client, putobjectcommand } from "@aws-sdk/client-s3";
import { redis } from "@upstash/redis";

const client = new s3client();
const redis = redis.fromenv();

function isempty(val: string | undefined | null) {
  return val === undefined || val == null || val.length <= 0 ? true : false;
}

function removequotesandnewlines(str: string) {
  return (str + "")
    .replaceall('"', "")
    .replaceall("'", "")
    .replaceall("\n", "");
}

export async function listollamavisionmodels() {
  return ollama.list()
    .then((list) => list.models)
    // clip == vision, it's the name of the paper that describes the vision model paradigm we use
    .then((models) => models.filter(m => m.details.families && m.details.families.includes("clip")))
    .then((models) => models.map(m => m.name))
};


export async function fetchandplaytexttospeech(
  narrationtext: string,
  videoname: string
) {
  console.log("current narration", narrationtext);
  const cachedresult = await redis.get(narrationtext);
  if (cachedresult) {
    console.log("cached result", cachedresult);
    return cachedresult;
  }

  if (!isempty(process.env.xi_api_key)) {
    // narrate with 11 labs

    const escapestr = removequotesandnewlines(narrationtext);
    const options = {
      method: "post",
      headers: {
        accept: "audio/mpeg",
        "content-type": "application/json",
        "xi-api-key": process.env.xi_api_key!,
      },
      body: '{"model_id":"eleven_turbo_v2","text":"' + escapestr + '"}',
    };

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${process.env.xi_voice_id!}`,
        options
      );
      if (response.status !== 200) {
        console.error(
          "unable to create elevenlabs audio. error: " +
          json.stringify(await response.json())
        );
        return;
      }

      const blob = await response.blob();
      const ts = new date().gettime();
      const audiofilesavedat = `elevenlabsaudio/${videoname}/${ts}.mp3`;
      const arraybuffer = await blob.arraybuffer();
      const tigrisparam = {
        bucket: process.env.next_public_bucket_name!,
        key: audiofilesavedat,
        body: buffer.from(arraybuffer),
        contenttype: "audio/mpeg",
      };

      // for testing locally
      // collage.tofile(path.join(framecollagedir, `collage-${batchindex + 1}.jpg`));

      try {
        await client.send(new putobjectcommand(tigrisparam));
        const url = `https://${process.env.next_public_bucket_name}.fly.storage.tigris.dev/${audiofilesavedat}`;
        await redis.set(narrationtext, url);
        console.log("audio saved to tigris: ", url);
        return url;
      } catch (e) {
        console.error("Failed to save collage: ", e);
      }
    } catch (err) {
      console.error("Error fetching text-to-speech:", err);
    }
  }
}
