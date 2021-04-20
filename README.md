# SMS Bot လုပ်ချင်သူများအတွက်

`#nweoosmsbot` - `v1.2.0`

## Keywords

|        Keywords         | Description                      |
| :---------------------: | :------------------------------- |
|    `news` or `သတင်း`    | သတင်းခေါင်းစဥ်များရယူရန်         |
|    `help` or `info`     | အကူအညီရယူရန်                     |
| `count` or `ကျန်သေးလား` | ကျန်ရှိသည့်သတင်းအရေအတွက်ကိုသိရန် |
|   `reset` or `ပြန်စ`    | သတင်းများကိုအစမှပြန်လည်ရယူရန်    |

## Ignore Keywords

|           |            Keywords             |
| :-------- | :-----------------------------: |
| Thank You |       `thank`, `ကျေးဇူး`        |
| Yes       |    `yes`,`ok`, `hok`, `ဟုတ်`    |
| Greeting  | `hello`, `hi`, `hey`, `မင်္ဂလာ` |

> အပြည့်အစုံကို `src/app/Keyword.ts` တွင်ကြည့်ရှုနိုင်ပါတယ်။

## လိုအပ်သည့်အရာများ

1. Android Phone (Dual-SIM ဆိုပိုကောင်းပါတယ်။)
2. SIM Card (Telenor/Ooredoo/MPT)

> မြန်မာလိုပြန်ပို့တဲ့အတွက် စာလုံးရေ ၆၅ လုံးကို SMS တစ်စောင်နှုန်းမလို့ Unlimited Package ရှိတဲ့ Mobile Operator ကိုအသုံးပြုတာပိုအဆင်ပြေပါတယ်။

#### Unlimited SMS Packages

| Operator |    Dial    |
| :------: | :--------: |
| Telenor  | `*8069*1#` |
| Ooredoo  |  `*201#`   |
|   MPT    |  `*2006#`  |

> လက်ရှိ တယ်လီနော်ကတော့ ဆင်းကတ်တစ်ကတ်ကို Unlimited Package နဲ့ အစောင် ၂၀၀၀ ကျော်သွားရင် ထပ်ပို့လို့အဆင်မပြေတော့ပါဘူး။ နောက်တစ်ကတ်ပြောင်းသုံးမှ ပြန်ရပါတယ်။

## လိုအပ်သည့် App များ

1. [Macrodroid](https://nweoo.page.link/macrodroid)
2. [Termux](https://nweoo.page.link/termux)

## လုပ်ဆောင်ချက်

### Termux (App)

အဆင့်(၁) `Termux` App ကိုဖွင့်ပါ။

> ပထမဦးဆုံးတစ်ခါပဲလုပ်ဖို့လိုပါတယ်။ နောက်တစ်ခါပြန်၀င်တဲ့အခါ အဆင့်(၃) ကိုလုပ်ဖို့ပဲလိုပါတယ်။

အဆင့်​ (၂) `sh -c "$(curl -fsSL https://raw.githubusercontent.com/nweoo22222/smsbot/v1.2/bin/install.sh)`

အဆင့် (၃) `~/start`

### Macrodroid (App)

အဆင့်(၁) `Macrodroid` App ကိုဖွင့်ပါ။

အဆင့်(၂) [smsbot-macro-v1.1.2.mdr](https://nweoofact.page.link/smsbot) ကိုဒေါင်းလုပ်ဆွဲပါ။

အဆင့်(၃) Export/Import ထဲ၀င်ပြီး Import ကိုရွေးချယ်ပါ။

အဆင့်(၄) ဒေါင်းလုပ်ဆွဲခဲ့တဲ့ဖိုင်ကိုရွေးပြီးသွင်းလိုက်ပါ။

အဆင့်(၅) SMS, Call & Notification နဲ့ ပတ်သက်တဲ့ Permission များပေးပါ။

အဆင့်(၆) Incoming Call တွေ Block ချင်ရင် `macros` ထဲက ​`call` > `blocked` ကိုဖွင့်ပါ။ _default က On ထားပါတယ်။_

အဆင့်(၇) SMS Bot ကိုစတင်ရန် `macros` ထဲက `SMS` > `smsbot(telenor)` သို့မဟုတ် `smsbot(ooredoo)` ကိုဖွင့်ပါ။ _default က Telenor ကို On ထားပါတယ်။_

#### အသံပိတ်ရန်

အဆင့်(၁) `Macrodroid` App ကိုဖွင့်ပါ။

အဆင့်(၂) `Variables` ထဲကိုဝင်ပါ။

အဆင့်(၃) `muted` ကို `true` ဟုရွေးချယ်ပါ။

> အသံက message ၁ စောင်ကို ၁ ချက်မည်ပါတယ်။

### အခြား

အပေါ်ကလုပ်ဆောင်ရမဲ့ (၂) ခုလုံးလုပ်ဆောင်ပြီးမှ အဆင့်သင့်ဖြစ်ပြီဆိုရင် Browser ထဲကနေတဆင့် [`http://localhost:3001`](http://localhost:3001) သွားရောက်ပြီး `Update Articles` ကိုနှိပ်၍ သတင်းတွေကို [api.nweoo.com/articles](http://api.nweoo.com/articles) ကနေတဆင့် update တင်ပြီးစတင်အသုံးပြုနိုင်ပါပြီ။

**အင်တာနက်ရတာမသေချာတဲ့အတွက် Articles တွေကို Auto Update လုပ်တဲ့စနစ်မပါပါဘူး။ ရတဲ့အချိန် Offline သိမ်းထားရန် `.update` လို့ Message ပို့၍ဖြစ်စေ၊ Browser ကနေတဆင့်ဖြစ်စေ၊ [`http://localhost:3001/update`](http://localhost:3001/update) ကို ၀င်ရောက်ပြီး Update တင်ပေးပါ။**

<a id="Update" href="#Update"></a>

### Version Update

အဆင့်(၁) `Termux` App ကိုဖွင့်ပါ။

အဆင့်(၂) `cd smsbot`

အဆင့်(၃) `git pull --ff`

အဆင့်(၄) `npm run build`

အဆင့်(၅) `npm start`

အဆင်မပြေတာရှိရင် [m.me/nweoo22222](https://m.me/nweoo22222) ကတဆင့်မေးမြန်းနိုင်ပါတယ်။ Error များတက်ခဲ့ပါကပြန်ပြောပေးကြပါ။ Version Update ရှိခဲ့ရင်လည်း [http://localhost:3001](http://localhost:3001) ကို ၀င်ကြည့်တဲ့အခါ alert ပေးပါလိမ့်မယ်။
