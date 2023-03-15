const express=require("express")
const route=express()
const model=require("../model/crud_user_db")
const User=require("../model/user_db")


route.get("/homeland",async(req,res)=>{
    res.render("homeland")
})

// RETRIEVEING / SHOWING DATA______________
route.get('/home', async (req, res) => {
    try {
      const userId = req.session.user_id;
      const user = await User.findById(userId).populate({
        path: 'crud_user_db',
        match: { user: userId }
      });
      
      const all_retrive_data = await model.find({user: userId});
      res.render("home", { ret_data: all_retrive_data });
    } catch (error) {
      console.log("ERROR IN RECORD_TABLE/RETRIEVE PART" + error)
    }
  })
  
// __________________________________________

route.get('/newtrade',(req,res)=>{
    res.render("newtrade")
})

// GETTING ID TO UPDATE___________
route.get('/updatetrade/:id',async(req,res)=>{
    try {
        const srch_key=await model.findById(req.params.id)
        res.render("updatetrade",{srch_key})

    } catch (error) {
        console.log("ERROR IN Get UPDATE PART"+error)
    }
})
// ____________________________________

// ADD TRADE POST REQUEST________________________
route.post("/add-trade",async(req,res)=>{
    try {
        const{Date,Script,Entrytime,Entryprice,Exittime,Exitprice,StopLoss,Qty,StrategyName}=req.body
        const userId = req.session.user_id;
        const dash_det= new model({
            user: userId, // set the user ID
            Date:Date,
            Script:Script,
            Entrytime:Entrytime,
            Entryprice:Entryprice,
            Exittime:Exittime,
            Exitprice:Exitprice,
            StopLoss:StopLoss,
            Qty:Qty,
            StrategyName:StrategyName
        })

        const dashresult=await dash_det.save()
        await User.findByIdAndUpdate(userId, { $push: { cruds: dashresult._id } });

        res.redirect("/home")

    } catch (error) {
        console.log("ERROR IN RECORD_TABLE/ADD TRADE API PART"+error)

    }
})
// ______________________________________________

// Update Trade POST Api___________________
route.post("/updatetrade/:id",async(req,res)=>{
    try {
        const{Date,Script,Entrytime,Entryprice,Exittime,Exitprice,StopLoss,Qty,StrategyName}=req.body

        await model.findByIdAndUpdate(req.params.id,{
            Date:Date,
            Script:Script,
            Entrytime:Entrytime,
            Entryprice:Entryprice,
            Exittime:Exittime,
            Exitprice:Exitprice,
            StopLoss:StopLoss,
            Qty:Qty,
            StrategyName:StrategyName
        })
        res.redirect("/home")
    } catch (error) {
        console.log("\nERROR IN RECORD_TABLE/UPDATE TRADE POST"+error)
    }
})
// ___________________________________


// DELETION API_______________________
route.post('/deletetrade/:id',async(req,res)=>{
    try {
        const delete_trade=await model.findByIdAndDelete(req.params.id)
        res.redirect('/home')
    } catch (error) {
        console.log("\nERROR IN DELETION API"+ error)
    }
})
// ___________________________________

