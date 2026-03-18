import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTransactions } from '../src/useTransactions';
import { COLORS, CAT_COLORS, CAT_ICONS, CATEGORIES, fmtCur, fmtDate } from '../src/constants';

export default function Dashboard() {
  const { transactions } = useTransactions();
  const totalDebit  = useMemo(() => transactions.filter(t=>t.type==='debit').reduce((s,t)=>s+t.amount,0),  [transactions]);
  const totalCredit = useMemo(() => transactions.filter(t=>t.type==='credit').reduce((s,t)=>s+t.amount,0), [transactions]);
  const balance     = totalCredit - totalDebit;
  const recent      = useMemo(() => [...transactions].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6), [transactions]);
  const cats        = useMemo(() => CATEGORIES.map(c=>({ c, amt:transactions.filter(t=>t.type==='debit'&&t.category===c).reduce((s,t)=>s+t.amount,0) })).filter(x=>x.amt>0).sort((a,b)=>b.amt-a.amt), [transactions]);

  return (
    <ScrollView style={s.container} contentContainerStyle={{paddingBottom:32}}>
      {/* Stat row */}
      <View style={s.row}>
        <View style={[s.statCard,{flex:1}]}>
          <Text style={s.statLabel}>TOTAL SPENT</Text>
          <Text style={[s.statAmt,{color:COLORS.red}]}>{fmtCur(totalDebit)}</Text>
          <Text style={s.statSub}>{transactions.filter(t=>t.type==='debit').length} debits</Text>
        </View>
        <View style={[s.statCard,{flex:1}]}>
          <Text style={s.statLabel}>RECEIVED</Text>
          <Text style={[s.statAmt,{color:COLORS.green}]}>{fmtCur(totalCredit)}</Text>
          <Text style={s.statSub}>{transactions.filter(t=>t.type==='credit').length} credits</Text>
        </View>
      </View>

      {/* Balance */}
      <View style={[s.balCard,{borderColor:balance>=0?'#1a3a2a':'#3a1a1a'}]}>
        <Text style={s.statLabel}>NET BALANCE</Text>
        <Text style={[s.balAmt,{color:balance>=0?COLORS.green:COLORS.red}]}>{fmtCur(Math.abs(balance))}</Text>
        <Text style={s.statSub}>{balance>=0?'▲ Surplus':'▼ Deficit'}</Text>
      </View>

      {/* Recent */}
      <View style={s.card}>
        <Text style={s.sectionTitle}>Recent Activity</Text>
        {recent.length===0
          ? <Text style={s.empty}>No transactions yet. Tap + to add one.</Text>
          : recent.map(tx=>(
            <View key={tx.id} style={s.txRow}>
              <View style={[s.icon,{backgroundColor:CAT_COLORS[tx.category]+'20'}]}>
                <Text style={{fontSize:18}}>{CAT_ICONS[tx.category]}</Text>
              </View>
              <View style={{flex:1,marginRight:8}}>
                <Text style={s.txDesc} numberOfLines={1}>{tx.description}</Text>
                <Text style={s.txMeta}>{fmtDate(tx.date)} · <Text style={{color:CAT_COLORS[tx.category]}}>{tx.category}</Text></Text>
              </View>
              <Text style={[s.txAmt,{color:tx.type==='debit'?COLORS.red:COLORS.green}]}>
                {tx.type==='debit'?'-':'+'}{fmtCur(tx.amount)}
              </Text>
            </View>
          ))}
      </View>

      {/* Category bars */}
      {cats.length>0 && (
        <View style={s.card}>
          <Text style={s.sectionTitle}>Spending by Category</Text>
          {cats.map(({c,amt})=>(
            <View key={c} style={{marginBottom:14}}>
              <View style={s.catRow}>
                <Text style={s.catLabel}>{CAT_ICONS[c]} {c}</Text>
                <Text style={[s.catAmt,{color:CAT_COLORS[c]}]}>{fmtCur(amt)}</Text>
              </View>
              <View style={s.barBg}>
                <View style={[s.barFg,{backgroundColor:CAT_COLORS[c],width:`${Math.min(100,(amt/totalDebit)*100)}%`}]}/>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.bg,padding:16},
  row:{flexDirection:'row',gap:12,marginBottom:12},
  statCard:{backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.border,borderRadius:16,padding:16},
  statLabel:{fontSize:10,color:COLORS.text3,fontWeight:'700',textTransform:'uppercase',letterSpacing:0.6,marginBottom:6},
  statAmt:{fontSize:22,fontWeight:'700',marginBottom:4},
  statSub:{fontSize:12,color:COLORS.text4},
  balCard:{backgroundColor:COLORS.surface,borderWidth:1,borderRadius:16,padding:20,marginBottom:12,alignItems:'center'},
  balAmt:{fontSize:34,fontWeight:'700',marginBottom:4},
  card:{backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.border,borderRadius:16,padding:16,marginBottom:12},
  sectionTitle:{fontSize:11,color:COLORS.text2,fontWeight:'700',textTransform:'uppercase',letterSpacing:0.6,marginBottom:14},
  empty:{color:COLORS.text4,fontSize:14,textAlign:'center',paddingVertical:16},
  txRow:{flexDirection:'row',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderBottomColor:COLORS.border2},
  icon:{width:40,height:40,borderRadius:12,alignItems:'center',justifyContent:'center',marginRight:12},
  txDesc:{fontSize:14,fontWeight:'600',color:COLORS.text,marginBottom:3},
  txMeta:{fontSize:12,color:COLORS.text4},
  txAmt:{fontSize:14,fontWeight:'700'},
  catRow:{flexDirection:'row',justifyContent:'space-between',marginBottom:6},
  catLabel:{fontSize:13,color:COLORS.text2},
  catAmt:{fontSize:12,fontWeight:'600'},
  barBg:{backgroundColor:COLORS.border,borderRadius:4,height:6,overflow:'hidden'},
  barFg:{height:6,borderRadius:4},
});
