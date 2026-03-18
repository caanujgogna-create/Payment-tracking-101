import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTransactions } from '../src/useTransactions';
import { COLORS, CAT_COLORS, CAT_ICONS, CATEGORIES, fmtCur } from '../src/constants';

export default function Insights() {
  const { transactions } = useTransactions();
  const totalDebit  = useMemo(() => transactions.filter(t=>t.type==='debit').reduce((s,t)=>s+t.amount,0)||1,  [transactions]);
  const totalCredit = useMemo(() => transactions.filter(t=>t.type==='credit').reduce((s,t)=>s+t.amount,0), [transactions]);
  const cats = useMemo(() => CATEGORIES.map(c=>({c,amt:transactions.filter(t=>t.type==='debit'&&t.category===c).reduce((s,t)=>s+t.amount,0)})).filter(x=>x.amt>0).sort((a,b)=>b.amt-a.amt), [transactions]);
  const total = transactions.length||1;
  const debits  = transactions.filter(t=>t.type==='debit');
  const credits = transactions.filter(t=>t.type==='credit');
  const srcColors = {UPI:'#6366f1',NEFT:'#3b82f6',IMPS:'#8b5cf6',Bank:'#10b981'};
  const srcIcons  = {UPI:'⚡',NEFT:'🔄',IMPS:'🔁',Bank:'🏦'};

  return (
    <ScrollView style={s.container} contentContainerStyle={{paddingBottom:40}}>
      {/* Sources */}
      <View style={s.card}>
        <Text style={s.secTitle}>PAYMENT SOURCES</Text>
        {['UPI','NEFT','IMPS','Bank'].map(src=>{
          const count = transactions.filter(t=>t.source===src).length;
          const amt   = transactions.filter(t=>t.source===src&&t.type==='debit').reduce((ss,t)=>ss+t.amount,0);
          if (!count) return null;
          return (
            <View key={src} style={s.srcRow}>
              <Text style={{fontSize:22}}>{srcIcons[src]}</Text>
              <View style={{flex:1,marginLeft:12}}>
                <View style={s.rowBetween}>
                  <Text style={s.srcName}>{src}</Text>
                  <Text style={s.srcCount}>{count} txn{count>1?'s':''}</Text>
                </View>
                <View style={s.barBg}><View style={[s.barFg,{backgroundColor:srcColors[src],width:`${(count/total)*100}%`}]}/></View>
                {amt>0&&<Text style={s.srcAmt}>Spent {fmtCur(amt)}</Text>}
              </View>
            </View>
          );
        })}
      </View>

      {/* Categories */}
      <View style={s.card}>
        <Text style={s.secTitle}>CATEGORY BREAKDOWN</Text>
        {cats.length===0
          ? <Text style={s.empty}>No spending data yet</Text>
          : cats.map(({c,amt})=>(
            <View key={c} style={s.catRow}>
              <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
                <Text style={{fontSize:18}}>{CAT_ICONS[c]}</Text>
                <Text style={s.catName}>{c}</Text>
              </View>
              <View style={{alignItems:'flex-end'}}>
                <Text style={[s.catAmt,{color:CAT_COLORS[c]}]}>{fmtCur(amt)}</Text>
                <Text style={s.catPct}>{((amt/totalDebit)*100).toFixed(1)}%</Text>
              </View>
            </View>
          ))}
      </View>

      {/* Summary */}
      <View style={s.card}>
        <Text style={s.secTitle}>SUMMARY</Text>
        <View style={s.grid}>
          {[
            ['Transactions', transactions.length],
            ['Avg Amount',   transactions.length ? fmtCur((totalDebit+totalCredit)/transactions.length) : '₹0'],
            ['Largest Debit', debits.length  ? fmtCur(Math.max(...debits.map(t=>t.amount)))  : '₹0'],
            ['Largest Credit',credits.length ? fmtCur(Math.max(...credits.map(t=>t.amount))) : '₹0'],
          ].map(([label,value])=>(
            <View key={label} style={s.statBox}>
              <Text style={s.statVal}>{value}</Text>
              <Text style={s.statLbl}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.bg,padding:16},
  card:{backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.border,borderRadius:16,padding:18,marginBottom:14},
  secTitle:{fontSize:10,color:COLORS.text2,fontWeight:'700',textTransform:'uppercase',letterSpacing:0.7,marginBottom:14},
  srcRow:{flexDirection:'row',alignItems:'center',marginBottom:16},
  rowBetween:{flexDirection:'row',justifyContent:'space-between',marginBottom:6},
  srcName:{fontSize:14,fontWeight:'600',color:COLORS.text2},
  srcCount:{fontSize:13,color:COLORS.text3},
  srcAmt:{fontSize:11,color:COLORS.text4,marginTop:3},
  barBg:{backgroundColor:COLORS.border,borderRadius:4,height:6,overflow:'hidden'},
  barFg:{height:6,borderRadius:4},
  catRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderBottomColor:COLORS.border2},
  catName:{fontSize:14,color:COLORS.text2},
  catAmt:{fontSize:14,fontWeight:'700'},
  catPct:{fontSize:11,color:COLORS.text4,marginTop:2},
  empty:{color:COLORS.text4,fontSize:14,textAlign:'center',paddingVertical:10},
  grid:{flexDirection:'row',flexWrap:'wrap',gap:10},
  statBox:{backgroundColor:COLORS.bg,borderRadius:12,padding:14,flex:1,minWidth:'44%',alignItems:'center'},
  statVal:{fontSize:20,fontWeight:'700',color:'#60a5fa',marginBottom:6},
  statLbl:{fontSize:11,color:COLORS.text4,textAlign:'center'},
});
