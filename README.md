# SMS Bot လုပ်ချင်သူများအတွက်

`#nweoosmsbot` - `v1.1.2`

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

အဆင့်(၈) `npm start`

### Macrodroid (App)

အဆင့်(၁) `Macrodroid` App ကိုဖွင့်ပါ။

အဆင့်(၂) [smsbot-macro-v1.1.2.mdr](https://nweoofact.page.link/smsbot) ကိုဒေါင်းလုပ်ဆွဲပါ။

အဆင့်(၃) Export/Import ထဲ၀င်ပြီး Import ကိုရွေးချယ်ပါ။

အဆင့်(၄) ဒေါင်းလုပ်ဆွဲခဲ့တဲ့ဖိုင်ကိုရွေးပြီးသွင်းလိုက်ပါ။

အဆင့်(၅) SMS, Call & Notification နဲ့ ပတ်သက်တဲ့ Permission များပေးပါ။

အဆင့်(၆) Incoming Call တွေ Block ချင်ရင် `macros` ထဲက ​`call` > `blocked` ကိုဖွင့်ပါ။

အဆင့်(၇) SMS Bot ကိုစတင်ရန် `macros` ထဲက `SMS` > `smsbot(telenor)`ကိုဖွင့်ပါ။

### အခြား

အပေါ်ကလုပ်ဆောင်ရမဲ့ (၂) ခုလုံးလုပ်ဆောင်ပြီးမှ အဆင့်သင့်ဖြစ်ပြီဆိုရင် Browser ထဲကနေတဆင့် [`http://localhost:3001`](http://localhost:3001) သွားရောက်ပြီး `Update Articles` ကိုနှိပ်၍ DVB က သတင်းတွေကို ကျွန်တော်တို့ [api.nweoo.com/articles](http://api.nweoo.com/articles) ကနေတဆင့် update တင်ပြီးစတင်အသုံးပြုနိုင်ပါပြီ။

**အင်တာနက်ရတာမသေချာတဲ့အတွက် Auto Upload လုပ်တဲ့စနစ်မပါပါဘူး။ ရတဲ့အချိန် Offline သိမ်းထားရန် `.update` လို့ Message ပို့၍ဖြစ်စေ၊ Browser ကနေတဆင့်ဖြစ်စေ၊ [`http://localhost:3001/update`](http://localhost:3001/update) ကို ၀င်ရောက်ပြီး Update တင်ပေးပါ။**
