const core = require('@actions/core');
const github = require('@actions/github');
const splitEmoji = require('emoji-aware').split;
const onlyEmoji = require('emoji-aware').onlyEmoji;

async function run() {
  try {
    const token = core.getInput('repo-token');
    const { owner, repo } = github.context.repo;

    const prNumber = getPrNumber();

    if (!prNumber) {
      core.setFailed('Could not get pull request number from context');
      return;
    }

    const octokit = github.getOctokit(token);

    const response = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });

    const prTitle = response.data.title;

    if (hasEmoji(prTitle)) {
      return;
    }

    const newTitle = addEmoji(prTitle);

    await octokit.rest.pulls.update({
      owner,
      repo,
      pull_number: prNumber,
      title: newTitle,
    });
  } catch (error) {
    console.error(error);
    core.setFailed(error.messsage);
  }
}

function getPrNumber() {
  const pullRequest = github.context.payload.pull_request;

  if (!pullRequest) {
    return undefined;
  }

  return pullRequest.number;
}

function hasEmoji(text) {
  const currentEmoji = onlyEmoji(text);
  return currentEmoji.length !== 0;
}

function addEmoji(text) {
  const result = emojiArray[Math.floor(Math.random() * emojiArray.length)];
  if (!result) return text.trim();
  return `${result} ${text.trim()}`;
}

