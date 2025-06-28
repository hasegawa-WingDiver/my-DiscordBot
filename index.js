// .env から環境変数を読み込む
require('dotenv').config();

// その他の require に続けて
const cron = require('node-cron');
const channelId = process.env.CHANNEL_ID;

// discord.js をインポート（v14以降の構文）
const { Client, GatewayIntentBits } = require('discord.js');

// Botのインスタンスを作成（メッセージの受信に必要なインテントを設定）
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ランダムメッセージのパターン（メンションされたとき）
const replies = [
    '私の勲章コレクションも見てみるか？',
    '指揮官か？……最近、自分が対潜戦も出来るんじゃないかと思い始めたが…',
    '運も実力のうち？できれば少し姉にも分けてあげたいものだな',
    '生きている限り、思い通りにならないことはいくらでもある。死にゆくなら悔いを残さないようにしたいものだ',
    'なんだ、出撃か？',
    '戦いの次にまた戦い、か……',
    '指揮官、教えてくれ。私はあと何隻沈めればいい？',
    '素直で誠実に生きていくのが願いだ。だから意見があったらこっちから遠慮なく言わせてもらう。そっちも考えがあったらなんでも遠慮なく言ってくれ',
    '天の光は全て星、海の光は全て敵……指揮官、争いのない日は果たして来るのだろうか',
    '戦争が終わったら何がしたい？――私？多分あなたについていくだろうな。戦場以外ならあなたのそばが一番安心する。私を連れていって……もらえるか？',
    '写真を撮るのか？分かった、ポーズはどうすればいい？',
    'ルール違反だぞ。指揮官',
    '助けが必要か？',
    'あっ…！…わざとじゃないか？',
    'あなたの側にいれば、たとえどんなに苦しい戦いでも、どんなに悲しい別れが来ても、きっと希望をもって乗り越えることができる',
    '今日の夕餉は私に任せてくれないか？ヴェスタルからもう教えることはないって言われたからな。……ふっ、戦闘しか能がない私じゃないぞ',
    'いつか戦争が終わって、人々が心から笑い合える日がきっと来ると信じている。指揮官、あなたがいてくれたおかげだ',
    '力の果てに何があるのか……見させてもらおう'
];

// トレーニング開始時用のランダムメッセージ
const replies_training = [
    'トレーニングの時間だ、指揮官',
    '定刻だ、指揮官。今日もトレーニングを始めよう',
    '終わりだ！',
    '指揮官よ。ミッションがまだ終わってないぞ。早く出発するのだ',
    '指揮官、次の目的地へ向かう前にまずはミッションの進捗確認を',
    'ミッションがまだ終わっていないぞ。進捗を確認しほうがいい'
];


// Botが準備完了したあとにスケジューリング
client.once('ready', () => {
    console.log(`ログイン完了！Bot名：${client.user.tag}`);

    // 日本時間で毎日19:30にメッセージ送信（UTC換算：10:30）
    cron.schedule('0 30 19 * * *', async () => {
        const channel = await client.channels.fetch(channelId);
        if (channel && channel.isTextBased()) {
            const reply = replies_training[Math.floor(Math.random() * replies_training.length)];
            channel.send('@everyone\n' + reply);
        }
        else
        {
            console.log("チャンネルが取得できませんでした");
        }
    }, {
        timezone: "Asia/Tokyo" // 日本時間を指定
    });
});

// メッセージ受信イベント
client.on('messageCreate', message => {
    // Bot自身のメッセージには反応しない
    if (message.author.bot) return;

    // 「こんにちは」と言われたら返事する例
    if (message.content === 'こんにちは') {
        message.channel.send(`こんにちは、${message.author.username}`);
    }
});

// メンションされたら反応
client.on('messageCreate', message => {
    if (message.author.bot) return;

    const isMentioned = message.mentions.has(client.user);

    if (isMentioned) {
        const reply = replies[Math.floor(Math.random() * replies.length)];
        message.channel.send(`${message.author}\n ${reply}`);
    }
});

// トークンでBotにログイン
client.login(process.env.DISCORD_TOKEN);