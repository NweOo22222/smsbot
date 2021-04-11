# SMS Bot လုပ်ချင်သူများအတွက်

`#nweoosmsbot` - `v1.1.1`

## လိုအပ်သည့်အရာများ

1. Android Phone (Dual-SIM ဆိုပိုကောင်းပါတယ်။)
2. SIM Card (Telenor/Ooredoo/MPT)

## လိုအပ်သည့် App များ

1. [Macrodroid](https://nweoofact.page.link/macrodroid)
2. [Termux](https://nweoofact.page.link/termux)

## လုပ်ဆောင်ချက်

### Termux (App)

အဆင့်(၁) `Termux` App ကိုဖွင့်ပါ။

> ပထမဦးဆုံးတစ်ခါပဲလုပ်ဖို့လိုပါတယ်။ နောက်တစ်ခါပြန်ဝင်တဲ့အခါ အဆင်(၅) နဲ့ အဆင့် (၈) ပဲလိုပါတယ်။

အဆင့်(၂) `pkg update`

အဆင့်(၃) `pkg install git nodejs --yes`

အဆင့်(၄) `git clone https://github.com/nweoo22222/smsbot`

အဆင့်(၅) `cd smsbot`

အဆင့်(၆) `npm install`

အဆင့်(၇) `npm run build`

အဆင့်(၈) `npm run server`

### Macrodroid (App)

အဆင့်(၁) `Macrodroid` App ကိုဖွင့်ပါ။

အဆင့်(၂) [smsbot-macro-v1.1.2.mdr](https://nweoofact.page.link/smsbot) ကိုဒေါင်းလုပ်ဆွဲပါ။

အဆင့်(၃) Export/Import ထဲ၀င်ပြီး Import ကိုရွေးချယ်ပါ။

အဆင့်(၄) ဒေါင်းလုပ်ဆွဲခဲ့တဲ့ဖိုင်ကိုရွေးပြီးသွင်းလိုက်ပါ။

အဆင့်(၅) SMS, Call & Notification နဲ့ ပတ်သက်တဲ့ Permission များပေးပါ။

အဆင့်(၆) Incoming Call တွေ Block ချင်ရင် `macros` ထဲက ​`call` > `blocked` ကိုဖွင့်ပါ။ *default က On ထားပါတယ်။*

အဆင့်(၇) SMS Bot ကိုစတင်ရန် `macros` ထဲက `SMS` > `smsbot(telenor)` သို့မဟုတ် `smsbot(ooredoo)` ကိုဖွင့်ပါ။ *default က Telenor ကို On ထားပါတယ်။*

#### Ooredoo ပြောင်းနည်း

အဆင့်(၁) `Macrodroid` App ကိုဖွင့်ပါ။

အဆင့်(၂) `macros` ထဲက `SMS` > `smsbot(ooredoo)` ကို On ပြီး `smsbot(telenor)` ကို On ပေးပါ။

#### အသံပိတ်ရန်

အဆင့်(၁) `Macrodroid` App ကိုဖွင့်ပါ။

အဆင့်(၂) `Variables` ထဲကိုဝင်ပါ။

အဆင့်(၃) `muted` ကို `true` ဟုရွေးချယ်ပါ။

> အသံက message ၁ စောင်ကို ၁ ချက်မည်ပါတယ်။

### အခြား

အပေါ်ကလုပ်ဆောင်ရမဲ့ (၂) ခုလုံးလုပ်ဆောင်ပြီးမှ အဆင့်သင့်ဖြစ်ပြီဆိုရင် Browser ထဲကနေတဆင့် [`http://localhost:3001`](http://localhost:3001) သွားရောက်ပြီး `Update Articles` ကိုနှိပ်၍ DVB က သတင်းတွေကို ကျွန်တော်တို့ [api.nweoo.com/articles](http://api.nweoo.com/articles) ကနေတဆင့် update တင်ပြီးစတင်အသုံးပြုနိုင်ပါပြီ။

**အင်တာနက်ရတာမသေချာတဲ့အတွက် Articles တွေကို Auto Update လုပ်တဲ့စနစ်မပါပါဘူး။ ရတဲ့အချိန် Offline သိမ်းထားရန် `.update` လို့ Message ပို့၍ဖြစ်စေ၊ Browser ကနေတဆင့်ဖြစ်စေ၊ [`http://localhost:3001/update`](http://localhost:3001/update) ကို ၀င်ရောက်ပြီး Update တင်ပေးပါ။**

<a id="Update" href="#Update"></a>

### Version Update

အဆင့်(၁) `Termux` App ကိုဖွင့်ပါ။

အဆင့်(၂) `cd smsbot`

အဆင့်(၃) `git pull --ff`

အဆင့်(၄) `npm run build`

အဆင့်(၅) `npm run server`

**အဆင်မပြေတာရှိရင် [m.me/nweoo22222](https://m.me/nweoo22222) ကတဆင့်မေးမြန်းနိုင်ပါတယ်။ Error များရှိပါသေးတယ်။ Perfect တော့မဖြစ်သေးတာကြောင့် တက်ခဲ့ပါက ပြန်ပြင်နိုင်ဖို့ ပြန်ပြောပေးကြပါ။ Version Update ရှိခဲ့ရင်လည်း [http://localhost:3001](http://localhost:3001) ကို ၀င်ကြည့်တဲ့အခါ alert ပေးပါလိမ့်မယ်။**
