import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTransactions } from '../src/useTransactions';
import { COLORS, CAT_COLORS, CAT_ICONS, CATEGORIES, UPI_APPS, BANKS, today, uid } from '../src/constants';

export default function Add() {
  const { addTransaction } = useTransactions();
  const [amount,   setAmount]   = useState('');
  const [type,     setType]     = useState('debit');
  const [source,   setSource]   = useState('UPI');
  const [app,      setApp]      = useState('GPay');
  const [bank,     setBank]     = useState('HDFC');
  const [desc,     setDesc]     = useState('');
  const [category, setCategory] = useState('Other');
  const [date,     setDate]     = useState(today());

  const reset = () => { setAmount(''); setDesc(''); setType('debit'); setSource('UPI'); setApp('GPay'); setBank('HDFC'); setCategory('Other'); setDate(today()); };

  const handleAdd = () => {
    const amt = parseFloat(amount);
    if (!amt || isNaN(amt)) { Alert.alert('Invalid amount','Please enter a valid number'); return; }
    addTransaction({ id:uid(), amount:amt, type, source, description:desc||(source==='UPI'?app:bank), category, date, bank });
    reset();
    Alert.alert('✓ Saved!','Transaction added successfully.');
  };

  const Row = ({ label, options, value, onChange }) => (
    <View style={{marginBottom:18}}>
      <Text style={s.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map(o=>(
          <TouchableOpacity key={o} style={[s.pill, value===o&&s.pillOn]} onPress={()=>onChange(o)}>
            <Text style={[s.pillTxt, value===o&&s.pillTxtOn]}>{o}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={s.container} contentContainerStyle={{padding:20,paddingBottom:60}}>
      <Text style={s.label}>Amount (₹)</Text>
      <TextInput style={s.input} placeholder="0.00" placeholderTextColor={COLORS.text3} keyboardType="numeric" value={amount} onChangeText={setAmount}/>

      <Text style={s.label}>Type</Text>
      <View style={{flexDirection:'row',gap:10,marginBottom:18}}>
        <TouchableOpacity style={[s.typeBtn, type==='debit'&&{backgroundColor:'#1e1215',borderColor:'#7f1d1d'}]} onPress={()=>setType('debit')}>
          <Text style={[s.typeTxt, type==='debit'&&{color:COLORS.red}]}>↑ Debit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.typeBtn, type==='credit'&&{backgroundColor:'#0d1f17',borderColor:'#14532d'}]} onPress={()=>setType('credit')}>
          <Text style={[s.typeTxt, type==='credit'&&{color:COLORS.green}]}>↓ Credit</Text>
        </TouchableOpacity>
      </View>

      <Row label="SOURCE" options={['UPI','NEFT','IMPS','Bank']} value={source} onChange={setSource}/>
      {source==='UPI' && <Row label="UPI APP" options={UPI_APPS} value={app} onChange={setApp}/>}
      <Row label="BANK" options={BANKS} value={bank} onChange={setBank}/>

      <Text style={s.label}>Description</Text>
      <TextInput style={s.input} placeholder="e.g. Grocery, Salary..." placeholderTextColor={COLORS.text3} value={desc} onChangeText={setDesc}/>

      <Text style={s.label}>Category</Text>
      <View style={s.catGrid}>
        {CATEGORIES.map(c=>(
          <TouchableOpacity key={c} style={[s.catBtn, category===c&&{backgroundColor:CAT_COLORS[c]+'33',borderColor:CAT_COLORS[c]}]} onPress={()=>setCategory(c)}>
            <Text style={{fontSize:22,marginBottom:4}}>{CAT_ICONS[c]}</Text>
            <Text style={[s.catTxt, category===c&&{color:CAT_COLORS[c]}]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.label}>Date (YYYY-MM-DD)</Text>
      <TextInput style={s.input} placeholder="2026-03-18" placeholderTextColor={COLORS.text3} value={date} onChangeText={setDate}/>

      <TouchableOpacity style={s.addBtn} onPress={handleAdd}>
        <Text style={s.addTxt}>+ Save Transaction</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{alignItems:'center',paddingVertical:14}} onPress={reset}>
        <Text style={{color:COLORS.text3,fontWeight:'600'}}>Reset Form</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.bg},
  label:{fontSize:11,color:COLORS.text3,fontWeight:'700',textTransform:'uppercase',letterSpacing:0.6,marginBottom:8},
  input:{backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.border,borderRadius:10,padding:13,color:COLORS.text,fontSize:15,marginBottom:18},
  typeBtn:{flex:1,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.border,borderRadius:10,paddingVertical:12,alignItems:'center'},
  typeTxt:{fontSize:15,fontWeight:'700',color:COLORS.text2},
  pill:{backgroundColor:COLORS.border,borderRadius:20,paddingHorizontal:16,paddingVertical:8,marginRight:8,marginBottom:2},
  pillOn:{backgroundColor:'#1e3a5f'},
  pillTxt:{fontSize:13,color:COLORS.text2,fontWeight:'500'},
  pillTxtOn:{color:'#60a5fa',fontWeight:'700'},
  catGrid:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:18},
  catBtn:{backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.border,borderRadius:12,padding:12,alignItems:'center',minWidth:'22%',flex:1},
  catTxt:{fontSize:10,color:COLORS.text2,fontWeight:'600'},
  addBtn:{backgroundColor:'#3b82f6',borderRadius:12,paddingVertical:16,alignItems:'center',marginTop:8},
  addTxt:{color:'white',fontSize:16,fontWeight:'700'},
});