// ANALYTI SECTION______________________________________
route.get('/analytic', async (req, res) => {

    try {
      const collection = model
      const userId = req.session.user_id;
  
      const cursor = await collection.find({ user: userId });
  
      // Store the trade details in an array
      const entry_p = [];
      const exit_p = [];
      const qtyy = [];
      const sl = [];
      const best_entry_time=[];
      const best_strategy=[];
      const best_day_to_trade=[];

       cursor.forEach(trade => {
        entry_p.push({
          entryPrice: trade.Entryprice,
        });
        best_day_to_trade.push({
          be_day: trade.Date,
        });
        best_strategy.push({
          st_name: trade.StrategyName,
        });
        exit_p.push({
          exitPrice: trade.Exitprice,
        });
        qtyy.push({
          quantity: trade.Qty,
        });
        sl.push({
            stopLoss: trade.StopLoss,
        });
        best_entry_time.push({
            entrytime: trade.Entrytime,
        });

      });
      const INT_MAX = Math.pow(2, 31) - 1;
      const data = entry_p
      const data1 = exit_p
      const data2 = sl
      const data3 = best_entry_time
      const data4 = best_strategy
      const data5 =  best_day_to_trade

      const ep = data.map(obj => obj.entryPrice);
      const ex = data1.map(obj => obj.exitPrice);
      const Sl = data2.map(obj => obj.stopLoss);
      const entry_time = data3.map(obj => obj.entrytime);
      const best_strat = data4.map(obj => obj.st_name);
      const best_daytrade = data5.map(obj => obj.be_day);

      var sum_prof=0,sum_loss=0;var mx_profit=0,mx_loss=0;
      var cost_of_trade=0;
      for(let i=0;i<Sl.length;i++){
          cost_of_trade+=Sl[i];

      }
 
      for(let i = 0; i < ep.length; i++) {
          if(ex[i] - ep[i] >= 0) { 
            sum_prof += ex[i] - ep[i];
          } else if(ex[i] - ep[i] < 0) { 
            sum_loss += Math.abs(ex[i] - ep[i]);
          }
      }
      
      for(let i=0;i<ep.length;i++){
            mx_profit=Math.max(mx_profit,(ex[i]-ep[i]));
            mx_loss=Math.min(mx_loss,(ex[i]-ep[i]));
      }
      mx_loss=Math.abs(mx_loss)
      var win=0,loss=0;
      for(let i=0;i<ep.length;i++){
            if(ex[i]-ep[i]>0){win++;}
            if(ex[i]-ep[i]<0){loss++;}
        }
        var avgwin=sum_prof/win,avgloss=sum_loss/loss;
        var total_roi=  (sum_prof-cost_of_trade)/cost_of_trade;
        var total_trades=ep.length;
        var bt_avg=win/ep.length;
        var prof_fac=sum_prof/sum_loss;
        var rec_fac=sum_prof/mx_loss;
       
        


      console.log("Total Profit; "+sum_prof); 
      console.log("Total Loss; "+sum_loss); 
      console.log("MAX PROFIT: "+mx_profit); 
      console.log("MAX LOSS: "+(mx_loss)); 
      console.log("Number Winning Trades "+win+"\nNumber Losing Trades "+loss)
      console.log("AVERAGE Winning Trades "+avgwin+"\nAverage Losing Trade "+avgloss)
      console.log("ROI "+total_roi.toFixed(2))
      console.log("Total trades "+total_trades)
      console.log("Batting Average:"+bt_avg)
      console.log("Profit factor:"+prof_fac.toFixed(2))
      console.log("Recovery Factor:"+rec_fac.toFixed(2))

      let profittimes = [];
      for (let i = 0; i < entry_time.length; i++) {
        if (ex[i] - ep[i] > 0) {
          profittimes.push(entry_time[i]);
        }
      }
      // Count the frequency of each element in the array
    const frequency = {};
    for (let i = 0; i < profittimes.length; i++) {
      const element = profittimes[i];
      frequency[element] = frequency[element] ? frequency[element] + 1 : 1;
    }

    let maxElement='';
    let maxFrequency = 0;
    for (const [element, freq] of Object.entries(frequency)) {
    if (freq > maxFrequency) {
      maxElement = element;
      maxFrequency = freq;
    }
  }
console.log("The Best profitable Entry time"+ maxElement);
      
let strategies = [];
      for (let i = 0; i < entry_time.length; i++) {
        if (ex[i] - ep[i] > 0) {
          strategies.push(best_strat[i]);
        }
      }
    const frequency_str = {};
    for (let i = 0; i < strategies.length; i++) {
      const element = strategies[i];
      frequency_str[element] = frequency_str[element] ? frequency_str[element] + 1 : 1;
    }

    let max_str='';
    let maxFreq = 0;
    for (const [element, freq] of Object.entries(frequency_str)) {
    if (freq > maxFreq) {
      max_str = element;
      maxFreq = freq;
    }
  }
console.log("The Best profitable Strategy"+ max_str);

let days_trade = [];

for (let i = 0; i < entry_time.length; i++) {
  if (ex[i] - ep[i] > 0) {
    const dateString = best_daytrade[i];
    const dateObject = new Date(dateString);
    const dayOfWeek = dateObject.toLocaleString("en-US", { weekday: "long" });
    days_trade.push(dayOfWeek);
  }
}

const frequency_str_da = {};
for (let i = 0; i < days_trade.length; i++) {
  const element = days_trade[i];
  frequency_str_da[element] = frequency_str_da[element] ? frequency_str_da[element] + 1 : 1;
}

let max_str_da = '';
let maxFre = 0;
for (const [element, freq] of Object.entries(frequency_str_da)) {
  if (freq > maxFre) {
    max_str_da = element;
    maxFre = freq;
  }
}

console.log("The Best profitable DAY: " + max_str_da);

const trade_analysis = {
  Totalprofit: sum_prof,
  Totalloss: sum_loss,
  MaxProfit: mx_profit,
  MaxLoss: mx_loss,
  Number_of_Win_trades:win,
  Number_of_Loss_trades:loss,
  Average_wining_trade:avgwin,
  Average_lossing_trade:avgloss.toFixed(2),
  ROI:total_roi.toFixed(2),
  TotalTrades:total_trades,
  BattingAverage:bt_avg,
  ProfitFactor:prof_fac.toFixed(2),
  RecoveryFactor:rec_fac.toFixed(2),
  BestProfitablEntryTime:maxElement,
  BestProfitablStrategy:max_str,
  BestProfitablDayToTrade:max_str_da
};


res.render('analytic', {
  trade_analysis: trade_analysis
});
    } 
    catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    } 
  });
// _____________________________________________________
module.exports=route



  

