let trackName = document.getElementById("trackName");
let trackArtist = document.getElementById("trackArtist");
let trackLink = document.getElementById("trackLink");

let discordName = document.getElementById("discordName");
let discordMotd = document.getElementById("discordMotd");
let avatarLink = document.getElementById("avatarLink");

let rpcName = document.getElementById("rpcName");
let rpcDetails = document.getElementById("rpcDetails");

let webSocket = new WebSocket("wss://api.lanyard.rest/socket");
let discordID = "1149438819834269856";

fetch(`https://api.lanyard.rest/v1/users/${discordID}`)
  .then((response) => response.json())
  .then((e) => {
    if (e.data["discord_user"]) {
      discordName.innerText = `${e.data.discord_user.username}#${e.data.discord_user.discriminator}`;
      avatarLink.href = `https://discord.com/users/${discordID}`;
      discordMotd.innerText = e.data.kv.motd;
      document.getElementById(
        "discordAvatar"
      ).src = `https://cdn.discordapp.com/avatars/${discordID}/${e.data["discord_user"].avatar}.png?size=4096`;
      if (e.data.discord_status == "online") {
        document.getElementById("statusCircle").style.backgroundColor =
          "#23a55a";
      } else if (e.data.discord_status == "idle") {
        document.getElementById("statusCircle").style.backgroundColor =
          "#f0b232";
      } else if (e.data.discord_status == "dnd") {
        document.getElementById("statusCircle").style.backgroundColor =
          "#f23f43";
      } else if (e.data.discord_status == "offline") {
        document.getElementById("statusCircle").style.backgroundColor =
          "#80848e";
      }
    }

    if (e.data["listening_to_spotify"]) {
      trackName.innerText = `${e.data.spotify.song}`;
      let artists = e.data.spotify.artist;
      let artistFinal = artists.replaceAll(";", ",");
      trackArtist.innerText = artistFinal;
      document.getElementById("trackImg").src = e.data.spotify.album_art_url;
      trackLink.href = `https://open.spotify.com/track/${e.data.spotify.track_id}`;
    } else {
      trackName.innerText = "None";
      trackArtist.innerText = "I'm not currently listening anything";
      document.getElementById("trackImg").src = "./template/musicDefault.png";
    }

    if (e.data["activities"].length > 0) {
      if (e.data["activities"][0].name == "Spotify") {
        rpcName.innerText = e.data["activities"][1].name;
        rpcDetails.innerText =
          e.data["activities"][1].details +
          "\n" +
          e.data["activities"][1].state;
        //rpcState.innerText = e.data["activities"][1].state
        document.getElementById(
          "rpcIcon"
        ).src = `https://cdn.discordapp.com/app-assets/383226320970055681/${e.data["activities"][1].assets.large_image}.png`;
        document.getElementById(
          "rpcSmallIcon"
        ).src = `https://cdn.discordapp.com/app-assets/383226320970055681/${e.data["activities"][1].assets.small_image}.png`;
      } else {
        rpcName.innerText = e.data["activities"][0].name;
        rpcDetails.innerText =
          e.data["activities"][0].details +
          "\n" +
          e.data["activities"][0].state;
        //rpcState.innerText = e.data["activities"][0].state
        document.getElementById(
          "rpcIcon"
        ).src = `https://cdn.discordapp.com/app-assets/383226320970055681/${e.data["activities"][0].assets.large_image}.png`;
        document.getElementById(
          "rpcSmallIcon"
        ).src = `https://cdn.discordapp.com/app-assets/383226320970055681/${e.data["activities"][0].assets.small_image}.png`;
      }
    } else {
      rpcName.innerText = "None";
      rpcDetails.innerText = "I'm not currently playing anything";
      rpcState.innerText = "";
      document.getElementById("rpcIcon").src = `./template/gameDefault.png`;
      document.getElementById(
        "rpcSmallIcon"
      ).src = `https://neksio.wtf/transparent.png`;
      document.getElementById("rpcPanel").style.display = "none";
    }
  });

webSocket.addEventListener("message", (event) => {
  data = JSON.parse(event.data);

  if (event.data == '{"op":1,"d":{"heartbeat_interval":30000}}') {
    webSocket.send(
      JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: discordID,
        },
      })
    );
    setInterval(() => {
      webSocket.send(
        JSON.stringify({
          op: 3,
          d: {
            heartbeat_interval: 30000,
          },
        })
      );
    }, 30000);
  }
  if (data.t == "PRESENCE_UPDATE") {
    if (data.d.spotify) {
      trackName.innerText = data.d.spotify.song;
      let artists = data.d.spotify.artist;
      let artistFinal = artists.replaceAll(";", ",");
      trackArtist.innerText = artistFinal;
      document.getElementById("trackImg").src = data.d.spotify.album_art_url;
      trackLink.href = `https://open.spotify.com/track/${data.d.spotify.track_id}`;
    } else if (data.d.activities.length > 0) {
      if (data.d.activities[0].name == "Spotify") {
        rpcName.innerText = data.d["activities"][1].name;
        rpcDetails.innerText = data.d["activities"][1].details;
        rpcState.innerText = data.d["activities"][1].state;
        document.getElementById(
          "rpcIcon"
        ).src = `https://cdn.discordapp.com/app-assets/383226320970055681/${data.d["activities"][1].assets.large_image}.png`;
        document.getElementById(
          "rpcSmallIcon"
        ).src = `https://cdn.discordapp.com/app-assets/383226320970055681/${data.d["activities"][1].assets.small_image}.png`;
      }
    } else {
      rpcName.innerText = "None";
      rpcDetails.innerText = "I'm not currently playing anything";
      rpcState.innerText = "";
      document.getElementById("rpcIcon").src = `./template/gameDefault.png`;
      document.getElementById(
        "rpcSmallIcon"
      ).src = `https://neksio.wtf/transparent.png`;
      //document.getElementById("rpcPanel").style.display = "none";
    }
  }
});