const emojiPool =
  '🪵🪵🪵😬🙌😅🌄😎⚡️🧠🧠🧠✨✨✨✨✨🦓🦓🦓🤷‍♂️🤷‍♂️🤷‍♂️🤷‍♂️🍄🍄🍄🪁🪁🪁🪁👩‍🍳👌🦷🦷🦷🚧🚧🚧🚧💽💽💽💽💽🐓🐓🐓🐓🍽😼🤙🤙🫂😏😏🤪🤨🤬🤬🤬😤😎🥵🥶😶‍🌫️😑🤮🤠🤠🤠🤐😵‍💫🥴😈😈💩💩💩👻🤡🤡🤡🤡🤡👺☠️💀💀💀🤖🎃🙌🤌🦾🖕🖕🖕🦵🙏🙏🙏🦻🦻🫀🗣🕵️‍♀️👷‍♂️👨‍🔧🧛‍♂️🧟‍♀️👼👼👼👼🕺🕺🕺🕺🕺🧑‍🦽🧑‍🦼🧵🪢🪢🪢🪡🪡🧢🧢🧢🥾👟👡👠🩴🧣🥽🥽🥽🌂👓👛🐸🐸🐶🐱🐭🐹🐰🦊🐻🐼🐻‍❄️🐨🐯🦁🐮🐷🐽🐵🙈🙉🙊🐒🐔🐔🐔🐔🐧🐦🐤🐣🐥🦆🦆🦆🦅🦅🦅🦅🦉🦇🐺🐗🐴🦄🐝🪱🪱🪱🐛🦋🐌🐞🐜🪰🪰🪲🪳🦟🦗🕸🦂🐢🐍🦎🦖🦖🦖🦕🐙🦑🦑🦑🦑🦐🦞🦀🐠🐟🐬🐳🐋🦈🦭🐊🐅🐆🦓🦍🦧🦧🦧🦧🦣🐘🦛🦏🐪🐫🦒🦘🦬🐃🐂🐄🐎🐖🐏🐑🦙🐐🦌🐕🐩🦮🐕‍🦺🐈🐈‍⬛🪶🐓🦃🦤🦚🦚🦚🦜🦜🦜🦢🦩🕊🐇🦝🦨🦡🦫🦦🦦🦦🦥🐁🐀🐿🦔🦔🦔🐲🐉🌵🌵🌵🎄🌳🍀🎍🍁🌷💐🌾🪨🐚🌹🥀🌺🌸🌼🌻🌞🌝🌛🌚🌕🌖🌗🌘🌑🌒🌓🌔🌙🌎🌍🌏🪐🪐🪐🪐☄️⚡️✨💥🔥🔥🔥🔥🔥🌪🌈🌈🌈🌈🌈☀️☃️🌬☔️☂️🍏🍎🍐🍊🍋🍋🍋🍌🍉🍇🍓🫐🫐🫐🫐🍈🍒🍑🥭🍍🥥🥝🍅🍆🥑🥦🥬🥒🌶🫑🌽🥕🫒🫒🧄🧅🥔🍠🥐🥯🥯🥯🍞🥖🥨🧀🥚🍳🍳🍳🍳🧈🥞🧇🥓🥩🥩🍗🍖🦴🌭🍔🍟🍕🫓🥪🥙🧆🌮🌯🫔🥗🥘🥫🍝🍜🍲🍛🍣🍱🥟🦪🍤🍤🍤🍙🍘🍥🥠🥮🍢🍨🍦🥧🧁🍰🎂🍮🍭🍬🍫🍿🍩🍪🌰🥜🍯🥛🫖🍵🧋🍺🍺🍺🍺🍺🍻🥂🍷🥃🍸🍹🧉🍾🍾🍾🍾🧊🥄🧂🥡🥢⚽️🏈🥎🎾🏐🏉🥏🎱🪀🏓🏓🏓🏓🏸🏸🏸🏒🏑🥍🏏🪃⛳️🎣🤿🤿🤿🥊🥋🎽🛹🛼🛷🪂🏂⛷🎿🥌⛸⛹️‍♂️🤼🏋️‍♂️🤸‍♂️🤺🤺🤺🤾🏇🏄‍♂️🚣🥇🥈🥈🥈🥈🥉🥉🥉🥉🥉🥉🥉🥉🏅🎖🩰🎺🎺🎺🎷🥁🪗🪗🪗🎸🪕🎻🎲🎯♟🎳🎰🚗🚕🚙🚌🏎🚓🚑🚐🛻🚚🚛🚜🛵🚲🚨🚨🚨🚨🚨🚨🚨🛺🚠🚟🚃🚋🚞🚝🚄🚅🚈🚂🚇🚊🚉✈️🛫🛬🛩💺🛰🚀🚀🚀🚀🚀🚁⛵️🚤🛥🛳🚢⚓️🪝⛽️🚦🗺🚏🗼🗽🗿🏰🏯🏟🎡🎢🎠⛲️⛱🏖🏝🏜⛰🗻🏕⛺️🛖🏠🏡🏚🏭🏣🏤🏪🏫🏩💒🏛⛪️🕌🕍🛕🕋⛩🛤🗾🎑🌅🌠🎇🎆🌇🌆🌃🌌🌉🌁⌚️📲💻⌨️🖥🖱🖲🗜💽💾📼🎥☎️📞📟📠📺📻⏰⏳🔌🔌🔌🔌🔌💡💡💡💡🔦🕯🪔🧯🧯🧯🧯🛢💸💸💸💵💴💶💷🪙💰💳💎💎💎💎⚖️🪜🧰🪛🔨🔧⚒🛠🪚🔩⚙️🪤🪤🪤🪤🪤🧱⛓🧲💣🧨🪓🔪🗡⚔️🛡🚬🚬🚬🚬🚬⚰️⚱️🏺🔮📿🧿💈⚗️🔭🔬🕳🕳🕳🩺💊💉🩸🧬🦠🦠🦠🦠🧫🧫🧫🧪🧪🌡🧹🪠🧺🚽🚽🚽🚽🚽🚰🚿🛁🪥🛀🧽🪣🧴🧴🧴🛎🔑🛏🧸🧸🚪🗝🖼🪟🛍🪆🎁🎈🎈🎈🎈🎏🪅🪅🪅🎉🎊🪄🪄🪄🎎🏮🎐🧧📧💌📦📭📬📪📫📮📯📜📃📑📊📈📉🗒🗓📅🗑📇🗃🗳📋🗞📰📓📔📒📕📗📚📖🔖🧷🔗📎🖇📐📏📌📍✂️🖊🖋✒️🖌📝✏️🔎❤️🧡💛💚💜🖤🤍❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🩹❣️💕💞💓💗💖💖💖💘💝🔞🔞🔞🔞🚭🚷🚯🚳🚱💯💮♻️⚜️🚾🚾🚾♿️🆒🆗👁‍🗨🔊♥️📢🏴‍☠️🏳️‍🌈🏳️‍🌈🏳️‍🌈🇦🇽🇦🇽🇦🇽🇦🇽🇦🇽🇳🇵🇮🇸🇺🇦🇸🇪🕴';
const emojiArray = splitEmoji(emojiPool);

run();
